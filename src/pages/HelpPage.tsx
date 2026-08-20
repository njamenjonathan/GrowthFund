import React, { useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, MessageSquare, Search, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FAQ_DATA } from '../data/mockData';
import { useI18n } from '../i18n/LanguageContext';

const normalise = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const HelpPage: React.FC = () => {
  const { t, tr } = useI18n();
  const { addToast } = useApp();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0]?.id ?? null);

  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    FAQ_DATA.forEach((item) => seen.set(item.category.en, tr(item.category)));
    return [{ key: 'All', label: t('help.category.All') }, ...[...seen].map(([key, label]) => ({ key, label }))];
  }, [t, tr]);

  const filtered = useMemo(() => {
    const needle = normalise(query.trim());
    return FAQ_DATA.filter((item) => {
      if (category !== 'All' && item.category.en !== category) return false;
      if (!needle) return true;
      return normalise(`${tr(item.question)} ${tr(item.answer)}`).includes(needle);
    });
  }, [query, category, tr]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    window.setTimeout(() => {
      setIsSending(false);
      setHasSent(true);
      setMessage('');
      addToast(t('toast.messageSent'), 'success');
    }, 700);
  };

  const fieldClass =
    'w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <header className="text-center space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {t('help.eyebrow')}
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          {t('help.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {t('help.subtitle')}
        </p>

        <div className="max-w-lg mx-auto relative pt-3">
          <label htmlFor="help-search" className="sr-only">
            {t('help.searchLabel')}
          </label>
          {/*
            The magnifier used a hard-coded `top-[23px]` offset that only
            lined up at one font size; it is now centred against the input
            itself.
          */}
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 mt-1.5 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="help-search"
            type="search"
            placeholder={t('help.searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </header>

      <div
        role="group"
        aria-label={t('help.category.All')}
        className="flex items-center justify-center flex-wrap gap-2 text-xs"
      >
        {categories.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setCategory(item.key)}
            aria-pressed={category === item.key}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
              category === item.key
                ? 'bg-slate-900 dark:bg-emerald-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('help.noResults')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('help.noResultsBody')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
              >
                <h2>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${faq.id}`}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    <span>{tr(faq.question)}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h2>

                {isOpen && (
                  <div
                    id={`faq-panel-${faq.id}`}
                    className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-2 gf-animate-slide-down"
                  >
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tr(faq.category)}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tr(faq.answer)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <section className="bg-slate-50 dark:bg-slate-850 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="p-2.5 bg-emerald-100 dark:bg-emerald-950 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0"
          >
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('help.contactTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('help.contactBody')}</p>
          </div>
        </div>

        {hasSent ? (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" aria-hidden="true" />
            <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
              {t('help.sentTitle')}
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">{t('help.sentBody')}</p>
            <button
              type="button"
              onClick={() => setHasSent(false)}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-300 underline"
            >
              {t('help.sendAnother')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="help-subject" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('help.subject')}
              </label>
              <select
                id="help-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className={fieldClass}
              >
                <option value="general">{t('help.subject.general')}</option>
                <option value="account">{t('help.subject.account')}</option>
                <option value="money">{t('help.subject.money')}</option>
                <option value="offering">{t('help.subject.offering')}</option>
                <option value="legal">{t('help.subject.legal')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="help-message" className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('help.message')}
              </label>
              <textarea
                id="help-message"
                rows={4}
                required
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t('help.messagePlaceholder')}
                className={fieldClass}
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-2.5 bg-slate-900 dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {isSending ? (
                t('help.sending')
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  {t('help.send')}
                </>
              )}
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
