import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DashboardTab,
  InvestmentOpportunity,
  PageRoute,
  PortfolioHolding,
  ReferredFriend,
  Transaction,
  UserProfile,
} from '../types';
import { INITIAL_HOLDINGS, INITIAL_TRANSACTIONS, INITIAL_USER, OPPORTUNITIES } from '../data/mockData';
import { formatDate, formatFCFA, formatXAF, todayIso } from '../utils/format';
import { hashToRoute, readReferralFromUrl, routeToHash } from '../lib/routing';
import {
  INVESTMENT_STEP,
  MIN_INVESTMENT,
  addMonthsIso,
  effectiveRate,
  hasReached,
  lockMonthsFor,
  tierForAmount,
} from '../lib/investmentTiers';
import { readStorage, writeStorage } from '../lib/storage';
import { useI18n } from '../i18n/LanguageContext';
import { getFirebase, FirebaseUser } from '../lib/firebase';

export type { PageRoute, DashboardTab };

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export type ModalName = 'invest' | 'kyc' | 'deposit' | 'withdraw' | 'auth' | null;

const SAVED_KEY = 'growthfund_saved';
const MIN_WITHDRAWAL = 5_000;
const WITHDRAWAL_STEP = 5_000;
const REFERRAL_BONUS = 1_000;

interface AppContextType {
  // Routing
  currentPage: PageRoute;
  navigate: (page: PageRoute, options?: { tab?: DashboardTab; opportunityId?: string }) => void;
  selectedOpportunityId: string | null;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  navigateToOpportunity: (id: string) => void;

  // Auth
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (
    email: string,
    pass: string,
    name: string,
    referralCode?: string,
  ) => Promise<boolean>;
  signOutUser: () => Promise<void>;

  // Data
  user: UserProfile;
  holdings: PortfolioHolding[];
  transactions: Transaction[];
  opportunities: InvestmentOpportunity[];
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (id: string) => void;

