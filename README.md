# GrowthFund

A Franc CFA (XAF) alternative investment platform — **demonstration prototype**.

> **This is a prototype.** Every project, sponsor, partner, balance and
> transaction in the app is illustrative sample data. No real money moves,
> no securities are offered, and the platform holds no regulatory licence.

## Running it

```bash
bun install
bun run dev        # http://localhost:3000
bun run typecheck  # tsc --noEmit, strict
bun run build      # production build
```

## Architecture

```
src/
  i18n/            FR/EN dictionary, LanguageProvider, useI18n()
  context/         AppContext (state, routing, money actions), ThemeContext
  lib/             routing (hash router), storage (safe localStorage), firebase (lazy)
  hooks/           useFocusTrap, useScrollLock, useDismissable, useReveal, useCountUp
  components/      Modal shell + all dialogs, Navbar, CommandPalette, MobileTabBar…
  pages/           Landing, Marketplace, Detail, Dashboard, Help, Compliance, About
  data/            bilingual sample data
  utils/format.ts  locale-aware currency, percentage and date formatting
```

### Routing

Routes live in the URL hash, so back/forward, deep links and shared URLs all
work:

| Route | Page |
| --- | --- |
| `#/` | Landing |
| `#/opportunities` | Marketplace |
| `#/opportunity/<id>` | Offering detail |
| `#/portfolio/<tab>` | Dashboard (`overview`, `portfolio`, `referrals`, `transactions`, `verification`) |
| `#/about`, `#/help`, `#/legal` | Static pages |

`?ref=CODE` or `#ref=CODE` applies a referral code on sign-in.

### Internationalisation

`useI18n()` exposes:

- `t(key, vars)` — UI strings from `src/i18n/translations.ts`. The `fr` map is
  type-checked against the `en` map, so a missing translation is a build error.
- `tr(value)` — resolves a `Localized` (`{ en, fr }`) value from the data.
- `language`, `setLanguage`, `locale`.

Sample data stores both languages, and marketplace/command-palette search
matches **either** language regardless of the active one.

### Adding a page

1. Add the route to `PageRoute` in `src/types/routes.ts` and to
   `hashToRoute`/`routeToHash` in `src/lib/routing.ts`.
2. Add its strings to both maps in `src/i18n/translations.ts`.
3. Lazy-import it in `src/App.tsx` and add it to `NAV_LINKS` / `CommandPalette`.

### Adding a dialog

Wrap it in `components/Modal.tsx`. That shell supplies Escape-to-close,
click-outside, a focus trap, focus restoration, a body scroll lock and the
labelled `role="dialog"` wiring.

## Accessibility

- Every destination and action is reachable in **three clicks or fewer** — via
  the persistent header, the mobile tab bar, or <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>K</kbd>
  quick search (`/` also opens it).
- Skip-to-content link, landmark regions, `aria-current` on navigation.
- Tablists (offering detail, dashboard) support arrow-key navigation.
- Toasts announce through a persistent `aria-live` region.
- User-controlled **high contrast** and **reduce motion**, alongside light /
  dark / system theme — all in one preferences menu, at every screen width.
- Animations are CSS-driven and stand down for `prefers-reduced-motion`.

## Notes on the data

Sponsors, escrow agents and partners are deliberately generic role
descriptions rather than the names of real banks, auditors or regulators.
An earlier revision named real institutions as partners and displayed
invented licence and trade-register numbers; naming them would misrepresent
relationships that do not exist.
