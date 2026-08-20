import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FAQ_DATA } from '../data/mockData';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Send,
  CheckCircle2
} from 'lucide-react';

interface FlatFaq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const HelpPage: React.FC = () => {
  const { addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-0-0');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Contact form state
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // Flatten FAQs with unique IDs
  const allFaqs: FlatFaq[] = useMemo(() => {
    const list: FlatFaq[] = [];
    FAQ_DATA.forEach((group, gIdx) => {
      group.questions.forEach((qItem, qIdx) => {
        list.push({
          id: `faq-${gIdx}-${qIdx}`,
          category: group.category,
          question: qItem.q,
          answer: qItem.a,
        });
      });
    });
    return list;
  }, []);

  const categories = ['All', ...FAQ_DATA.map((g) => g.category)];

  const filteredFaqs = allFaqs.filter((faq) => {
    if (selectedCategory !== 'All' && faq.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setContactSent(true);
      addToast('Your support inquiry has been submitted. Our compliance team will respond within 24 hours.', 'success');
      setContactMessage('');
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Knowledge Base & Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Everything you need to know about alternative investing, projected yields, risk factors, escrow safety, and regulatory compliance.
        </p>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto relative pt-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-[23px]" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. risk, fees, taxes, escrow)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white text-sm hover:text-emerald-600 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 mb-1">
                    {faq.category}
                  </span>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Compliance Support Box */}
      <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 rounded-xl text-emerald-600 dark:text-emerald-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Have a Specific Diligence or Offering Question?
            </h3>
            <p className="text-xs text-slate-500">
              Our investor relations and compliance team is available Mon-Fri, 9am-6pm EST.
            </p>
          </div>
        </div>

        {contactSent ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
              Inquiry Dispatched Successfully
            </h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              A support specialist has been assigned to your ticket. Expect a formal response at your registered email address.
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Subject
                </label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-slate-900 dark:text-white"
                >
                  <option>General Offering Inquiry</option>
                  <option>Accredited Investor Verification (Reg D)</option>
                  <option>Bank Deposit / Withdrawal Question</option>
                  <option>Tax Form (1099-DIV / K-1)</option>
                  <option>Legal & SEC Compliance Question</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Response Priority
                </label>
                <input
                  type="text"
                  disabled
                  value="Standard Support (Within 24 Hours)"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Question or Inquiry
              </label>
              <textarea
                rows={3}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Ask about a specific offering, escrow agent, or documentation requirement..."
                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2"
            >
              {isSending ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit Inquiry
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
