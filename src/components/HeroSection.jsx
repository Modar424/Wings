import { motion } from 'framer-motion';
import 'boxicons/css/boxicons.min.css';

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-violet-900 to-slate-950 flex xl:flex-row flex-col-reverse items-center justify-center xl:justify-between lg:px-24 px-6 sm:px-10 py-10 xl:py-0 relative overflow-hidden">
      
      {/* ==================== القسم النصي (الجانب الأيسر) ==================== */}
      <div className="z-40 xl:w-1/2 w-full xl:mb-0 mb-10">
        
        {/* ==================== العنوان الرئيسي المتحرك ==================== */}
        <div className="relative">
          {/* السطر الأول: TRAVEL And */}
          <motion.h1 className="text-lg sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold z-10 mb-4 sm:mb-6 -ml-1 relative">
            {"TRAVEL And".split('').map((char, index) => (
              <motion.span
                key={`line1-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.3 + (index * 0.04),
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="inline-block"
                style={{
                  display: char === ' ' ? 'inline' : 'inline-block',
                  minWidth: char === ' ' ? '0.3em' : 'auto',
                  background: 'linear-gradient(135deg, #f0abfc, #c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* السطر الثاني: Enjoy With US */}
          <motion.h1 className="text-lg sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold z-10 relative">
            {"Enjoy With Us".split('').map((char, index) => (
              <motion.span
                key={`line2-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.3 + ((11 + index) * 0.04),
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="inline-block"
                style={{
                  display: char === ' ' ? 'inline' : 'inline-block',
                  minWidth: char === ' ' ? '0.3em' : 'auto',
                  background: 'linear-gradient(135deg, #f0abfc, #c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>
          {/* جزيئات متحركة حول العنوان (تأثير ديناميكي) */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-violet-500 rounded-full opacity-40"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* خط متوهج تحت العنوان */}
          <motion.div
            className="mt-3 h-1 rounded-full mr-auto"
            style={{
              width: '94%',
           background: 'linear-gradient(135deg, #db2777, #9333ea, #7c3aed)'
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              delay: 2.3,
              duration: 1,
              ease: "easeOut"
            }}
          />
        </div>
        
        {/* ==================== النص الوصفي ==================== */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ease: "easeOut",
            delay: 2.5,
            duration: 0.8,
          }}
          className="text-base sm:text-xl md:text-xl lg:text-2xl text-purple-300 max-w-2xl mb-6 sm:mb-8 mt-8"
        >
         At Wings Airlines, we connect you to the world with unbeatable value and exceptional service.
         Enjoy a safe, comfortable journey to over 60 destinations worldwide.
          <span className="text-xl sm:text-2xl font-semibold" style={{
   background: 'linear-gradient(135deg, #1e40af, #4f46e5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }}>
  <br/> Elevate Your Travel. Elevate Your Life.
  </span>
        </motion.p>
        
        {/* ==================== زر الترحيب ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 25,
            delay: 2.3,
            duration: 1.5,
          }}
          className='relative w-fit'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10
            }}
            className='relative w-[180px] sm:w-48 h-10 bg-gradient-to-r from-violet-600 to-violet-400 shadow-md hover:shadow-lg hover:shadow-violet-600/50 transition-shadow duration-300 rounded-full'
          >
            {/* محتوى الزر الداخلي */}
            <div className='absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1 text-xl sm:text-2xl'>
              <i className='bx bx-diamond bx-flashing'></i>
              <span>WELCOME</span>
            </div>
          </motion.button>
        </motion.div>
      </div>
      
      {/* ==================== قسم الصورة (الجانب الأيمن) ==================== */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 25,
          delay: 1.5,
          duration: 1.5,
        }}
        className="relative z-30 xl:w-1/2 w-full max-w-[550px] xl:max-w-[750px] flex items-center justify-center mb-8 xl:mb-0 px-4 sm:px-0 mt-12 sm:mt-16 md:mt-8 xl:mt-0 group"
      >
        <div className="relative w-full">
          
          {/* ==================== التوهج الخلفي للصورة ==================== */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 via-purple-500/30 to-fuchsia-500/40 rounded-3xl blur-2xl scale-105 group-hover:scale-110 transition-transform duration-700 -z-10"></div>
          
          {/* ==================== حاوية الصورة مع جميع التأثيرات ==================== */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-violet-400/30 group-hover:border-violet-400/70 shadow-2xl shadow-violet-900/50 backdrop-blur-sm bg-white/5 transition-all duration-500 group-hover:shadow-violet-500/60 group-hover:shadow-3xl transform group-hover:scale-[1.02]">
            
            {/* الصورة الرئيسية */}
            <img
              src="/photo-1464037866556-6812c9d1c72e.avif"
              alt="Airplane at Night"
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* طبقة تدرج لوني فوق الصورة */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 via-transparent to-purple-900/10 group-hover:from-violet-900/40 transition-all duration-500"></div>
            
            {/* تأثير الضوء اللامع عند التمرير */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            {/* الزوايا المتحركة عند التمرير */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* زاوية علوية يسرى */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-violet-400 rounded-tl-3xl animate-pulse"></div>
              {/* زاوية سفلية يمنى */}
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-pink-400 rounded-br-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>

            {/* ==================== معلومات تظهر عند التمرير ==================== */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/95 via-violet-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white mb-2">Wings Airlines</h3>
                <p className="text-violet-200">Your Journey Begins Here</p>
              </div>
            </div>
          </div>

          {/* ==================== التأثيرات الخلفية الإضافية ==================== */}
          {/* طبقة ضبابية ملونة */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-violet-500/20 to-purple-600/30 blur-2xl sm:blur-3xl -z-10 scale-110"></div>
          
          {/* دائرة ضوئية كبيرة في المنتصف */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] lg:w-[550px] lg:h-[550px] bg-violet-500/25 sm:bg-violet-500/30 rounded-full blur-[80px] sm:blur-[120px] -z-20"></div>

          {/* ==================== عناصر زخرفية متحركة ==================== */}
          {/* دائرة علوية يمنى */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-violet-500/30 rounded-full blur-xl animate-pulse group-hover:w-24 group-hover:h-24 group-hover:bg-violet-500/50 transition-all duration-700"></div>
          {/* دائرة سفلية يسرى */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/30 rounded-full blur-xl animate-pulse group-hover:w-28 group-hover:h-28 group-hover:bg-purple-500/50 transition-all duration-700" style={{animationDelay: '0.5s'}}></div>
          
          {/* جزيئات دائرية متحركة في الزوايا الأربع */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-violet-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute left-0 top-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
            <div className="absolute right-0 top-1/2 w-2 h-2 bg-fuchsia-400 rounded-full animate-ping" style={{animationDelay: '0.9s'}}></div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection