import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface State {
  error: Error | null;
}

/**
 * Catches render errors so one broken page cannot blank the whole app.
 *
 * Deliberately not translated: this is the last thing standing when
 * something has already failed, possibly the i18n provider itself, so it
 * must not depend on any app context to render.
 *
 * This matters here because several pages previously threw on data that
 * did not match their assumptions; with no boundary in place, the user
 * saw an empty white screen and no way back.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>

        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This section failed to load. Reloading usually clears it.
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.hash = '#/';
            window.location.reload();
          }}
          className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-700 text-white text-sm font-bold rounded-xl"
        >
          Reload
        </button>
      </div>
    );
  }
}
