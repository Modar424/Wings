import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Newspaper, 
  AlertTriangle, 
  Zap, 
  Tag, 
  Search, 
  Clock, 
  ChevronRight, 
  Share2,
  ArrowLeft,
  ChevronUp,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  X // أيقونة الإغلاق
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// ANNOUNCEMENT TYPES CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const ANNOUNCEMENT_TYPES = {
  notification: {
    label: 'Notification',
    color: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    icon: <Bell className="w-4 h-4" />,
  },
  news: {
    label: 'News',
    color: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    icon: <Newspaper className="w-4 h-4" />,
  },
  'breaking news': {
    label: 'Breaking News',
    color: 'border-red-600/50 bg-red-600/20 text-red-400 animate-pulse',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  ads: {
    label: 'Promotion',
    color: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    icon: <Zap className="w-4 h-4" />,
  },
  discount: {
    label: 'Discount',
    color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
    icon: <Tag className="w-4 h-4" />,
  }
};

const Blog = () => {
  const [filter, setFilter] = useState('all');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [expandedIds, setExpandedIds] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  const containerRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const mockData = [
          {
            id: 1,
            type: 'news',
            title: 'New Destination Alert',
            summary: 'A new journey has been added to our list, go check it out!',
            details: 'A new journey has been added to our list: Istanbul, Turkey. A perfect place for tourism as it bridges East and West. Go check it out now and book your seat!',
            date: '2m ago',
            image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=1000'
          },
          {
            id: 2,
            type: 'breaking news',
            title: 'Terminal Update',
            summary: 'Please review the new boarding gates at Dubai Airport.',
            details: 'Due to unexpected maintenance in Terminal 2, all international flights have been moved to Terminal 3. Please arrive 4 hours before your flight time to avoid delays.',
            date: '5m ago',
          },
          {
            id: 3,
            type: 'discount',
            title: 'Summer Flash Sale',
            summary: 'Get up to 40% off on all European flights this summer.',
            details: 'Our annual summer sale is here! Book your tickets between June and August to enjoy massive discounts on all routes to Europe, including London, Paris, and Rome.',
            date: '1h ago',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=1000'
          },
          {
            id: 4,
            type: 'ads',
            title: 'Premium Lounge Access',
            summary: 'Experience luxury with our new Platinum Lounge.',
            details: 'We are excited to announce the opening of our Platinum Lounge in Terminal 1. Features include private sleeping pods, gourmet dining, and spa services.',
            date: '3h ago'
          },
          {
            id: 5,
            type: 'notification',
            title: 'System Maintenance',
            summary: 'Brief maintenance on our mobile app tonight.',
            details: 'Our mobile application will undergo scheduled maintenance tonight from 2:00 AM to 4:00 AM UTC. Online booking may be temporarily unavailable.',
            date: '5h ago'
          }
        ];

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnnouncements(mockData);
      } catch (err) {
        console.error("Error in fetchAnnouncements:", err);
        setError(err.message || "Failed to load broadcast data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // إغلاق المودال عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowShareModal(false);
      }
    };

    if (showShareModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareModal]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleShare = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowShareModal(true);
  };

  // دالة المشاركة عبر وسائل التواصل الاجتماعي
  const shareToSocial = (platform) => {
    if (!selectedAnnouncement) return;

    const url = window.location.href;
    const title = encodeURIComponent(selectedAnnouncement.title);
    const summary = encodeURIComponent(selectedAnnouncement.summary);
    const hashtags = encodeURIComponent('travel,announcement,wingsglobal');

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${title}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=${summary}%0A%0A${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const filteredData = filter === 'all' 
    ? announcements 
    : announcements.filter(item => item.type === filter);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-violet-900 to-slate-950 text-white selection:bg-purple-500/30 relative overflow-hidden"
    >
      {/* مودال المشاركة - بدون خيار نسخ الرابط */}
      <AnimatePresence>
        {showShareModal && selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-purple-900/90 to-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  Share Announcement
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-400 mb-6 text-sm text-center">
                Share Our Latest Announcements with your friends
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="p-4 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                >
                  <Facebook className="w-8 h-8 text-[#1877F2]" />
                  <span className="text-xs font-bold text-gray-300">Facebook</span>
                </button>

                <button
                  onClick={() => shareToSocial('twitter')}
                  className="p-4 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                >
                  <Twitter className="w-8 h-8 text-[#1877F2]" />
                  <span className="text-xs font-bold text-gray-300">Twitter</span>
                </button>

                <button
                  onClick={() => shareToSocial('linkedin')}
                  className="p-4 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                >
                  <Linkedin className="w-8 h-8 text-[#1877F2]" />
                  <span className="text-xs font-bold text-gray-300">LinkedIn</span>
                </button>

                <button
                  onClick={() => shareToSocial('email')}
                  className="p-4 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                >
                  <Mail className="w-8 h-8 text-[#1877F2]" />
                  <span className="text-xs font-bold text-gray-300">Email</span>
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-6">
                Choose your preferred social platform to share
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = '/'}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs md:text-sm font-medium hover:bg-white/20 transition-all group"
      >
        <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </motion.button>

      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-black to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black bg-gradient-to-r from-white via-purple-400 to-violet-600 bg-clip-text text-transparent mb-6 drop-shadow-2xl"
          >
            Announcement Center
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Stay synchronized with the latest travel intelligence and exclusive corporate updates.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16 overflow-x-auto pb-4 no-scrollbar">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${filter === 'all' ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-600/40 scale-105' : 'bg-white/5 text-gray-400 border-white/10 hover:border-purple-500/50 hover:bg-white/10'}`}
          >
            All Broadcasts
          </button>
          {Object.entries(ANNOUNCEMENT_TYPES).map(([key, value]) => (
            <button 
              key={key}
              onClick={() => setFilter(key)}
              className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all duration-300 border ${filter === key ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-600/40 scale-105' : 'bg-white/5 text-gray-400 border-white/10 hover:border-purple-500/50 hover:bg-white/10'}`}
            >
              {value.icon}
              {value.label}
            </button>
          ))}
        </div>

        {/* إضافة عرض الخطأ هنا */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-red-500/20 border border-red-500/50 rounded-[2rem] text-red-400 text-center backdrop-blur-md"
          >
            <AlertTriangle className="w-10 h-10 mx-auto mb-3" />
            <p className="font-bold text-lg mb-3">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500/30 rounded-xl text-sm font-bold hover:bg-red-500/50 transition-colors border border-red-500/30"
            >
              Try Again
            </button>
          </motion.div>
        )}

        <div className="grid gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 animate-pulse">
                  <div className="h-6 bg-white/10 rounded-full w-1/4 mb-6"></div>
                  <div className="h-4 bg-white/10 rounded-full w-full mb-3"></div>
                </div>
              ))
            ) : !error && filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const isExpanded = expandedIds.includes(item.id);
                const typeInfo = ANNOUNCEMENT_TYPES[item.type] || ANNOUNCEMENT_TYPES.news;

                return (
                  <motion.article 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-purple-400/50 hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.2)] shadow-2xl`}
                  >
                    <div className="p-8 relative z-10">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 shadow-sm ${typeInfo.color}`}>
                            {typeInfo.icon}
                            {typeInfo.label}
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[10px] uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            {item.date}
                          </div>
                        </div>
                        {/* زر المشاركة */}
                        <button 
                          onClick={() => handleShare(item)}
                          className="text-purple-500/40 hover:text-purple-400 transition-all p-2 hover:bg-purple-500/10 rounded-xl relative group/share"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/share:opacity-100 transition-opacity whitespace-nowrap">
                            Share
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors">
                            {item.title}
                          </h3>
                          
                          <motion.div
                            layout
                            initial={false}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-400 text-lg leading-relaxed font-medium transition-all duration-500">
                              {isExpanded ? item.details : item.summary}
                            </p>
                          </motion.div>
                        </div>

                        {item.image && (
                          <div className="md:w-64 h-40 rounded-[1.5rem] overflow-hidden relative group/img border border-white/10 shrink-0">
                            <img src={item.image} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                          </div>
                        )}
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verified Broadcast</span>
                        </div>
                        
                        <button 
                          onClick={() => toggleExpand(item.id)}
                          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 group/btn shadow-lg ${
                            isExpanded 
                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                            : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-purple-900/20'
                          }`}
                        >
                          {isExpanded ? (
                            <>
                              Show Less <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              View Details <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            ) : !error && (
              <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                <Search className="w-12 h-12 text-purple-500/20 mx-auto mb-4" />
                <h3 className="text-gray-400 font-bold">No Records Found</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-16 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Wings Global Systems &copy; 2024</p>
      </footer>
    </div>
  );
};

export default Blog;