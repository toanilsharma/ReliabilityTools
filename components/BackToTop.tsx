import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to Top"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-500 border border-cyan-400/30 backdrop-blur-sm transition-all shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
};

export default BackToTop;
