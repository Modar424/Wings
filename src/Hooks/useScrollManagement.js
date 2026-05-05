import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollManagement = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.skipScroll) return;

    window.scrollTo(0, 0);
  }, [location.pathname]);
  const skipScroll = location.state?.skipScroll;

  useEffect(() => {
    if (skipScroll) {
      window.history.replaceState({}, document.title);
      return;
    }

    window.scrollTo(0, 0);
  }, [location.pathname, skipScroll]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return { scrollToSection };
};
