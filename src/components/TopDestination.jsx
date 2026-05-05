import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect } from "react";

const TopDestination = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleLineRef = useRef(null);
  const lettersRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projectImages, setProjectImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        console.log("🚀 fetching top destinations...");
        const token = localStorage.getItem("access_token");
        console.log("🔐 token:", "access_token");
        const response = await axios.get(
          "https://hosting-wings.onrender.com/api/flights/Destination/top",
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          },
        );
        console.log("✅ API response:", response.data);

        setProjectImages(response.data);
      } catch (err) {
        console.log("❌ Error message:", err.message);
        console.log("❌ Full error:", err.response);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projectImages.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + projectImages.length) % projectImages.length,
    );
  };

  const titleText = "Top Destination";
  if (loading) {
    return (
      <div className="text-white text-center mt-20 text-2xl">
        Loading destinations...
      </div>
    );
  }
  return (
    <section
      id="horizontal-section"
      className="relative py-20 bg-gradient-to-br from-slate-950 to-violet-900 overflow-hidden min-h-screen"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 mb-8 relative z-10">
        {/* ==================== قسم العنوان الرئيسي ==================== */}
        <div className="relative mb-8">
          {/* عنوان "Top Destination" مع تأثير التدرج اللوني */}
          <motion.h1
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ease: "easeOut",
              delay: 0.3,
              duration: 0.8,
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-4"
            style={{
              background: "linear-gradient(135deg, #f0abfc, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Top Destination
          </motion.h1>

          {/* خط متوهج تحت العنوان */}
          <motion.div
            ref={titleLineRef}
            className="h-1 rounded-full mx-auto"
            style={{
              width: "280px",
              background:
                "linear-gradient(90deg, #c084fc 0%, #f0abfc 50%, #c084fc 100%)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
              delay: 0.8,
              duration: 1,
              ease: "easeOut",
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
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* ==================== قسم عرض الصور (Carousel) ==================== */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {projectImages.map((project, index) => (
              <div
                key={project.id}
                className={`absolute w-full h-full transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? "opacity-100 translate-x-0 scale-100"
                    : index < currentIndex
                      ? "opacity-0 -translate-x-full scale-95"
                      : "opacity-0 translate-x-full scale-95"
                }`}
              >
                <div className="relative w-full h-full p-4">
                  {/* حاوية الصورة مع جميع التأثيرات */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_60px_rgba(139,92,246,0.6),0_0_40px_rgba(168,85,247,0.4),0_0_80px_rgba(236,72,153,0.3)] transition-all duration-500 group hover:scale-[1.02] border-2 border-violet-400/30 hover:border-violet-400/70">
                    {/* طبقة شفافة ملونة تظهر عند التمرير */}
                    <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/20 transition-all duration-500 z-20 pointer-events-none"></div>

                    {/* تأثير الضوء المتحرك عند التمرير */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* الزوايا المتوهجة (أعلى يسار وأسفل يمين) */}
                    <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-violet-400/0 group-hover:border-violet-400 rounded-tl-2xl group-hover:animate-pulse transition-all duration-500 z-10" />
                    <div
                      className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-pink-400/0 group-hover:border-pink-400 rounded-br-2xl group-hover:animate-pulse transition-all duration-500 z-10"
                      style={{ animationDelay: "0.5s" }}
                    />

                    {/* نقاط متحركة في الزوايا الأربع */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                      <div className="absolute top-0 left-1/2 w-3 h-3 bg-violet-400 rounded-full animate-ping"></div>
                      <div
                        className="absolute bottom-0 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                      <div
                        className="absolute left-0 top-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.6s" }}
                      ></div>
                      <div
                        className="absolute right-0 top-1/2 w-2 h-2 bg-fuchsia-400 rounded-full animate-ping"
                        style={{ animationDelay: "0.9s" }}
                      ></div>
                    </div>

                    {/* دوائر ضوئية متوهجة (أعلى يمين وأسفل يسار) */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-violet-500/30 rounded-full blur-xl animate-pulse group-hover:w-24 group-hover:h-24 group-hover:bg-violet-500/50 transition-all duration-700 pointer-events-none" />
                    <div
                      className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/30 rounded-full blur-xl animate-pulse group-hover:w-28 group-hover:h-28 group-hover:bg-purple-500/50 transition-all duration-700 pointer-events-none"
                      style={{ animationDelay: "0.5s" }}
                    />

                    {/* الصورة الرئيسية مع تأثير التكبير عند التمرير */}
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 relative z-0"
                      src={project.image}
                      alt={`${project.slug} destination`}
                    />

                    {/* شارة التقييم (أعلى يمين الصورة) */}
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-orange-500 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-20">
                      <div className="flex items-center gap-2">
                        {/* النجوم */}
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(project.avg_rate)
                                  ? "fill-white text-white"
                                  : project.landmarks - i >= 0.5
                                    ? "fill-white/50 text-white"
                                    : "fill-white/20 text-white/20"
                              }`}
                            />
                          ))}
                        </div>
                        {/* رقم التقييم */}
                        <span className="text-white font-bold text-lg">
                          {project.landmarks}
                        </span>
                      </div>
                    </div>

                    {/* قسم المعلومات (أسفل الصورة) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-8 z-20">
                      {/* اسم المدينة مع النجوم */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-white text-4xl font-bold">
                          {project.country}
                        </h3>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(project.avg_rate)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-400 text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {/* الوصف القصير */}
                      <p className="text-purple-200 text-lg font-semibold mb-2">
                        {project.slug}
                      </p>
                      {/* الوصف الكامل */}
                      <p className="text-white/90 text-base leading-relaxed">
                        {project.Bio}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ==================== أزرار التنقل ==================== */}
          {/* زر السابق (يسار) */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-10"
            aria-label="Previous destination"
          >
            <ChevronLeft size={32} />
          </button>

          {/* زر التالي (يمين) */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-10"
            aria-label="Next destination"
          >
            <ChevronRight size={32} />
          </button>

          {/* ==================== مؤشرات التنقل (Dots) ==================== */}
          <div className="flex justify-center gap-3 mt-6">
            {projectImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-10 h-3 bg-gradient-to-r from-purple-500 to-pink-500"
                    : "w-3 h-3 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to destination ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopDestination;