  // Modals — one piece of state instead of five independent booleans,
  // so two dialogs can never be open at once.
  activeModal: ModalName;
  openModal: (name: Exclude<ModalName, null>) => void;
  closeModal: () => void;
  investingOpportunity: InvestmentOpportunity | null;
  openInvestModal: (opp: InvestmentOpportunity) => void;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode: 'signin' | 'signup') => void;

  // Command palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Actions
  applyReferralCode: (code: string) => Promise<boolean>;
  simulateFriendReferral: (friendName?: string) => Promise<void>;
  executeInvestment: (opportunityId: string, amount: number) => Promise<boolean>;
  /**
   * Returns a matured holding's capital to the cash balance. Refuses
   * while the holding is still inside its lock-in period.
   */
  redeemHolding: (holdingId: string) => Promise<boolean>;
  executeDeposit: (amount: number, method: string, accountDetails?: string) => Promise<boolean>;
  executeWithdrawal: (amount: number, method: string, accountDetails?: string) => Promise<boolean>;
  completeKYC: (tier: 'Tier 1 Verified' | 'Tier 2 Accredited') => Promise<void>;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const readSavedIds = (): string[] => {
  const raw = readStorage(SAVED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, language } = useI18n();

  // ---------------------------------------------------------------
  // Routing — driven by the URL hash so back/forward and deep links work
  // ---------------------------------------------------------------
  const initialRoute = useMemo(() => hashToRoute(window.location.hash), []);
  const [currentPage, setCurrentPage] = useState<PageRoute>(initialRoute.page);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(
    initialRoute.opportunityId ?? OPPORTUNITIES[0].id,
  );
  const [dashboardTab, setDashboardTabState] = useState<DashboardTab>(
    initialRoute.tab ?? 'overview',
  );

  // Suppresses the hashchange handler while we are the ones writing the hash.
  const isInternalNavigation = useRef(false);

  const navigate = useCallback(
    (page: PageRoute, options?: { tab?: DashboardTab; opportunityId?: string }) => {
      setCurrentPage(page);
      if (options?.opportunityId) setSelectedOpportunityId(options.opportunityId);
      if (options?.tab) setDashboardTabState(options.tab);

      const hash = routeToHash({
        page,
        opportunityId: options?.opportunityId ?? selectedOpportunityId ?? undefined,
        tab: options?.tab ?? dashboardTab,
      });

      if (window.location.hash !== hash) {
        isInternalNavigation.current = true;
        window.location.hash = hash;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectedOpportunityId, dashboardTab],
  );

  const setDashboardTab = useCallback(
    (tab: DashboardTab) => {
      setDashboardTabState(tab);
      const hash = routeToHash({ page: 'dashboard', tab });
      if (window.location.hash !== hash) {
        isInternalNavigation.current = true;
        window.location.hash = hash;
      }
    },
    [],
  );

  const navigateToOpportunity = useCallback(
    (id: string) => navigate('detail', { opportunityId: id }),
    [navigate],
  );

  // React to the browser back/forward buttons.
  useEffect(() => {
    const onHashChange = () => {
      if (isInternalNavigation.current) {
        isInternalNavigation.current = false;
        return;
      }
      const route = hashToRoute(window.location.hash);
      setCurrentPage(route.page);
      if (route.opportunityId) setSelectedOpportunityId(route.opportunityId);
      if (route.tab) setDashboardTabState(route.tab);
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Make sure the address bar always shows a canonical route.
  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/');
    }
  }, []);

  // ---------------------------------------------------------------
  // Auth & data state
  // ---------------------------------------------------------------
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(INITIAL_HOLDINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [opportunities, setOpportunities] =
    useState<InvestmentOpportunity[]>(OPPORTUNITIES);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(readSavedIds);

  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [investingOpportunity, setInvestingOpportunity] =
    useState<InvestmentOpportunity | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const unsubsRef = useRef<(() => void)[]>([]);
  const toastTimers = useRef<Map<string, number>>(new Map());

  const isAuthenticated = firebaseUser !== null;

  // ---------------------------------------------------------------
  // Toasts
  // ---------------------------------------------------------------
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      // Errors stay longer — they usually need reading, not glancing at.
      const timeout = type === 'error' ? 7000 : 4500;
      const timer = window.setTimeout(() => removeToast(id), timeout);
      toastTimers.current.set(id, timer);
    },
    [removeToast],
  );

  // Clear pending timers on unmount so they cannot fire into a dead tree.
  useEffect(() => {
    const timers = toastTimers.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  // ---------------------------------------------------------------
  // Saved opportunities (persisted)
  // ---------------------------------------------------------------
  const toggleSaveOpportunity = useCallback(
    (id: string) => {
      setSavedOpportunityIds((prev) => {
        const exists = prev.includes(id);
        const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
        writeStorage(SAVED_KEY, JSON.stringify(next));
        addToast(t(exists ? 'toast.unsaved' : 'toast.saved'), exists ? 'info' : 'success');
        return next;
      });
    },
    [addToast, t],
  );

  // ---------------------------------------------------------------
  // Modals
  // ---------------------------------------------------------------
  const openModal = useCallback((name: Exclude<ModalName, null>) => setActiveModal(name), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const openInvestModal = useCallback((opp: InvestmentOpportunity) => {
    setInvestingOpportunity(opp);
    setActiveModal('invest');
  }, []);

  const openAuthModal = useCallback((mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setActiveModal('auth');
  }, []);

  // ---------------------------------------------------------------
  // Firestore sync
  // ---------------------------------------------------------------
  const getInitials = (name: string, email: string) => {
    if (name?.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    return email ? email.slice(0, 2).toUpperCase() : 'GF';
  };

  const syncUserFromFirestore = useCallback(async (fbUser: FirebaseUser) => {
    try {
      const { db, dbApi } = await getFirebase();
      const { collection, doc, getDoc, onSnapshot, setDoc } = dbApi;

      const userDocRef = doc(db, 'users', fbUser.uid);
      const snapshot = await getDoc(userDocRef);

      if (!snapshot.exists()) {
        const initials = getInitials(fbUser.displayName ?? '', fbUser.email ?? '');
        const suffix = Math.floor(1000 + Math.random() * 9000);
        const namePart = (fbUser.displayName?.split(' ')[0] ?? 'XAF')
          .toUpperCase()
          .replace(/[^A-Z]/g, '')
          .slice(0, 5);

        const newProfile: UserProfile = {
          uid: fbUser.uid,
          photoURL: fbUser.photoURL ?? undefined,
          name: fbUser.displayName ?? 'Investor',
          email: fbUser.email ?? '',
          initials,
          accountNumber: `GF-XAF-${Math.floor(10_000_000 + Math.random() * 90_000_000)}`,
          kycTier: 'Tier 1 Verified',
          isKycApproved: true,
          walletBalance: 250_000,
          totalInvested: 0,
          totalReturns: 0,
          activeInvestmentsCount: 0,
          joinedDate: todayIso(),
          referralCode: `GF-${namePart}${suffix}`,
          referralCount: 0,
          referralEarnings: 0,
          referredFriends: [],
        };

        await setDoc(userDocRef, {
          ...newProfile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        try {
          await setDoc(doc(db, 'referralCodes', newProfile.referralCode), {
            code: newProfile.referralCode,
            ownerUid: fbUser.uid,
            createdAt: new Date().toISOString(),
          });
        } catch {
          /* Index write is best-effort. */
        }

        setUser(newProfile);
        // A brand-new account starts empty rather than inheriting the
        // demo portfolio, so the numbers on screen match what the user did.
        setHoldings([]);
        setTransactions([]);
      } else {
        const data = snapshot.data() as UserProfile;
        setUser({
          ...data,
          uid: fbUser.uid,
          photoURL: fbUser.photoURL ?? data.photoURL,
          email: fbUser.email ?? data.email,
        });
      }

      unsubsRef.current.push(
        onSnapshot(userDocRef, (snap) => {
          if (!snap.exists()) return;
          const data = snap.data() as UserProfile;
          setUser((prev) => ({ ...prev, ...data, uid: fbUser.uid }));
        }),
      );

      unsubsRef.current.push(
        onSnapshot(collection(db, 'users', fbUser.uid, 'holdings'), (snap) => {
          const list: PortfolioHolding[] = [];
          snap.forEach((entry) => list.push(entry.data() as PortfolioHolding));
          setHoldings(list);
        }),
      );

      unsubsRef.current.push(
        onSnapshot(collection(db, 'users', fbUser.uid, 'transactions'), (snap) => {
          const list: Transaction[] = [];
          snap.forEach((entry) => list.push(entry.data() as Transaction));
          // Newest first, so the ledger reads the way people expect.
          list.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
          setTransactions(list);
        }),
      );

      unsubsRef.current.push(
        onSnapshot(collection(db, 'users', fbUser.uid, 'referredFriends'), (snap) => {
          const friends: ReferredFriend[] = [];
          snap.forEach((entry) => friends.push(entry.data() as ReferredFriend));
          setUser((prev) => ({ ...prev, referredFriends: friends }));
        }),
      );

    } catch (error) {
      // Firestore being unreachable should degrade to local state rather
      // than blanking the dashboard.
      console.warn('Firestore sync unavailable, continuing locally:', error);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isCancelled = false;

    void (async () => {
      try {
        const { auth, authApi } = await getFirebase();
        if (isCancelled) return;

        unsubscribe = authApi.onAuthStateChanged(auth, async (fbUser) => {
          unsubsRef.current.forEach((unsub) => unsub());
          unsubsRef.current = [];

          if (fbUser) {
            setFirebaseUser(fbUser);
            await syncUserFromFirestore(fbUser);
          } else {
            setFirebaseUser(null);
          }
          setIsAuthLoading(false);
        });
      } catch (error) {
        // Firebase unavailable (offline, blocked, or misconfigured): the
        // app stays fully usable on local state instead of hanging on a
        // loading spinner forever.
        console.warn('Firebase unavailable, running locally:', error);
        if (!isCancelled) setIsAuthLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
      unsubscribe?.();
      unsubsRef.current.forEach((unsub) => unsub());
      unsubsRef.current = [];
    };
  }, [syncUserFromFirestore]);

  // ---------------------------------------------------------------
  // Auth actions
  // ---------------------------------------------------------------
  const afterSignIn = useCallback(() => {
    setActiveModal(null);
    setDashboardTabState('overview');
    navigate('dashboard', { tab: 'overview' });
  }, [navigate]);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      setIsAuthLoading(true);
      const { auth, googleProvider, authApi } = await getFirebase();
      const result = await authApi.signInWithPopup(auth, googleProvider);
      if (!result.user) return false;
      addToast(
        t('toast.signedIn', { name: result.user.displayName ?? result.user.email ?? '' }),
        'success',
      );
      afterSignIn();
      return true;
    } catch (error) {
      const code = (error as { code?: string })?.code;
      // A user closing the Google popup is not an error worth shouting about.
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        addToast(t('toast.genericAuthError'), 'error');
      }
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  }, [addToast, afterSignIn, t]);

  const signInWithEmail = useCallback(
    async (email: string, pass: string): Promise<boolean> => {
      try {
        setIsAuthLoading(true);
        const { auth, authApi } = await getFirebase();
        const result = await authApi.signInWithEmailAndPassword(auth, email, pass);
        if (!result.user) return false;
        addToast(t('toast.signedIn', { name: result.user.email ?? '' }), 'success');
        afterSignIn();
        return true;
      } catch (error) {
        const code = (error as { code?: string })?.code;
        const invalid =
          code === 'auth/user-not-found' ||
          code === 'auth/wrong-password' ||
          code === 'auth/invalid-credential';
        addToast(t(invalid ? 'toast.signInFailed' : 'toast.genericAuthError'), 'error');
        return false;
      } finally {
        setIsAuthLoading(false);
      }
    },
    [addToast, afterSignIn, t],
  );

  const applyReferralCodeRef = useRef<((code: string) => Promise<boolean>) | null>(null);

  const signUpWithEmail = useCallback(
    async (email: string, pass: string, name: string, referralCode?: string): Promise<boolean> => {
      try {
        setIsAuthLoading(true);
        const { auth, authApi } = await getFirebase();
        const result = await authApi.createUserWithEmailAndPassword(auth, email, pass);
        if (!result.user) return false;

        addToast(t('toast.accountCreated', { name }), 'success');
        afterSignIn();

        // Applied after the profile exists so the bonus writes to a real doc.
        if (referralCode?.trim()) {
          await applyReferralCodeRef.current?.(referralCode.trim());
        }
        return true;
      } catch (error) {
        const code = (error as { code?: string })?.code;
        if (code === 'auth/email-already-in-use') addToast(t('toast.signUpEmailInUse'), 'warning');
        else if (code === 'auth/weak-password') addToast(t('toast.weakPassword'), 'error');
        else addToast(t('toast.genericAuthError'), 'error');
        return false;
      } finally {
        setIsAuthLoading(false);
      }
    },
    [addToast, afterSignIn, t],
  );

  const signOutUser = useCallback(async () => {
    try {
      const { auth, authApi } = await getFirebase();
      await authApi.signOut(auth);
      setUser(INITIAL_USER);
      setHoldings(INITIAL_HOLDINGS);
      setTransactions(INITIAL_TRANSACTIONS);
      addToast(t('toast.signedOut'), 'info');
      navigate('landing');
    } catch (error) {
      console.warn('Sign out failed:', error);
      addToast(t('toast.genericAuthError'), 'error');
    }
  }, [addToast, navigate, t]);

  // ---------------------------------------------------------------
  // Persistence helper
  // ---------------------------------------------------------------
  const persist = useCallback(
    async (
      profilePatch: Partial<UserProfile>,
      extras?: { transaction?: Transaction; holding?: PortfolioHolding; friend?: ReferredFriend },
    ) => {
      if (!firebaseUser) return;
      try {
        const { db, dbApi } = await getFirebase();
        const { doc, setDoc, updateDoc } = dbApi;

        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          ...profilePatch,
          updatedAt: new Date().toISOString(),
        });
        if (extras?.transaction) {
          await setDoc(
            doc(db, 'users', firebaseUser.uid, 'transactions', extras.transaction.id),
            extras.transaction,
          );
        }
        if (extras?.holding) {
          await setDoc(
            doc(db, 'users', firebaseUser.uid, 'holdings', extras.holding.id),
            extras.holding,
          );
        }
        if (extras?.friend) {
          await setDoc(
            doc(db, 'users', firebaseUser.uid, 'referredFriends', extras.friend.id),
            extras.friend,
          );
        }
      } catch (error) {
        console.warn('Could not persist change to Firestore:', error);
      }
    },
    [firebaseUser],
  );

  const makeReference = (prefix: string) =>
    `GF-${prefix}-${Math.floor(100_000 + Math.random() * 900_000)}`;

  // ---------------------------------------------------------------
  // Financial actions
  // ---------------------------------------------------------------
  const executeInvestment = useCallback(
    async (opportunityId: string, amount: number): Promise<boolean> => {
      const opportunity = opportunities.find((item) => item.id === opportunityId);
      if (!opportunity) return false;

      const minimum = Math.max(opportunity.minInvestment, MIN_INVESTMENT);
      if (!Number.isFinite(amount) || amount < minimum) {
        addToast(t('toast.investBelowMin', { amount: formatFCFA(minimum, language) }), 'error');
        return false;
      }

      if (amount % INVESTMENT_STEP !== 0) {
        addToast(
          t('toast.investStep', { amount: formatFCFA(INVESTMENT_STEP, language) }),
          'error',
        );
        return false;
      }

      // The old code silently skipped the debit when the balance was short,
      // which let the user "invest" money they did not have and left the
      // wallet and portfolio totals inconsistent.
      if (user.walletBalance < amount) {
        addToast(
          t('toast.investInsufficient', { amount: formatFCFA(user.walletBalance, language) }),
          'error',
        );
        return false;
      }

      const date = todayIso();

      // The allocation's tier fixes both the commitment term and the rate
      // it earns, so a larger allocation locks for longer and earns more.
      const tier = tierForAmount(amount);
      const lockMonths = lockMonthsFor(amount);
      const rate = effectiveRate(
        amount,
        opportunity.projectedReturnMin,
        opportunity.projectedReturnMax,
      );
      const unlockDate = addMonthsIso(date, lockMonths);

      const holding: PortfolioHolding = {
        id: `hold-${Date.now()}`,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        category: opportunity.category,
        investedAmount: amount,
        currentValue: amount,
        totalReturnsEarned: 0,
        projectedReturnRate: rate,
        tierId: tier.id,
        lockMonths,
        investedDate: date,
        unlockDate,
        // First distribution lands one period into the term.
        nextDistributionDate: addMonthsIso(date, Math.min(lockMonths, 3)),
        status: 'Locked',
        riskLevel: opportunity.riskLevel,
      };

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        date,
        type: 'Investment',
        projectName: opportunity.title,
        amount,
        status: 'Completed',
        referenceId: makeReference('INV'),
      };

      const patch = {
        totalInvested: user.totalInvested + amount,
        walletBalance: user.walletBalance - amount,
        activeInvestmentsCount: user.activeInvestmentsCount + 1,
      };

      setUser((prev) => ({ ...prev, ...patch }));
      setHoldings((prev) => [holding, ...prev]);
      setTransactions((prev) => [transaction, ...prev]);
      setOpportunities((prev) =>
        prev.map((item) =>
          item.id === opportunityId
            ? {
                ...item,
                amountRaised: Math.min(item.fundingGoal, item.amountRaised + amount),
                investorsCount: item.investorsCount + 1,
              }
            : item,
        ),
      );

      await persist(patch, { transaction, holding });

      addToast(
        t('toast.invested', {
          amount: formatFCFA(amount, language),
          name: opportunity.title[language],
          months: lockMonths,
        }),
        'success',
      );
      return true;
    },
    [opportunities, user, addToast, persist, t, language],
  );

  const executeDeposit = useCallback(
    async (amount: number, method: string, accountDetails?: string): Promise<boolean> => {
      if (!Number.isFinite(amount) || amount <= 0) {
        addToast(t('toast.depositInvalid'), 'error');
        return false;
      }

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        date: todayIso(),
        type: 'Deposit',
        projectName: accountDetails ? `${method} (${accountDetails})` : method,
        amount,
        status: 'Completed',
        referenceId: makeReference('DEP'),
      };

      const patch = { walletBalance: user.walletBalance + amount };
      setUser((prev) => ({ ...prev, ...patch }));
      setTransactions((prev) => [transaction, ...prev]);

      await persist(patch, { transaction });
      addToast(t('toast.deposited', { amount: formatFCFA(amount, language) }), 'success');
      return true;
    },
    [user.walletBalance, addToast, persist, t, language],
  );

  const executeWithdrawal = useCallback(
    async (amount: number, method: string, accountDetails?: string): Promise<boolean> => {
      if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL) {
        addToast(t('toast.withdrawMin'), 'error');
        return false;
      }
      if (amount % WITHDRAWAL_STEP !== 0) {
        addToast(t('toast.withdrawMultiple'), 'error');
        return false;
      }
      if (user.walletBalance < amount) {
        addToast(
          t('toast.withdrawInsufficient', { amount: formatFCFA(user.walletBalance, language) }),
          'error',
        );
        return false;
      }

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        date: todayIso(),
        type: 'Withdrawal',
        projectName: accountDetails ? `${method} (${accountDetails})` : method,
        amount,
        status: 'Processing',
        referenceId: makeReference('WTH'),
      };

      const patch = { walletBalance: user.walletBalance - amount };
      setUser((prev) => ({ ...prev, ...patch }));
      setTransactions((prev) => [transaction, ...prev]);

      await persist(patch, { transaction });
      addToast(
        t('toast.withdrawn', { amount: formatFCFA(amount, language), method }),
        'success',
      );
      return true;
    },
    [user.walletBalance, addToast, persist, t, language],
  );

  const redeemHolding = useCallback(
    async (holdingId: string): Promise<boolean> => {
      const holding = holdings.find((item) => item.id === holdingId);
      if (!holding || holding.status === 'Redeemed') return false;

      /*
       * The lock is enforced here rather than only in the UI. Hiding the
       * button would be a presentation detail; refusing the action is the
       * actual rule, and it holds however the call is reached.
       */
      if (!hasReached(holding.unlockDate)) {
        addToast(
          t('toast.holdingLocked', {
            date: formatDate(holding.unlockDate, language),
          }),
          'error',
        );
        return false;
      }

      const proceeds = holding.currentValue;
      const date = todayIso();

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        date,
        type: 'Redemption',
        projectName: holding.opportunityTitle,
        amount: proceeds,
        status: 'Completed',
        referenceId: makeReference('RDM'),
      };

      const patch = {
        walletBalance: user.walletBalance + proceeds,
        activeInvestmentsCount: Math.max(0, user.activeInvestmentsCount - 1),
      };

      const redeemed: PortfolioHolding = { ...holding, status: 'Redeemed' };

      setUser((prev) => ({ ...prev, ...patch }));
      setHoldings((prev) => prev.map((item) => (item.id === holdingId ? redeemed : item)));
      setTransactions((prev) => [transaction, ...prev]);

      await persist(patch, { transaction, holding: redeemed });

      addToast(
        t('toast.redeemed', {
          amount: formatFCFA(proceeds, language),
          name: holding.opportunityTitle[language],
        }),
        'success',
      );
      return true;
    },
    [holdings, user.walletBalance, user.activeInvestmentsCount, addToast, persist, t, language],
  );

  const applyReferralCode = useCallback(
    async (code: string): Promise<boolean> => {
      const clean = code.trim().toUpperCase();
      if (!clean) {
        addToast(t('toast.referralEmpty'), 'error');
        return false;
      }
      if (clean === user.referralCode) {
        addToast(t('toast.referralOwnCode'), 'error');
        return false;
      }
      if (user.referredBy) {
        addToast(t('toast.referralAlready', { code: user.referredBy }), 'info');
        return false;
      }

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        date: todayIso(),
        type: 'Referral Bonus',
        projectName: {
          en: `Welcome referral bonus (${clean})`,
          fr: `Bonus de parrainage de bienvenue (${clean})`,
        },
        amount: REFERRAL_BONUS,
        status: 'Completed',
        referenceId: makeReference('BONUS'),
      };

      const patch = {
        referredBy: clean,
        walletBalance: user.walletBalance + REFERRAL_BONUS,
      };

      setUser((prev) => ({ ...prev, ...patch }));
      setTransactions((prev) => [transaction, ...prev]);

      await persist(patch, { transaction });
      addToast(
        t('toast.referralApplied', { amount: formatXAF(REFERRAL_BONUS, language) }),
        'success',
      );
      return true;
    },
    [user.referralCode, user.referredBy, user.walletBalance, addToast, persist, t, language],
  );

  applyReferralCodeRef.current = applyReferralCode;

  const simulateFriendReferral = useCallback(
    async (friendName?: string) => {
      const sampleNames = [
        'David Nkoa',
        'Salif Traoré',
        'Marie-Claire Kouamé',
        'Pauline Bamba',
        'Ibrahim Cissé',
        'Chantal Eyenga',
      ];
      const name = friendName ?? sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const date = todayIso();

      const friend: ReferredFriend = {
        id: `ref-${Date.now()}`,
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}***@example.com`,
        date,
        bonus: REFERRAL_BONUS,
        status: 'Bonus Paid',
      };

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        date,
        type: 'Referral Bonus',
        projectName: {
          en: `Referral bonus (${name})`,
          fr: `Bonus de parrainage (${name})`,
        },
        amount: REFERRAL_BONUS,
        status: 'Completed',
        referenceId: makeReference('REF'),
      };

      const patch = {
        walletBalance: user.walletBalance + REFERRAL_BONUS,
        referralCount: user.referralCount + 1,
        referralEarnings: user.referralEarnings + REFERRAL_BONUS,
      };

      setUser((prev) => ({
        ...prev,
        ...patch,
        referredFriends: [friend, ...(prev.referredFriends ?? [])],
      }));
      setTransactions((prev) => [transaction, ...prev]);

      await persist(patch, { transaction, friend });
      addToast(
        t('toast.referralFriend', { name, amount: formatXAF(REFERRAL_BONUS, language) }),
        'success',
      );
    },
    [
      user.walletBalance,
      user.referralCount,
      user.referralEarnings,
      addToast,
      persist,
      t,
      language,
    ],
  );

  const completeKYC = useCallback(
    async (tier: 'Tier 1 Verified' | 'Tier 2 Accredited') => {
      const patch = { kycTier: tier, isKycApproved: true } as const;
      setUser((prev) => ({ ...prev, ...patch }));
      await persist(patch);
      // Translate the tier name rather than pasting the raw enum value
      // into an otherwise translated sentence.
      addToast(t('toast.kycApproved', { tier: t(`kyc.tier.${tier}`) }), 'success');
    },
    [addToast, persist, t],
  );

  // Pick up ?ref= / #ref= from a shared invitation link.
  useEffect(() => {
    const code = readReferralFromUrl();
    if (code && !user.referredBy && isAuthenticated) {
      void applyReferralCode(code);
    }
    // Only re-run when sign-in status changes, not on every profile update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const value = useMemo<AppContextType>(
    () => ({
      currentPage,
      navigate,
      selectedOpportunityId,
      dashboardTab,
      setDashboardTab,
      navigateToOpportunity,
      firebaseUser,
      isAuthenticated,
      isAuthLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOutUser,
      user,
      holdings,
      transactions,
      opportunities,
      savedOpportunityIds,
      toggleSaveOpportunity,
      activeModal,
      openModal,
      closeModal,
      investingOpportunity,
      openInvestModal,
      authModalMode,
      openAuthModal,
      isCommandPaletteOpen,
      setCommandPaletteOpen,
      applyReferralCode,
      simulateFriendReferral,
      executeInvestment,
      redeemHolding,
      executeDeposit,
      executeWithdrawal,
      completeKYC,
      toasts,
      addToast,
      removeToast,
    }),
    [
      currentPage,
      navigate,
      selectedOpportunityId,
      dashboardTab,
      setDashboardTab,
      navigateToOpportunity,
      firebaseUser,
      isAuthenticated,
      isAuthLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOutUser,
      user,
      holdings,
      transactions,
      opportunities,
      savedOpportunityIds,
      toggleSaveOpportunity,
      activeModal,
      openModal,
      closeModal,
      investingOpportunity,
      openInvestModal,
      authModalMode,
      openAuthModal,
      isCommandPaletteOpen,
      applyReferralCode,
      simulateFriendReferral,
      executeInvestment,
      redeemHolding,
      executeDeposit,
      executeWithdrawal,
      completeKYC,
      toasts,
      addToast,
      removeToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
