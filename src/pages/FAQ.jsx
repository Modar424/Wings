import React, { useState } from 'react';
import { ChevronDown, Plane, RotateCcw, Luggage, MapPin, Clock, Utensils, Gift, Users, PawPrint, Headphones, CreditCard, Calendar, Smartphone, Shield, Bell, FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function FAQ() {
  // ═══════════════════════════════════════════════════════════════
  // STATE MANAGEMENT - إدارة الحالة
  // ═══════════════════════════════════════════════════════════════
  const [openIndex, setOpenIndex] = useState(null);

  // ═══════════════════════════════════════════════════════════════
  // FAQ DATA - بيانات الأسئلة الشائعة
  // ═══════════════════════════════════════════════════════════════
  const faqs = [
    {
      question: "How can I book a flight ticket?",
      icon: Plane,
      answer: "You can easily book your ticket through our official website or mobile app. Simply enter your flight details and follow our secure payment process. Our booking system is user-friendly and takes just a few minutes."
    },
    {
      question: "What payment methods do you accept?",
      icon: CreditCard,
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secured with SSL encryption to protect your payment information."
    },
    {
      question: "Can I make a reservation without immediate payment?",
      icon: Calendar,
      answer: "Yes! You can hold your reservation for up to 24 hours without payment. This gives you time to finalize your travel plans. After 24 hours, you'll need to complete the payment to confirm your booking."
    },
    {
      question: "How do I receive my booking confirmation?",
      icon: Bell,
      answer: "Once your booking is complete, you'll receive an instant confirmation email with your booking reference number, e-ticket, and flight details. You can also access your booking anytime through our mobile app or website."
    },
    {
      question: "Is my personal information secure during booking?",
      icon: Shield,
      answer: "Absolutely! We use industry-standard encryption and comply with international data protection regulations. Your personal and payment information is stored securely and never shared with third parties without your consent."
    },
    {
      question: "Can I book tickets for someone else?",
      icon: Users,
      answer: "Yes, you can book tickets for family members or friends. Simply enter their information during the booking process. Make sure all passenger details match their official travel documents exactly."
    },
    {
      question: "What is your cancellation and refund policy?",
      icon: RotateCcw,
      answer: "Cancellation policies vary depending on your ticket type. Economy tickets can be modified with a change fee, while premium tickets offer greater flexibility. You can cancel your ticket up to 72 hours before departure for a full refund."
    },
    {
      question: "What baggage allowance do I have?",
      icon: Luggage,
      answer: "In Economy Class: one carry-on bag + one checked bag (23 kg). In Premium Class: two carry-on bags + two checked bags (32 kg each). Additional fees apply for excess baggage."
    },
    {
      question: "Can I change my flight date?",
      icon: MapPin,
      answer: "Yes, you can change your flight date through your account on our website or app at no extra cost, subject to seat availability on the alternative flight. Changes must be made at least 24 hours before departure."
    },
    {
      question: "Do I need to print my ticket?",
      icon: Smartphone,
      answer: "No need to print! Simply show your mobile boarding pass on our app or the confirmation email at the airport. However, we recommend having a printed copy as backup in case of technical issues."
    },
    {
      question: "What documents do I need for booking?",
      icon: FileText,
      answer: "For domestic flights, you need a valid government-issued ID. For international flights, you need a valid passport and any required visas. Make sure your documents are valid for at least 6 months beyond your travel date."
    },
    {
      question: "How early should I arrive at the airport?",
      icon: Clock,
      answer: "We recommend arriving at least 2 hours before domestic flights and 3 hours before international flights. This gives you enough time for check-in and security screening."
    },
    {
      question: "Are meals included in my ticket?",
      icon: Utensils,
      answer: "Free meals are included in Premium Class and on long-haul flights. For Economy Class on long-haul flights, you can purchase meals from our on-board menu."
    },
    {
      question: "How can I join the Wings Rewards loyalty program?",
      icon: Gift,
      answer: "Registration is free and easy! Sign up through our website or app and earn points on every flight. Points can be redeemed for free tickets or exclusive discounts."
    },
    {
      question: "What services do you offer for passengers with special needs?",
      icon: Users,
      answer: "We provide special services for passengers with disabilities including assistance with boarding and deplaning, wheelchairs, and other accommodations. Please inform us at booking or at least 48 hours before travel."
    },
    {
      question: "Can I bring my pet on the plane?",
      icon: PawPrint,
      answer: "Yes, we allow certain pets in an appropriate carrier for an additional fee. You'll need a veterinary health certificate and must register your pet at least 7 days before your flight."
    },
    {
      question: "How can I contact customer support in case of emergency?",
      icon: Headphones,
      answer: "You can reach us via live chat (24/7), email, phone, or social media. Our customer service team is ready to assist you at any time."
    }
  ];

  // ═══════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS - الوظائف المساعدة
  // ═══════════════════════════════════════════════════════════════
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER - العرض الرئيسي
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-slate-950 text-white selection:bg-purple-500/30 p-8 relative overflow-hidden">
      {/* Back to Home Button - مطابق لصفحة Booking */}
<motion.button
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => window.location.href = '/'}
  className="fixed top-4 left-2 md:top-6 md:left-6 z-20 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs md:text-sm font-medium hover:bg-white/20 transition-all group"
>
  <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
  <span className="hidden sm:inline">Back to Home</span>
  <span className="sm:hidden">Back</span>
</motion.button>

      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND GLOW EFFECTS - تأثيرات التوهج الخلفي
          دوائر متوهجة متحركة في الخلفية (مطابقة لألوان Booking)
          ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-black to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>
      <div className="absolute bottom-1/4 right-1/3 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px] bg-purple-600/15 rounded-full blur-[90px] -z-10 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* ═══════════════════════════════════════════════════════════
          HEADER SECTION - قسم الرأس
          العنوان والوصف مع تأثيرات الحركة
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto mb-16 relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold bg-gradient-to-r from-white via-purple-400 to-violet-600 bg-clip-text text-transparent mb-4 drop-shadow-2xl"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Find answers to the most common questions from our passengers
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            FAQ ACCORDION ITEMS - عناصر الأكورديون للأسئلة
            كل سؤال قابل للتوسع مع تأثيرات hover متقدمة
            ═══════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const IconComponent = faq.icon;
            return (
              <motion.div 
                key={index} 
                className="group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                {/* زر السؤال */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full relative bg-white/5 backdrop-blur-md hover:shadow-2xl transition-all duration-300 rounded-lg p-6 flex items-center justify-between border border-purple-500/20 hover:border-purple-400/50 shadow-lg hover:shadow-purple-900/60 overflow-hidden"
                >
                  {/* ═══════════════════════════════════════════════════
                      ANIMATED RAIN EFFECT - تأثير المطر المتحرك
                      نقاط متحركة تظهر عند hover
                      ═══════════════════════════════════════════════════ */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-[10%] left-[15%] w-2 h-2 bg-purple-400/70 rounded-full animate-ping"></div>
                    <div className="absolute top-[25%] right-[20%] w-2 h-2 bg-purple-400/60 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute top-[40%] left-[40%] w-2 h-2 bg-violet-500/65 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                    <div className="absolute top-[55%] right-[15%] w-2 h-2 bg-purple-400/70 rounded-full animate-ping" style={{animationDelay: '0.9s'}}></div>
                    <div className="absolute top-[70%] left-[25%] w-2 h-2 bg-purple-400/60 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
                    <div className="absolute top-[15%] left-[60%] w-1.5 h-1.5 bg-purple-400/75 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute top-[60%] right-[40%] w-1.5 h-1.5 bg-violet-400/70 rounded-full animate-ping" style={{animationDelay: '0.8s'}}></div>
                    <div className="absolute top-[35%] right-[10%] w-1.5 h-1.5 bg-purple-400/65 rounded-full animate-ping" style={{animationDelay: '1.1s'}}></div>
                    <div className="absolute top-[80%] left-[50%] w-1 h-1 bg-violet-500/70 rounded-full animate-ping" style={{animationDelay: '1.4s'}}></div>
                    <div className="absolute top-[50%] left-[10%] w-1 h-1 bg-purple-400/75 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  </div>

                  {/* محتوى السؤال مع الأيقونة */}
                  <div className="flex items-center gap-4 flex-1 relative z-10">
                    <IconComponent
                      size={28}
                      className="text-purple-400 flex-shrink-0 group-hover:scale-110 group-hover:text-purple-300 transition-all duration-300"
                    />
                    <span className="text-white font-semibold text-lg group-hover:text-purple-200 transition-colors text-left">
                      {faq.question}
                    </span>
                  </div>
                  
                  {/* أيقونة السهم الدوار */}
                  <ChevronDown
                    size={24}
                    className={`text-purple-400 flex-shrink-0 ml-4 transition-transform duration-500 relative z-10 group-hover:text-purple-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* ═══════════════════════════════════════════════════
                    ANSWER PANEL - لوحة الإجابة
                    تنزلق للأسفل عند فتح السؤال
                    ═══════════════════════════════════════════════════ */}
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/5 backdrop-blur-md border border-purple-500/20 border-t-0 rounded-b-lg p-6 text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER CTA SECTION - قسم الدعوة لاتخاذ إجراء
          زر الاتصال بالفريق مع تأثيرات تفاعلية
          ═══════════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto text-center mt-16 pt-12 border-t border-purple-500/20 relative z-10">
        <p className="text-gray-400 mb-6">
          Didn't find the answer you're looking for?
        </p>
        <Link to="/#contact">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 relative overflow-hidden group"
          >
            <span className="relative z-10">Contact Our Team</span>
            {/* تأثير اللمعان عند hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </motion.button>
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING DECORATIVE ELEMENTS - العناصر الزخرفية الطافية
          دوائر متوهجة ونقاط متحركة في أنحاء الصفحة
          ═══════════════════════════════════════════════════════════ */}
      {/* دوائر التوهج الثابتة */}
      <div className="fixed top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '0.5s'}}></div>
      
      {/* نقاط متحركة مضيئة */}
      <div className="absolute top-1/2 right-10 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.7s'}}></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-violet-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1.4s'}}></div>
    </div>
  );
}