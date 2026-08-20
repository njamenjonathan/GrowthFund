import { DashboardTab, PageRoute } from '../types/routes';

export interface AppRoute {
  page: PageRoute;
  /** Selected opportunity, for the detail page. */
  opportunityId?: string;
  /** Selected dashboard tab. */
  tab?: DashboardTab;
}

const PAGES: PageRoute[] = [
  'landing',
  'marketplace',
  'detail',
  'dashboard',
  'about',
  'help',
  'compliance',
];

const DASHBOARD_TABS: DashboardTab[] = [
  'overview',
  'portfolio',
  'transactions',
  'referrals',
  'verification',
];

/**
 * Routes live in the URL hash so the browser back/forward buttons, deep
 * links and shared URLs all work. Previously the current page was React
 * state only: back left the site entirely and "share" copied a URL that
 * always reopened the landing page.
 *
 * Shapes:
 *   #/                       landing
 *   #/opportunities          marketplace
 *   #/opportunity/<id>       detail
 *   #/portfolio/<tab>        dashboard
 *   #/about | #/help | #/legal
 */
export const routeToHash = (route: AppRoute): string => {
  switch (route.page) {
    case 'landing':
      return '#/';
    case 'marketplace':
      return '#/opportunities';
    case 'detail':
      return route.opportunityId ? `#/opportunity/${route.opportunityId}` : '#/opportunities';
    case 'dashboard':
      return `#/portfolio/${route.tab ?? 'overview'}`;
    case 'about':
      return '#/about';
    case 'help':
      return '#/help';
    case 'compliance':
      return '#/legal';
    default:
      return '#/';
  }
};

export const hashToRoute = (hash: string): AppRoute => {
  const clean = hash.replace(/^#\/?/, '').split('?')[0];
  const [head, tail] = clean.split('/');

  switch (head) {
    case '':
      return { page: 'landing' };
    case 'opportunities':
      return { page: 'marketplace' };
    case 'opportunity':
      return tail ? { page: 'detail', opportunityId: tail } : { page: 'marketplace' };
    case 'portfolio': {
      const tab = DASHBOARD_TABS.includes(tail as DashboardTab)
        ? (tail as DashboardTab)
        : 'overview';
      return { page: 'dashboard', tab };
    }
    case 'about':
      return { page: 'about' };
    case 'help':
      return { page: 'help' };
    case 'legal':
      return { page: 'compliance' };
    default:
      // Tolerate legacy/unknown hashes rather than rendering nothing.
      return PAGES.includes(head as PageRoute)
        ? { page: head as PageRoute }
        : { page: 'landing' };
  }
};

/** Reads a referral code from either ?ref= or #ref= in the current URL. */
export const readReferralFromUrl = (): string | null => {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get('ref');
    if (fromQuery) return fromQuery.toUpperCase();

    const hashMatch = window.location.hash.match(/[#&?]ref=([^&]+)/i);
    return hashMatch ? decodeURIComponent(hashMatch[1]).toUpperCase() : null;
  } catch {
    return null;
  }
};
