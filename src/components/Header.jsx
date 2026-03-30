import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScrollManagement } from '../hooks/useScrollManagement';
import { useAuth } from '../Hooks/useAuth';
import { NAVIGATION_CONFIG } from '../Config/navigationConfig';
import { AnimatedLogo } from './ui/AnimatedLogo';
import { NavigationItem } from './ui/NavigationItem';
import { AuthButton } from './ui/AuthButton';
import { AuthModal } from './ui/AuthModal';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollToSection } = useScrollManagement();
  const auth = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMobileItemClick = (itemId, isHomeSection = false) => {
    setIsOpen(false);
    
    setTimeout(() => {
      if (isHomeSection && location.pathname !== '/') {
        navigate('/', { state: { skipScroll: true } });
        setTimeout(() => scrollToSection(itemId), 200);
      } else {
        scrollToSection(itemId);
      }
    }, 300);
  };

  // فتح نافذة إنشاء حساب (Sign Up)
  const handleAuthClick = () => {
    setIsOpen(false);
    setTimeout(() => {
      // التأكد من أن الوضع هو Sign Up
      if (!auth.isSignUp) {
        auth.toggleAuthMode();
      }
      auth.toggleAuthModal();
    }, 300);
  };

  return (
    <>
      <header className="absolute w-full z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
          
          {/* الشعار */}
          <AnimatedLogo />

          {/* التنقل لسطح المكتب */}
          <nav className="ml-2 lg:flex hidden space-x-8">
            {NAVIGATION_CONFIG.allItems.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.7 }}
              >
                <NavigationItem
                  item={item}
                  onScroll={scrollToSection}
                  currentPath={location.pathname}
                  variant="desktop"
                />
              </motion.div>
            ))}
          </nav>

          {/* زر Sign Up / User Info لسطح المكتب */}
          <div className="hidden lg:flex items-center ml-8 mr-4">
            {auth.isLoggedIn || auth.user ? (
              <div className="flex items-center gap-3">
                {auth.user?.image && (
                  <img 
                    src={auth.user.image} 
                    alt={auth.user.username} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                  />
                )}
                <span className="text-white text-sm font-medium">
                  {auth.user?.username || auth.user?.email || 'User'}
                </span>
                <button
                  onClick={auth.logout}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <AuthButton 
                type="signup"  // ← تغير من "signin" إلى "signup"
                onClick={handleAuthClick}
              />
            )}
          </div>

          {/* زر القائمة المتنقلة */}
          <div className="lg:hidden flex items-center ml-auto">
            <motion.button
              whileTap={{ scale: 0.7 }}
              onClick={toggleMenu}
              className="text-gray-300 p-2"
            >
              {isOpen ? <FiX className="h-7 w-7" /> : <FiMenu className="h-7 w-7" />}
            </motion.button>
          </div>
        </div>

        {/* القائمة المتنقلة */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.4 }}
          className="lg:hidden overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl border-t border-gray-200 dark:border-gray-700"
        >
          <nav className="container mx-auto flex flex-col">
            {NAVIGATION_CONFIG.allItems.map((item) => {
              const isHomeSection = NAVIGATION_CONFIG.homeSections.includes(item);
              return (
                <NavigationItem
                  key={item}
                  item={item}
                  onScroll={scrollToSection}
                  currentPath={location.pathname}
                  variant="mobile"
                  onItemClick={() => handleMobileItemClick(item.toLowerCase(), isHomeSection)}
                />
              );
            })}

            {/* زر Sign Up للجوال */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex flex-col">
                {auth.isLoggedIn || auth.user ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {auth.user?.image && (
                        <img 
                          src={auth.user.image} 
                          alt={auth.user.username} 
                          className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                        />
                      )}
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {auth.user?.username || auth.user?.email || 'User'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        auth.logout();
                        setIsOpen(false);
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <AuthButton 
                    type="signup"   // ← تغير من "signin" إلى "signup"
                    variant="mobile"
                    onClick={handleAuthClick}
                  />
                )}
              </div>
            </div>
          </nav>
        </motion.div>
      </header>

      {/* نافذة المصادقة */}
      <AuthModal {...auth} />
    </>
  );
}

export default Header;