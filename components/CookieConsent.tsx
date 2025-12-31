
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('reliability-tools-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('reliability-tools-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-700 dark:text-slate-300 text-center sm:text-left">
          <p>
            We use cookies to analyze traffic and provide necessary website functionality. 
            By using our site, you acknowledge that you have read and understand our{' '}
            <Link to="/legal/privacy" className="text-cyan-600 dark:text-cyan-400 hover:underline">Privacy Policy</Link> and{' '}
            <Link to="/legal/cookies" className="text-cyan-600 dark:text-cyan-400 hover:underline">Cookie Policy</Link>.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleAccept}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold px-6 py-2 rounded transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
