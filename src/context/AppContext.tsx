import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { InvestmentOpportunity, PortfolioHolding, ReferredFriend, Transaction, UserProfile } from '../types';
import { INITIAL_HOLDINGS, INITIAL_TRANSACTIONS, INITIAL_USER, OPPORTUNITIES } from '../data/mockData';
import { formatFCFA, formatXAF } from '../utils/currency';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  FirebaseUser
} from '../lib/firebase';

export type PageRoute = 
  | 'landing' 
  | 'marketplace' 
  | 'detail' 
  | 'dashboard' 
  | 'about' 
  | 'help' 
  | 'compliance'
  | 'terms'
  | 'privacy';

export type DashboardTab = 'overview' | 'portfolio' | 'transactions' | 'referrals' | 'verification' | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  selectedOpportunityId: string | null;
  setSelectedOpportunityId: (id: string | null) => void;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  
  // Auth & Cloud State
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  isCloudConnected: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (email: string, pass: string, name: string, referralCode?: string) => Promise<boolean>;
  signOutUser: () => Promise<void>;

  user: UserProfile;
  holdings: PortfolioHolding[];
  transactions: Transaction[];
  opportunities: InvestmentOpportunity[];
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (id: string) => void;
  
  // Modals
  isInvestModalOpen: boolean;
  setIsInvestModalOpen: (open: boolean) => void;
  investingOpportunity: InvestmentOpportunity | null;
  openInvestModal: (opp: InvestmentOpportunity) => void;
  
  isKYCModalOpen: boolean;
  setIsKYCModalOpen: (open: boolean) => void;
  
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode: 'signin' | 'signup') => void;

  // Referral Actions
  applyReferralCode: (code: string) => Promise<boolean>;
  simulateFriendReferral: (friendName?: string) => Promise<void>;

  // Financial Actions
  executeInvestment: (opportunityId: string, amount: number) => Promise<boolean>;
  executeDeposit: (amount: number, method: string, accountDetails?: string) => Promise<void>;
  executeWithdrawal: (amount: number, method: string, accountDetails?: string) => Promise<boolean>;
  completeKYC: (tier: 'Tier 1 Verified' | 'Tier 2 Accredited') => Promise<void>;
  
  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Navigation helpers
  navigateToOpportunity: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('landing');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>('opp-solar-texas');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');
  
  // Auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // App core data
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(INITIAL_HOLDINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>(OPPORTUNITIES);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(['opp-solar-texas']);

  // Modals
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [investingOpportunity, setInvestingOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Keep track of active firestore unsubs
  const unsubsRef = useRef<(() => void)[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to extract initials
  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return 'GF';
  };

  // Initialize or fetch user in Firestore
  const syncUserFromFirestore = async (fbUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // First time user: create new profile seeded with welcome balance & demo data
        const initials = getInitials(fbUser.displayName || '', fbUser.email || '');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const refCode = `GF-${(fbUser.displayName ? fbUser.displayName.split(' ')[0] : 'XAF').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)}${randomNum}`;
        const accNum = `GF-XAF-${Math.floor(10000000 + Math.random() * 90000000)}`;

        const newUserProfile: UserProfile = {
          uid: fbUser.uid,
          photoURL: fbUser.photoURL || undefined,
          name: fbUser.displayName || 'Investor',
          email: fbUser.email || '',
          initials: initials,
          accountNumber: accNum,
          kycTier: 'Tier 1 Verified',
          isKycApproved: true,
          walletBalance: 250000, // 250,000 XAF default testing balance
          totalInvested: 500000,
          totalReturns: 47500,
          activeInvestmentsCount: 2,
          notificationsCount: 2,
          joinedDate: new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          memberSince: `${new Date().getFullYear()}`,
          referralCode: refCode,
          referralCount: 1,
          referralEarnings: 1000,
          referredFriends: [
            {
              id: 'ref-demo-1',
              name: 'Salif Traoré',
              email: 's.traore***@gmail.com',
              date: '12 Feb 2026',
              bonus: 1000,
              status: 'Bonus Paid'
            }
          ]
        };

        // Save profile
        await setDoc(userDocRef, {
          ...newUserProfile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Save global referral code index
        try {
          await setDoc(doc(db, 'referralCodes', refCode), {
            code: refCode,
            ownerUid: fbUser.uid,
            ownerName: fbUser.displayName || 'Investor',
            createdAt: new Date().toISOString()
          });
        } catch {
          // Non-blocking
        }

        // Seed subcollections
        for (const h of INITIAL_HOLDINGS) {
          await setDoc(doc(db, 'users', fbUser.uid, 'holdings', h.id), h);
        }
        for (const tx of INITIAL_TRANSACTIONS) {
          await setDoc(doc(db, 'users', fbUser.uid, 'transactions', tx.id), tx);
        }
        for (const rf of newUserProfile.referredFriends) {
          await setDoc(doc(db, 'users', fbUser.uid, 'referredFriends', rf.id), rf);
        }

        setUser(newUserProfile);
        setHoldings(INITIAL_HOLDINGS);
        setTransactions(INITIAL_TRANSACTIONS);
      } else {
        // Existing user: set local user state
        const data = userDocSnap.data() as UserProfile;
        setUser({
          ...data,
          uid: fbUser.uid,
          photoURL: fbUser.photoURL || data.photoURL || undefined,
          email: fbUser.email || data.email
        });
      }

      // Set up real-time listener for user doc
      const unsubUser = onSnapshot(userDocRef, (snap) => {
        if (snap.exists()) {
          const uData = snap.data() as UserProfile;
          setUser((prev) => ({
            ...prev,
            ...uData,
            uid: fbUser.uid,
            photoURL: fbUser.photoURL || uData.photoURL || prev.photoURL
          }));
        }
      });
      unsubsRef.current.push(unsubUser);

      // Real-time listener for holdings
      const holdingsColRef = collection(db, 'users', fbUser.uid, 'holdings');
      const unsubHoldings = onSnapshot(holdingsColRef, (snap) => {
        if (!snap.empty) {
          const list: PortfolioHolding[] = [];
          snap.forEach((d) => list.push(d.data() as PortfolioHolding));
          setHoldings(list);
        }
      });
      unsubsRef.current.push(unsubHoldings);

      // Real-time listener for transactions
      const txColRef = collection(db, 'users', fbUser.uid, 'transactions');
      const unsubTx = onSnapshot(txColRef, (snap) => {
        if (!snap.empty) {
          const list: Transaction[] = [];
          snap.forEach((d) => list.push(d.data() as Transaction));
          // Sort by id / date
          setTransactions(list);
        }
      });
      unsubsRef.current.push(unsubTx);

      // Real-time listener for referredFriends
      const refColRef = collection(db, 'users', fbUser.uid, 'referredFriends');
      const unsubRef = onSnapshot(refColRef, (snap) => {
        if (!snap.empty) {
          const friends: ReferredFriend[] = [];
          snap.forEach((d) => friends.push(d.data() as ReferredFriend));
          setUser((prev) => ({ ...prev, referredFriends: friends }));
        }
      });
      unsubsRef.current.push(unsubRef);

      setIsCloudConnected(true);
    } catch (err) {
      console.warn('Firestore sync note:', err);
      // Fallback: continue in client state
      setIsCloudConnected(false);
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      // Clear previous snapshot listeners
      unsubsRef.current.forEach((unsub) => unsub());
      unsubsRef.current = [];

      if (fbUser) {
        setFirebaseUser(fbUser);
        await syncUserFromFirestore(fbUser);
      } else {
        setFirebaseUser(null);
        setIsCloudConnected(false);
      }
      setIsAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubsRef.current.forEach((unsub) => unsub());
    };
  }, []);

  // Google Sign-In with Firebase Auth
  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setIsAuthLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        addToast(`Signed in as ${res.user.displayName || res.user.email} via Google!`, 'success');
        setIsAuthModalOpen(false);
        setDashboardTab('overview');
        setCurrentPage('dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      addToast(err?.message || 'Google Sign-in failed. Please try again.', 'error');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Email/Password Sign-In
  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      setIsAuthLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        addToast(`Welcome back, ${res.user.email}!`, 'success');
        setIsAuthModalOpen(false);
        setDashboardTab('overview');
        setCurrentPage('dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      // Friendly messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        addToast('Invalid email or password. Please verify your credentials.', 'error');
      } else {
        addToast(err?.message || 'Sign in failed. Please try again.', 'error');
      }
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Email/Password Sign-Up
  const signUpWithEmail = async (email: string, pass: string, name: string, referralCode?: string): Promise<boolean> => {
    try {
      setIsAuthLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        if (referralCode && referralCode.trim()) {
          // Apply referral after account creation
          setTimeout(() => {
            applyReferralCode(referralCode.trim());
          }, 800);
        }
        addToast(`Account created successfully! Welcome to GrowthFund, ${name}.`, 'success');
        setIsAuthModalOpen(false);
        setDashboardTab('overview');
        setCurrentPage('dashboard');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Sign-Up Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        addToast('This email is already in use. Please sign in instead.', 'warning');
      } else if (err.code === 'auth/weak-password') {
        addToast('Password must be at least 6 characters.', 'error');
      } else {
        addToast(err?.message || 'Failed to create account.', 'error');
      }
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign Out
  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(INITIAL_USER);
      setHoldings(INITIAL_HOLDINGS);
      setTransactions(INITIAL_TRANSACTIONS);
      addToast('Signed out of GrowthFund.', 'info');
      setCurrentPage('landing');
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const toggleSaveOpportunity = (id: string) => {
    setSavedOpportunityIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        addToast('Removed from saved opportunities', 'info');
        return prev.filter((i) => i !== id);
      } else {
        addToast('Saved to your watch list', 'success');
        return [...prev, id];
      }
    });
  };

  const openInvestModal = (opp: InvestmentOpportunity) => {
    setInvestingOpportunity(opp);
    setIsInvestModalOpen(true);
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const navigateToOpportunity = (id: string) => {
    setSelectedOpportunityId(id);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const executeInvestment = async (opportunityId: string, amount: number): Promise<boolean> => {
    const opp = opportunities.find((o) => o.id === opportunityId);
    if (!opp) return false;

    if (amount < opp.minInvestment) {
      addToast(`Minimum investment is ${formatFCFA(opp.minInvestment)}.`, 'error');
      return false;
    }

    const newBalance = user.walletBalance >= amount ? user.walletBalance - amount : user.walletBalance;
    const updatedUser = {
      ...user,
      totalInvested: user.totalInvested + amount,
      walletBalance: newBalance,
      activeInvestmentsCount: user.activeInvestmentsCount + 1,
    };

    const newHolding: PortfolioHolding = {
      id: `hold-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      category: opp.category,
      investedAmount: amount,
      currentValue: amount,
      totalReturnsEarned: 0,
      projectedReturnRate: opp.projectedReturnMin,
      investedDate: new Date().toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }),
      maturityDate: 'Oct 2027',
      nextDistributionDate: '15 Dec 2026',
      status: 'Active',
      riskLevel: opp.riskLevel,
    };

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Investment',
      projectName: opp.title,
      amount: amount,
      status: 'Completed',
      referenceId: `GF-TX-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    // Optimistic UI updates
    setUser(updatedUser);
    setHoldings((prev) => [newHolding, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);

    // Update opportunity stats
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === opportunityId
          ? {
              ...o,
              amountRaised: Math.min(o.fundingGoal, o.amountRaised + amount),
              investorsCount: o.investorsCount + 1,
            }
          : o
      )
    );

    // Persist to Firestore if user logged in
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          totalInvested: updatedUser.totalInvested,
          walletBalance: updatedUser.walletBalance,
          activeInvestmentsCount: updatedUser.activeInvestmentsCount,
          updatedAt: new Date().toISOString()
        });
        await setDoc(doc(db, 'users', firebaseUser.uid, 'holdings', newHolding.id), newHolding);
        await setDoc(doc(db, 'users', firebaseUser.uid, 'transactions', newTx.id), newTx);
      } catch (err) {
        console.warn('Persist investment note:', err);
      }
    }

    addToast(`Successfully invested ${formatFCFA(amount)} in ${opp.title}!`, 'success');
    return true;
  };

  const executeDeposit = async (amount: number, method: string, accountDetails?: string) => {
    if (isNaN(amount) || amount <= 0) {
      addToast('Please enter a valid deposit amount.', 'error');
      return;
    }

    const updatedUser = {
      ...user,
      walletBalance: user.walletBalance + amount,
    };

    const detailText = accountDetails ? ` (${accountDetails})` : '';
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Deposit',
      projectName: `${method} Deposit${detailText}`,
      amount: amount,
      status: 'Completed',
      referenceId: `GF-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    // Optimistic
    setUser(updatedUser);
    setTransactions((prev) => [newTx, ...prev]);

    // Firestore
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          walletBalance: updatedUser.walletBalance,
          updatedAt: new Date().toISOString()
        });
        await setDoc(doc(db, 'users', firebaseUser.uid, 'transactions', newTx.id), newTx);
      } catch (err) {
        console.warn('Persist deposit note:', err);
      }
    }

    addToast(`Cash-in successful: Added ${formatFCFA(amount)} to your GrowthFund balance.`, 'success');
  };

  const executeWithdrawal = async (amount: number, method: string, accountDetails?: string): Promise<boolean> => {
    // 1. Check minimum of 5,000 XAF
    if (amount < 5000) {
      addToast('Minimum withdrawal amount is 5,000 XAF.', 'error');
      return false;
    }

    // 2. Check multiple of 5000 constraint (5000, 10000, 15000, 20000, etc.)
    if (amount % 5000 !== 0) {
      addToast('Cash out is only available in multiples of 5,000 XAF (e.g. 5,000, 10,000, 15,000, 20,000 XAF).', 'error');
      return false;
    }

    // 3. Check sufficient wallet balance
    if (user.walletBalance < amount) {
      addToast(`Insufficient cash balance. Available: ${formatFCFA(user.walletBalance)}`, 'error');
      return false;
    }

    const updatedUser = {
      ...user,
      walletBalance: user.walletBalance - amount,
    };

    const detailText = accountDetails ? ` (${accountDetails})` : '';
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Withdrawal',
      projectName: `${method} Cash-Out${detailText}`,
      amount: amount,
      status: 'Processing',
      referenceId: `GF-WTH-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    // Optimistic
    setUser(updatedUser);
    setTransactions((prev) => [newTx, ...prev]);

    // Firestore
    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          walletBalance: updatedUser.walletBalance,
          updatedAt: new Date().toISOString()
        });
        await setDoc(doc(db, 'users', firebaseUser.uid, 'transactions', newTx.id), newTx);
      } catch (err) {
        console.warn('Persist withdrawal note:', err);
      }
    }

    addToast(`Cash-out of ${formatFCFA(amount)} initiated via ${method}. Transfer is in progress.`, 'success');
    return true;
  };

  const applyReferralCode = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      addToast('Please enter a referral code.', 'error');
      return false;
    }
    if (cleanCode === user.referralCode) {
      addToast('You cannot use your own referral code.', 'error');
      return false;
    }
    if (user.referredBy) {
      addToast(`You have already applied a referral code (${user.referredBy}).`, 'info');
      return false;
    }

    const BONUS_AMOUNT = 1000; // 1,000 XAF bonus
    const updatedUser = {
      ...user,
      referredBy: cleanCode,
      walletBalance: user.walletBalance + BONUS_AMOUNT,
    };

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Referral Bonus',
      projectName: `Welcome Referral Bonus (${cleanCode})`,
      amount: BONUS_AMOUNT,
      status: 'Completed',
      referenceId: `GF-BONUS-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setUser(updatedUser);
    setTransactions((prev) => [newTx, ...prev]);

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          referredBy: cleanCode,
          walletBalance: updatedUser.walletBalance,
          updatedAt: new Date().toISOString()
        });
        await setDoc(doc(db, 'users', firebaseUser.uid, 'transactions', newTx.id), newTx);
      } catch (err) {
        console.warn('Persist referral note:', err);
      }
    }

    addToast(`🎉 Referral code applied! You received +${formatXAF(BONUS_AMOUNT)} into your Cash Balance.`, 'success');
    return true;
  };

  const simulateFriendReferral = async (friendName?: string) => {
    const sampleNames = [
      'David Nkoa',
      'Salif Traoré',
      'Marie-Claire Kouamé',
      'Pauline Bamba',
      'Ibrahim Cissé',
      'Chantal Eyenga',
    ];
    const name = friendName || sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const BONUS_AMOUNT = 1000; // 1,000 XAF bonus

    const newFriend: ReferredFriend = {
      id: `ref-${Date.now()}`,
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}***@gmail.com`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      bonus: BONUS_AMOUNT,
      status: 'Bonus Paid',
    };

    const updatedUser = {
      ...user,
      walletBalance: user.walletBalance + BONUS_AMOUNT,
      referralCount: user.referralCount + 1,
      referralEarnings: user.referralEarnings + BONUS_AMOUNT,
      referredFriends: [newFriend, ...(user.referredFriends || [])],
    };

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Referral Bonus',
      projectName: `Referral Bonus (${name})`,
      amount: BONUS_AMOUNT,
      status: 'Completed',
      referenceId: `GF-REF-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setUser(updatedUser);
    setTransactions((prev) => [newTx, ...prev]);

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          walletBalance: updatedUser.walletBalance,
          referralCount: updatedUser.referralCount,
          referralEarnings: updatedUser.referralEarnings,
          updatedAt: new Date().toISOString()
        });
        await setDoc(doc(db, 'users', firebaseUser.uid, 'transactions', newTx.id), newTx);
        await setDoc(doc(db, 'users', firebaseUser.uid, 'referredFriends', newFriend.id), newFriend);
      } catch (err) {
        console.warn('Persist friend referral note:', err);
      }
    }

    addToast(`🎉 Referral Success! ${name} joined using your code. You received a +${formatXAF(BONUS_AMOUNT)} cash bonus!`, 'success');
  };

  const completeKYC = async (tier: 'Tier 1 Verified' | 'Tier 2 Accredited') => {
    const updatedUser = {
      ...user,
      kycTier: tier,
      isKycApproved: true,
    };
    setUser(updatedUser);

    if (firebaseUser) {
      try {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          kycTier: tier,
          isKycApproved: true,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Persist KYC note:', err);
      }
    }

    addToast(`Identity verification approved: Upgraded to ${tier}!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedOpportunityId,
        setSelectedOpportunityId,
        dashboardTab,
        setDashboardTab,
        firebaseUser,
        isAuthLoading,
        isCloudConnected,
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
        isInvestModalOpen,
        setIsInvestModalOpen,
        investingOpportunity,
        openInvestModal,
        isKYCModalOpen,
        setIsKYCModalOpen,
        isDepositModalOpen,
        setIsDepositModalOpen,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        openAuthModal,
        applyReferralCode,
        simulateFriendReferral,
        executeInvestment,
        executeDeposit,
        executeWithdrawal,
        completeKYC,
        toasts,
        addToast,
        removeToast,
        navigateToOpportunity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
