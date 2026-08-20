import React, { useCallback, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../hooks/useScrollLock';
import { useI18n } from '../i18n/LanguageContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Small line under the title. */
  subtitle?: React.ReactNode;
  /** Rendered to the left of the title, e.g. an icon badge. */
  icon?: React.ReactNode;
  /** Extra controls in the header, before the close button. */
  headerActions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

const SIZES: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-xl',
  xl: 'max-w-2xl',
};

/**
 * One accessible dialog shell for every modal in the app.
 *
 * It supplies what the hand-rolled modals were each missing: Escape to
 * close, click-outside to close, a focus trap, focus restoration, a body
 * scroll lock, and the labelled `role="dialog"` wiring.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  headerActions,
  size = 'md',
  children,
  className = '',
}) => {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const title_id = useId();
  const descriptionId = useId();

  const handleEscape = useCallback(() => onClose(), [onClose]);

  useFocusTrap(panelRef, isOpen, handleEscape);
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/70 backdrop-blur-sm p-4 flex items-start sm:items-center justify-center gf-animate-fade-in gf-no-print"
      // Clicking the backdrop dismisses; clicks inside the panel do not
      // bubble here because the panel stops propagation.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title_id}
        aria-describedby={subtitle ? descriptionId : undefined}
        tabIndex={-1}
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full ${SIZES[size]} shadow-2xl overflow-hidden my-auto gf-animate-scale-in ${className}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-start gap-3 min-w-0">
            {icon}
            <div className="min-w-0">
              <h2
                id={title_id}
                className="text-base font-bold text-slate-900 dark:text-white truncate"
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  id={descriptionId}
                  className="text-xs text-slate-500 dark:text-slate-400 mt-0.5"
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};
