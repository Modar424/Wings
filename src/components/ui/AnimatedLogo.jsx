import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const AnimatedLogo = () => (
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.3, duration: 1.2 }}
    className="flex items-center"
  >
    <Link to="/" className="flex items-center gap-2 group">
      {/* الجناح الأيسر */}
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ x: -5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <svg width="35" height="35" viewBox="0 0 100 100">
          <motion.path
            d="M 80,50 Q 60,30 40,25 Q 50,45 60,50 Q 50,55 40,75 Q 60,70 80,50 Z"
            fill="url(#leftWingGradient)"
            className="drop-shadow-lg group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="leftWingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* حرف W */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/50 group-hover:shadow-xl transition-all duration-300"
      >
        <span className="text-white font-black text-xl group-hover:scale-110 transition-transform duration-300">
          W
        </span>
      </motion.div>

      {/* الجناح الأيمن */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ x: 5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <svg width="35" height="35" viewBox="0 0 100 100">
          <motion.path
            d="M 20,50 Q 40,30 60,25 Q 50,45 40,50 Q 50,55 60,75 Q 40,70 20,50 Z"
            fill="url(#rightWingGradient)"
            className="drop-shadow-lg group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="rightWingGradient" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* نص Wings */}
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="ml-1 text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 bg-clip-text text-transparent whitespace-nowrap group-hover:from-purple-600 group-hover:via-violet-500 group-hover:to-purple-600 transition-all duration-500"
      >
        Wings
      </motion.span>
    </Link>
  </motion.div>
);