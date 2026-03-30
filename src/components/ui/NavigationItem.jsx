import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NAVIGATION_CONFIG } from '../../Config/navigationConfig';

export const NavigationItem = ({ 
  item, 
  onScroll, 
  currentPath, 
  variant = 'desktop',
  onItemClick 
}) => {
  const { separatePages, homeSections } = NAVIGATION_CONFIG;
  const isSeparatePage = separatePages.includes(item);
  const isHomeSection = homeSections.includes(item);

  const baseClasses = {
    desktop: "relative text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors duration-300 group",
    mobile: "text-gray-800 dark:text-gray-200 font-medium text-lg px-6 py-4 hover:bg-violet-50 dark:hover:bg-gray-800 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 border-b border-gray-100 dark:border-gray-800"
  };

  const content = (
    <>
      {item}
      {variant === 'desktop' && (
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 group-hover:w-full transition-all duration-300"></span>
      )}
    </>
  );

  if (isSeparatePage) {
    return (
      <Link
        to={`/${item.toLowerCase()}`}
        className={baseClasses[variant]}
        onClick={onItemClick}
      >
        {content}
      </Link>
    );
  }

  if (isHomeSection) {
    const handleClick = (e) => {
      e.preventDefault();
      onItemClick?.();
      if (currentPath !== '/') {
        // سيتم التعامل مع التنقل في المكون الأب
      } else {
        onScroll(item.toLowerCase());
      }
    };

    return variant === 'desktop' ? (
      <button onClick={handleClick} className={baseClasses[variant]}>
        {content}
      </button>
    ) : (
      <button onClick={handleClick} className={`text-left w-full ${baseClasses[variant]}`}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={`#${item.toLowerCase()}`}
      className={baseClasses[variant]}
      onClick={(e) => {
        e.preventDefault();
        onItemClick?.();
        onScroll(item.toLowerCase());
      }}
    >
      {content}
    </a>
  );
};