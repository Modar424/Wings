import { useRef, useEffect } from "react"
import { gsap } from "gsap" 
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

function ServicesSection() {
  // ==================== المراجع ====================
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const servicesRef = useRef([])

  // ==================== تأثيرات الحركة عند التمرير ====================
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    // تحريك العنوان عند الظهور
    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        }
      }
    )
    
    // تحريك بطاقات الخدمات بالتتابع
    servicesRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2 + (index * 0.15),
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          }
        }
      )
    })
  }, [])

  // ==================== بيانات الخدمات ====================
  const services = [
    {
      icon: "✈️",
      title: "Modern Fleet",
      description: "Experience comfort in our state-of-the-art aircraft equipped with the latest technology"
    },
    {
      icon: "☕",
      title: "Premium Hospitality",
      description: "Enjoy exceptional service with gourmet meals and refreshments throughout your flight"
    },
    {
      icon: "💺",
      title: "Luxury Seating",
      description: "Relax in spacious seats designed for maximum comfort on every journey"
    },
    {
      icon: "⭐",
      title: "Excellence Service",
      description: "Our award-winning service ensures a memorable travel experience every time"
    },
    {
      icon: "🤖",
      title: "WingsAI Assistant",
      description: "Guiding travelers since 2003. Discover the perfect hotels and restaurants with our intelligent assistant WingsAI"
    },
    {
      icon: "🧭",
      title: "Transformative Travel",
      description: "Travel broadens horizons and enriches minds. Take your first step with Wings and begin your journey to something better"
    },
    {
      icon: "🌐",
      title: "Global Network",
      description: "Connect to over 500 destinations worldwide with seamless booking and 24/7 customer support in multiple languages"
    },
    {
      icon: "💎",
      title: "Exclusive Rewards",
      description: "Earn points on every flight and unlock premium benefits, upgrades, and special offers designed for our valued travelers"
    },
    {
      icon: "🛡️",
      title: "Travel Protection",
      description: "Fly with confidence knowing you're covered with comprehensive insurance and flexible booking options for unexpected changes"
    },
    {
      icon: "🌙",
      title: "Premium Lounges",
      description: "Access exclusive airport lounges worldwide with complimentary refreshments, high-speed Wi-Fi, and relaxation spaces before your flight"
    }
  ]

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen relative bg-gradient-to-b from-violet-900 to-slate-950 py-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* ==================== قسم العنوان الرئيسي ==================== */}
        <div className="relative mb-16">
          {/* عنوان "Our Services" مع تأثير التدرج اللوني */}
          <motion.h1 
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ease: "easeOut",
              delay: 0.3,
              duration: 0.8,
            }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-center opacity-0"
            style={{
              background: 'linear-gradient(135deg, #f0abfc, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Our Services
          </motion.h1>

          {/* خط متوهج تحت العنوان */}
          <motion.div
            className="mt-6 h-1 rounded-full mx-auto"
            style={{
              width: '200px',
              background: 'linear-gradient(90deg, #c084fc 0%, #f0abfc 50%, #c084fc 100%)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              delay: 0.8,
              duration: 1,
              ease: "easeOut"
            }}
          />

          {/* جزيئات متحركة حول العنوان (تأثير ديناميكي) */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-violet-300 rounded-full opacity-40"
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
        </div>
        
        {/* ==================== شبكة بطاقات الخدمات ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              ref={el => servicesRef.current[index] = el}
              whileHover={{ scale: 1.05 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10
              }}
              className="relative bg-gradient-to-r from-violet-600 to-violet-400 rounded-2xl p-[3px] opacity-0 shadow-md hover:shadow-lg hover:shadow-violet-600/50 transition-shadow duration-300"
            >
              {/* حاوية البطاقة الداخلية */}
              <div className="relative bg-slate-900 rounded-2xl p-8 text-center h-full hover:bg-black transition-all duration-500 group overflow-hidden">
                
                {/* ==================== تأثير قطرات المطر ==================== */}
                {/* يظهر بشكل افتراضي ويختفي عند التمرير */}
                <div className="absolute inset-0 opacity-60 group-hover:opacity-0 transition-opacity duration-500">
                  {/* قطرات متحركة في مواضع مختلفة */}
                  <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
                  <div className="absolute top-[25%] left-[60%] w-2 h-2 bg-blue-300/50 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                  <div className="absolute top-[40%] left-[35%] w-2 h-2 bg-blue-400/55 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                  <div className="absolute top-[55%] left-[75%] w-2 h-2 bg-blue-300/60 rounded-full animate-ping" style={{animationDelay: '0.9s'}}></div>
                  <div className="absolute top-[70%] left-[15%] w-2 h-2 bg-blue-400/50 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
                  <div className="absolute top-[85%] left-[85%] w-2 h-2 bg-blue-300/55 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                  <div className="absolute top-[15%] left-[45%] w-1.5 h-1.5 bg-blue-400/70 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute top-[60%] left-[55%] w-1.5 h-1.5 bg-blue-300/65 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
                  <div className="absolute top-[35%] left-[90%] w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-ping" style={{animationDelay: '1.1s'}}></div>
                  <div className="absolute top-[50%] left-[10%] w-1 h-1 bg-blue-300/70 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-[80%] left-[50%] w-1 h-1 bg-blue-400/65 rounded-full animate-ping" style={{animationDelay: '1.4s'}}></div>
                </div>
                
                {/* ==================== محتوى البطاقة ==================== */}
                <div className="relative z-10">
                  {/* الأيقونة */}
                  <div className="text-6xl md:text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  
                  {/* عنوان الخدمة */}
                  <h3 className="text-xl md:text-2xl font-bold text-purple-200 mb-4 group-hover:text-purple-300 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  {/* وصف الخدمة */}
                  <p className="text-sm md:text-base text-purple-100/80 leading-relaxed group-hover:text-purple-200 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* ==================== التأثيرات الخلفية ==================== */}
      {/* طبقة ضبابية ملونة للخلفية */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-purple-500/20 to-violet-600/30 blur-2xl sm:blur-3xl -z-10 scale-110"></div>
      
      {/* دائرة ضوئية كبيرة في المنتصف */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-purple-500/25 sm:bg-purple-500/30 rounded-full blur-[80px] sm:blur-[120px] -z-20"></div>
    </section>
  )
}

export default ServicesSection