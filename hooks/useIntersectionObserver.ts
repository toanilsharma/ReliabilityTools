import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (options = { threshold: 0.1, rootMargin: '0px' }) => {
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
          observer.unobserve(target); // Only animate once
        }
      });
    }, options);

    elementsRef.current.forEach((el, index) => {
      if (el) {
        // Initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`;
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [options]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  return addToRefs;
};
