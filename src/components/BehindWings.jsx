import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

function BehindWings() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
   
    // Animation for title
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
   
    // Animation for content
    gsap.fromTo(
      contentRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        }
      }
    )
   
    // Animation for image
    gsap.fromTo(
      imageRef.current,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        }
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative bg-gradient-to-b from-slate-950 to-violet-900 py-20 overflow-hidden"
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-violet-500/20 to-purple-600/30 blur-2xl sm:blur-3xl -z-10 scale-110"></div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-violet-500/25 sm:bg-violet-500/30 rounded-full blur-[80px] sm:blur-[120px] -z-20"></div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
         
          {/* Left Section - Content */}
          <div className="space-y-6">
            <div className="relative inline-block">
              <h1
                ref={titleRef}
                className="text-4xl md:text-5xl lg:text-6xl font-bold opacity-0 relative z-10 bg-gradient-to-r from-purple-400 via-pink-300 to-violet-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
              >
               Behind Wings
              </h1>
              {/* Animated underline */}
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 rounded-full transform scale-x-0 animate-[scaleIn_1s_ease-out_1.2s_forwards]"></div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-300 to-violet-400 blur-2xl opacity-50 animate-pulse -z-10"></div>
              {/* Floating particles */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
            </div>
            
            <style jsx>{`
              @keyframes gradient {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              @keyframes scaleIn {
                to { transform: scale(1); }
              }
              .animate-gradient {
                animation: gradient 3s ease infinite;
              }
            `}</style>
           
            <div ref={contentRef} className="opacity-0 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-4">
                Wings Airlines - Fly Smart, Stay Smarter
              </h2>
             
              <p className="text-base md:text-lg text-purple-100 leading-relaxed">
                Welcome to Wings Airlines, where cutting-edge technology meets world-class hospitality. 
                We're proud to introduce the aviation industry's first integrated AI Travel Concierge—
                your personal assistant for discovering and booking hotels in over 150 top destinations 
                worldwide, from London and Barcelona to Singapore and Los Angeles.
              </p>
             
              <p className="text-base md:text-lg text-purple-100 leading-relaxed">
                Imagine this: You book your flight, then simply chat with our intelligent system to 
                explore hotel options near your destination. Real-time pricing, instant comparisons, 
                exclusive Wings member discounts, and one-click reservations—all without leaving our 
                platform. It's travel planning reimagined, and it's available only with Wings Airlines.
              </p>

              <p className="text-base md:text-lg text-purple-100 leading-relaxed">
                Beyond innovation, we deliver excellence at every altitude. Our premium fleet features 
                spacious seating with extra legroom, high-speed Wi-Fi to stay connected, and personalized 
                entertainment on demand. Add our globally-trained crew who speak 40+ languages, and you 
                have more than an airline—you have a travel revolution.
              </p>

              <p className="text-base md:text-lg text-purple-100 leading-relaxed">
                With Wings Airlines, your entire journey—from flight to accommodation—flows effortlessly. 
                Book smarter. Fly better. Stay connected. This is the future of travel, and it starts 
                the moment you choose Wings.
              </p>
            </div>
          </div>
         
          {/* Right Section - Image */}
          <div ref={imageRef} className="relative opacity-0 flex justify-center lg:justify-end group">
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 via-violet-500/30 to-fuchsia-500/40 rounded-3xl blur-2xl scale-105 group-hover:scale-110 transition-transform duration-700 -z-10"></div>
              
              {/* Image container with hover effects */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-purple-400/30 group-hover:border-purple-400/70 shadow-2xl shadow-purple-900/50 backdrop-blur-sm bg-white/5 transition-all duration-500 group-hover:shadow-purple-500/60 group-hover:shadow-3xl transform group-hover:scale-[1.02]">
                <img
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  src="public/Lucid_Origin_Professional_airline_crew_of_9_people_standing_in_2.jpg"
                  alt="Wings Airlines Professional Crew"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-violet-900/10 group-hover:from-purple-900/40 transition-all duration-500"></div>
                
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                {/* Animated border on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-purple-400 rounded-tl-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-pink-400 rounded-br-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>

                {/* Info overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/95 via-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2">Wings Airlines Team</h3>
                    <p className="text-purple-200">Excellence in Service, Passion in Every Flight</p>
                  </div>
                </div>
              </div>

              {/* Decorative floating elements with enhanced animation */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/30 rounded-full blur-xl animate-pulse group-hover:w-24 group-hover:h-24 group-hover:bg-purple-500/50 transition-all duration-700"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-violet-500/30 rounded-full blur-xl animate-pulse group-hover:w-28 group-hover:h-28 group-hover:bg-violet-500/50 transition-all duration-700" style={{animationDelay: '0.5s'}}></div>
              
              {/* Orbiting particles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute left-0 top-1/2 w-2 h-2 bg-violet-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                <div className="absolute right-0 top-1/2 w-2 h-2 bg-fuchsia-400 rounded-full animate-ping" style={{animationDelay: '0.9s'}}></div>
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </section>
  )
}

export default BehindWings