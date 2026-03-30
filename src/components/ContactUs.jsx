import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Plane, Users, Package, Award } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ContactUs = () => {
  // ==================== الحالات (States) ====================
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bookingNumber: '',
    inquiryType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ==================== معالج إرسال النموذج ====================
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        bookingNumber: '',
        inquiryType: '',
        message: ''
      });
      
      // إخفاء رسالة النجاح بعد 5 ثواني
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  // ==================== معالج تغيير الحقول ====================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ==================== بيانات طرق التواصل ====================
  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      info: "+1 (800) 123-4567",
      subInfo: "24/7 Available",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      info: "support@wings.com",
      subInfo: "Response within 24h",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Head Office",
      info: "123 Aviation Blvd",
      subInfo: "New York, NY 10001",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      info: "Mon - Sun: 24/7",
      subInfo: "Always here for you",
      color: "from-green-500 to-emerald-500"
    }
  ];

  // ==================== بيانات الأقسام المتخصصة ====================
  const departments = [
    {
      icon: <Plane className="w-8 h-8" />,
      title: "New Bookings",
      phone: "+1 (800) 111-2222",
      description: "Book your next flight"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Travel",
      phone: "+1 (800) 333-4444",
      description: "10+ passengers"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Cargo & Freight",
      phone: "+1 (800) 555-6666",
      description: "Shipping services"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Loyalty Program",
      phone: "+1 (800) 777-8888",
      description: "Miles & rewards"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950">
      
      {/* ==================== قسم العنوان الرئيسي (Hero) ==================== */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="relative mb-8">
              {/* العنوان الرئيسي */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ease: "easeOut",
                  delay: 0.3,
                  duration: 0.8,
                }}
                className="text-5xl md:text-6xl font-bold mb-4"
                style={{
                  background: 'linear-gradient(135deg, #f0abfc, #c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Get in Touch
              </motion.h1>

              {/* خط متوهج تحت العنوان */}
              <motion.div
                className="h-1 w-48 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full mb-6"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 1,
                  ease: "easeOut"
                }}
              />

              {/* جزيئات متحركة حول العنوان */}
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

            {/* النص الوصفي */}
            <p className="text-xl text-gray-300">
              We're here to help you 24/7. Reach out to us anytime!
            </p>
          </div>
        </div>
      </div>

      {/* ==================== شبكة طرق التواصل ==================== */}
      <div className="container mx-auto px-4 -mt-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.05,
                y: -5
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
            >
              {/* الأيقونة */}
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center mb-4 text-white group-hover:shadow-lg`}
              >
                {method.icon}
              </motion.div>
              {/* المعلومات */}
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">{method.title}</h3>
              <p className="text-gray-300 font-medium">{method.info}</p>
              <p className="text-gray-400 text-sm mt-1">{method.subInfo}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ==================== المحتوى الرئيسي (نموذج + معلومات) ==================== */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* ==================== نموذج الاتصال ==================== */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
            
            {/* رسالة النجاح */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-300 text-center">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            {/* حقول النموذج */}
            <div className="space-y-5">
              {/* الاسم الكامل */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                  placeholder="John Doe"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {/* رقم الحجز (اختياري) */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Booking Number (Optional)</label>
                <input
                  type="text"
                  name="bookingNumber"
                  value={formData.bookingNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                  placeholder="WNG123456"
                />
              </div>

              {/* نوع الاستفسار */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Inquiry Type *</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all"
                >
                  <option value="" className="bg-slate-900">Select an option</option>
                  <option value="new-booking" className="bg-slate-900">New Booking</option>
                  <option value="modify-booking" className="bg-slate-900">Modify Booking</option>
                  <option value="flight-inquiry" className="bg-slate-900">Flight Inquiry</option>
                  <option value="complaints" className="bg-slate-900">Complaints & Suggestions</option>
                  <option value="refund" className="bg-slate-900">Refund Request</option>
                  <option value="lost-baggage" className="bg-slate-900">Lost Baggage</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>

              {/* الرسالة */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              {/* زر الإرسال */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* ==================== الأقسام المتخصصة والروابط السريعة ==================== */}
          <div className="space-y-8">
            
            {/* ==================== الأقسام المتخصصة ==================== */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Specialized Departments</h2>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ 
                      scale: 1.03,
                      x: 5
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      {/* الأيقونة */}
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="text-purple-400 group-hover:text-purple-300"
                      >
                        {dept.icon}
                      </motion.div>
                      {/* المعلومات */}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">{dept.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{dept.description}</p>
                        <a href={`tel:${dept.phone}`} className="text-purple-400 hover:text-purple-300 font-medium">
                          {dept.phone}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ==================== WingsAI المساعد الذكي ==================== */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden cursor-pointer"
            >
              {/* التأثيرات الخلفية */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              
              {/* المحتوى */}
              <div className="relative z-10">
                {/* العنوان والأيقونة */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MessageCircle size={28} className="animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold">Not Sure Where to Stay or Eat?</h3>
                </div>
                
                {/* الوصف والمميزات */}
                <div className="mb-6 space-y-3">
                  <p className="text-white/95 text-lg font-medium">
                    Let <span className="font-bold text-cyan-300">Wings AI</span> be your personal travel assistant!
                  </p>
                  <p className="text-white/90">
                    Our intelligent AI will help you find the perfect hotel and restaurant that matches your preferences, budget, and location. Get instant recommendations tailored just for you.
                  </p>
                  
                  {/* شارات المميزات */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">🏨 Hotels</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">🍽️ Restaurants</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">💰 Best Prices</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">⚡ Instant Results</span>
                  </div>
                </div>
                
                {/* زر الدردشة */}
                <motion.a 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="/wingsai" 
                  className="block w-full bg-white text-blue-900 py-4 rounded-xl font-bold text-lg hover:bg-cyan-300 hover:text-blue-950 transition-all duration-300 text-center shadow-lg hover:shadow-2xl group"
                >
                  <span className="flex items-center justify-center gap-2">
                    <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                    Chat with Wings AI Now
                  </span>
                </motion.a>
                
                {/* معلومات إضافية */}
                <p className="text-center text-white/80 text-sm mt-3">
                  ✨ Available 24/7 • Free to use • Instant responses
                </p>
              </div>
            </motion.div>

            {/* ==================== وسائل التواصل الاجتماعي ==================== */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <motion.a 
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white"
                >
                  <FaFacebook size={24} />
                </motion.a>
                <motion.a 
                  href="https://www.twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white"
                >
                  <FaTwitter size={24} />
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white"
                >
                  <FaInstagram size={24} />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ==================== الروابط السريعة (FAQ) ==================== */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['FAQs', 'Baggage Info', 'Flight Status', 'Cancellation Policy', 'Travel Requirements', 'Refund Policy', 'Loyalty Program', 'Special Assistance'].map((link, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-lg py-3 px-4 text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium"
              >
                {link}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;