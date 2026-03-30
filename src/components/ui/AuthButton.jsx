import { motion } from 'framer-motion';
import { FiUserPlus, FiLogOut } from 'react-icons/fi';

export const AuthButton = ({ onClick, variant = 'desktop', isLoggedIn = false, user = null, onLogout }) => {

  if (variant === 'mobile') {
    return isLoggedIn ? (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-4 py-2">
          {user?.image
            ? <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full object-cover border-2 border-violet-500" />
            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
          }
          <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">{user?.username}</span>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 font-medium rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all"
        >
          <FiLogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    ) : (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-violet-500/25 transition-all"
      >
        <FiUserPlus className="w-4 h-4" />
        Sign Up
      </button>
    );
  }

  // Desktop
  return isLoggedIn ? (
    <div className="flex items-center gap-3">
      {/* Avatar + username */}
      <div className="flex items-center gap-2">
        {user?.image
          ? <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full object-cover border-2 border-violet-500" />
          : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
        }
        <span className="text-white text-sm font-medium hidden xl:block">{user?.username}</span>
      </div>
      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
      >
        <FiLogOut className="w-4 h-4" />
        <span className="hidden xl:block">Sign Out</span>
      </motion.button>
    </div>
  ) : (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-violet-500/40 transition-all duration-300 group relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
      <FiUserPlus className="w-4 h-4 relative z-10" />
      <span className="relative z-10">Sign Up</span>
    </motion.button>
  );
};