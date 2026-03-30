import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollManagement = () => {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const shouldSkipScroll = location.state?.skipScroll;
    
    if (shouldSkipScroll) {
      window.history.replaceState({}, document.title);
      return;
    }
    
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return { scrollToSection };
};