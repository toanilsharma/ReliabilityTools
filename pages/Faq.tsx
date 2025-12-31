

import React from 'react';
import { FAQS, CONTACT_EMAIL } from '../constants';
import { HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

const Faq: React.FC = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SEO schema={faqSchema} />
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Common questions about reliability engineering metrics and our tools.
        </p>
      </div>

      <div className="space-y-6">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="flex items-start gap-3 text-lg font-semibold text-slate-900 dark:text-white mb-3">
              <HelpCircle className="w-6 h-6 text-cyan-500 flex-shrink-0" />
              {faq.question}
            </h3>
            <div className="pl-9 text-slate-600 dark:text-slate-300 leading-relaxed">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-4">Still have questions?</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-medium">
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default Faq;