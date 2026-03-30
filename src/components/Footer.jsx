import { Plane, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  // ==================== المتغيرات ====================
  const currentYear = new Date().getFullYear();

  // ==================== بيانات روابط الأقسام المختلفة ====================
  
  // روابط قسم الشركة
  const companyLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press Room', href: '#' },
    { name: 'Investor Relations', href: '#' },
    { name: 'Partnerships', href: '#' }
  ];

  // روابط قسم الخدمات
  const servicesLinks = [
    { name: 'Book Flight', href: '#' },
    { name: 'Manage Booking', href: '#' },
    { name: 'Flight Status', href: '#' },
    { name: 'Check-in Online', href: '#' },
    { name: 'Special Assistance', href: '#' }
  ];

  // روابط معلومات السفر
  const travelInfoLinks = [
    { name: 'Baggage Information', href: '#' },
    { name: 'Travel Requirements', href: '#' },
    { name: 'Visa Information', href: '#' },
    { name: 'Airport Information', href: '#' },
    { name: 'Travel Insurance', href: '#' }
  ];

  // روابط قسم الدعم
  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'FAQs', href: '#' },
    { name: 'Refund Policy', href: '#' },
    { name: 'Terms & Conditions', href: '#' }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 text-white">
      
      {/* ==================== المحتوى الرئيسي للفوتر ==================== */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* ==================== قسم العلامة التجارية ==================== */}
          <div className="lg:col-span-1">
            {/* الشعار والاسم */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">Wings</span>
            </div>
            
            {/* النص الوصفي */}
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Your trusted airline partner for comfortable and safe journeys around the world. Fly with confidence.
            </p>
            
            {/* أيقونات وسائل التواصل الاجتماعي */}
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <FaFacebook size={18} />
              </a>
              <a 
                href="https://www.twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* ==================== روابط الشركة ==================== */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ==================== روابط الخدمات ==================== */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {servicesLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ==================== روابط معلومات السفر ==================== */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Travel Info</h3>
            <ul className="space-y-2">
              {travelInfoLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ==================== روابط الدعم ==================== */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 mb-6">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ==================== شريط معلومات الاتصال ==================== */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* الهاتف */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Call Us 24/7</p>
                <p className="text-white font-semibold">+1 (800) 123-4567</p>
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Email Support</p>
                <p className="text-white font-semibold">support@wings.com</p>
              </div>
            </div>

            {/* الموقع */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Head Office</p>
                <p className="text-white font-semibold">New York, NY 10001</p>
              </div>
            </div>

            {/* التوفر */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Available</p>
                <p className="text-white font-semibold">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== الشريط السفلي (حقوق النشر والسياسات) ==================== */}
      <div className="bg-black/30 border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* حقوق النشر */}
            <p className="text-gray-400 text-sm">
              © {currentYear} Wings Airlines. All rights reserved.
            </p>
            
            {/* روابط السياسات */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;