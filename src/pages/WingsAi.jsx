import React, { useState, useRef, useEffect } from 'react';
import { Send, Plane, Sparkles, MapPin, DollarSign, PieChart, TrendingUp, Cloud, Mic, MicOff, Volume2, VolumeX, Menu, X, Plus, Calendar, Star, Users, Clock, ExternalLink, Search, Globe, MessageCircle, Trash2, GitCompare, Heart, ThumbsUp, ThumbsDown, Zap, Moon, Sun,ArrowLeft } from 'lucide-react';

const WingsAi = () => {
  // ==========================================
  // STATE MANAGEMENT - EVENTS UPDATED
  // إدارة الحالات - الأحداث محدثة
  // ==========================================
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: `👋 Welcome to Wings Ai!\n\nI'm your intelligent travel assistant, and I'm thrilled to help you explore the world! 🌍✨\n\nHere's what I can do for you:\n\n🎯 **Attractions** - Discover must-see locations\n🍽️ **Restaurants** - Find amazing dining experiences\n🏨 **Hotels** - Explore accommodations with prices\n🌤️ **Weather** - Get climate information\n💰 **Budget Planning** - Create detailed travel budgets\n🎤 **Voice Interaction** - Use voice commands\n🎉 **Events** - Browse local events and activities\n⚡ **Destination Comparison** - Compare multiple cities\n🤖 **Smart Recommendations** - Personalized suggestions\n\n**Ready to start?** Just tell me which city interests you, or use voice input! 🚀\n\nWhich destination shall we explore together?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [budget, setBudget] = useState('');
  const [avatarMood, setAvatarMood] = useState('friendly');
  
  // ==========================================
  // THEME STATE - NEW
  // حالة الثيم - جديد
  // ==========================================
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('wingsAi_darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  // ==========================================
  // VOICE FEATURE STATES
  // حالات ميزة الصوت
  // ==========================================
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [transcript, setTranscript] = useState('');

  // ==========================================
  // EVENTS STATE - UPDATED FOR HYBRID SYSTEM
  // حالات الأحداث - محدثة للنظام الهجين
  // ==========================================
  const [_events, setEvents] = useState([]);
  const [_eventsLoading, setEventsLoading] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);

  // ==========================================
  // SIDEBAR STATE
  // حالة الشريط الجانبي
  // ==========================================
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================================
  // CHAT HISTORY STATE - الجديد
  // حالة سجل المحادثات
  // ==========================================
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // ==========================================
  // COMPARISON FEATURE STATE - الجديد
  // حالة ميزة المقارنة
  // ==========================================
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonCities, setComparisonCities] = useState([]);

  // ==========================================
  // SMART RECOMMENDATIONS STATE - الجديد
  // حالة التوصيات الذكية
  // ==========================================
  const [userPreferences, setUserPreferences] = useState(() => {
    const saved = localStorage.getItem('wingsAi_userPreferences');
    return saved ? JSON.parse(saved) : {
      preferredDestinations: [],
      budgetRange: { min: 0, max: 5000 },
      travelStyle: 'balanced', // balanced, luxury, budget, adventure, cultural
      interests: [],
      activityRatings: {},
      dislikedDestinations: [],
      travelHistory: [],
      responseFeedback: {}
    };
  });

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [smartRecommendations, setSmartRecommendations] = useState([]);

  // ==========================================
  // REFS
  // المراجع
  // ==========================================
  const messagesEndRef = useRef(null);

  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // ==========================================
  // THEME MANAGEMENT - NEW
  // إدارة الثيم - جديد
  // ==========================================
  useEffect(() => {
    localStorage.setItem('wingsAi_darkMode', JSON.stringify(darkMode));
    
    // تحديث فئة HTML لتطبيق الثيم
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // ==========================================
  // THEME STYLES - NEW
  // أنماط الثيم - جديد
  // ==========================================
  const themeStyles = {
    dark: {
      background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800',
      sidebar: 'bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800',
      card: 'bg-gray-800/50 border-gray-700/50',
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        tertiary: 'text-gray-400',
        accent: 'text-purple-300'
      },
      button: {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white',
        secondary: 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300',
        danger: 'bg-red-600 hover:bg-red-500 text-white'
      },
      input: 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500'
    },
    light: {
      background: 'bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100',
      sidebar: 'bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100',
      card: 'bg-white/80 border-gray-200/50',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        tertiary: 'text-gray-500',
        accent: 'text-purple-600'
      },
      button: {
        primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white',
        secondary: 'bg-gray-200/50 hover:bg-gray-300/50 text-gray-700',
        danger: 'bg-red-500 hover:bg-red-400 text-white'
      },
      input: 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-400'
    }
  };

  const currentTheme = darkMode ? themeStyles.dark : themeStyles.light;

  // ==========================================
  // RESPONSIVE HANDLING
  // التعامل مع التجاوب
  // ==========================================
  const [_isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // ==========================================
  // SMART RECOMMENDATIONS SYSTEM - الجديد
  // نظام التوصيات الذكية
  // ==========================================

  // حفظ التفضيلات في localStorage
  useEffect(() => {
    localStorage.setItem('wingsAi_userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // تحديث التفضيلات بناءً على تفاعل المستخدم
  const updateUserPreferences = (interaction) => {
    setUserPreferences(prev => {
      let updated = { ...prev };
      
      switch (interaction.type) {
        case 'DESTINATION_SELECTION':
          if (!updated.preferredDestinations.includes(interaction.data)) {
            updated.preferredDestinations = [...updated.preferredDestinations, interaction.data].slice(-10);
          }
          updated.travelHistory = [...updated.travelHistory, {
            destination: interaction.data,
            timestamp: new Date().toISOString(),
            type: 'searched'
          }].slice(-20);
          break;
          
        case 'BUDGET_SETTING':
          updated.budgetRange = interaction.data;
          break;
          
        case 'ACTIVITY_RATING':
          updated.activityRatings = {
            ...updated.activityRatings,
            [interaction.data.activity]: interaction.data.rating
          };
          break;
          
        case 'TRAVEL_STYLE':
          updated.travelStyle = interaction.data;
          break;
          
        case 'INTEREST_ADDED':
          if (!updated.interests.includes(interaction.data)) {
            updated.interests = [...updated.interests, interaction.data].slice(-15);
          }
          break;
          
        case 'DISLIKE_DESTINATION':
          if (!updated.dislikedDestinations.includes(interaction.data)) {
            updated.dislikedDestinations = [...updated.dislikedDestinations, interaction.data];
          }
          break;
          
        case 'RESPONSE_FEEDBACK':
          updated.responseFeedback = {
            ...updated.responseFeedback,
            [interaction.data.messageId]: interaction.data.feedback
          };
          break;
          
        default:
          break;
      }
      
      return updated;
    });
  };

  // ==========================================
  // INTERACTIVE & FRIENDLY RESPONSES
  // ردود تفاعلية وودية - إضافة جديدة
  // ==========================================

  // الحصول على تحية شخصية بناءً على الوقت والمحادثات السابقة
  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const _chatCount = chatHistory.length;
    const _prevChatMessages = messages.length;

    // نصائح شخصية بناءً على النشاط السابق
    if (chatHistory.filter(c => c.title?.includes('Dubai')).length > 0) {
      return `Welcome back! Ready for another adventure? ✨`;
    }

    if (hour < 12) {
      return `Good morning! Ready to explore the world? 🌅`;
    } else if (hour < 17) {
      return `Afternoon adventures await! Let's plan something amazing 🌞`;
    } else {
      return `Good evening! Time to dream about your next trip 🌙`;
    }
  };

  // رسائل تشجيعية عند بدء المحادثة
  const _getEncouragingMessage = () => {
    const messages = [
      '✨ Great choice! Let me gather all the info for you...',
      '🎯 Ooh, that\'s a fantastic destination! Let me prepare the details...',
      '🌟 Interesting pick! I\'m gathering the best recommendations...',
      '🚀 You\'ve got great taste! Finding the perfect info for you...',
      '💫 Awesome! Let me show you why this place is special...'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // رسائل ودية عند عدم فهم الطلب
  const getFriendlyErrorMessage = () => {
    const messages = [
      `Hmm, I couldn't quite catch that city! 🤔 But don't worry, I know about these amazing places:`,
      `Oops! That destination isn't in my knowledge base yet 😅 But try these beauties instead:`,
      `I wish I knew about that place! 🌍 How about exploring one of these instead:`,
      `That's a fascinating destination, but I don't have info on it yet 🔍 Try these instead:`,
      `I'm still learning! 📚 But these cities are my specialty:`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // تحديث mood الـ avatar بناءً على نوع الرسالة
  const updateAvatarMoodByAction = (action) => {
    const moods = {
      'excited': () => setAvatarMood('excited'),
      'listening': () => setAvatarMood('listening'),
      'happy': () => setAvatarMood('happy'),
      'helping': () => setAvatarMood('thinking'),
      'celebrating': () => setAvatarMood('excited')
    };
    moods[action]?.();
  };

  // رسالة ودية عند الضغط على زر New Chat
  const _getNewChatMessage = () => {
    const messages = [
      '🎉 Fresh start! What new adventure shall we plan?',
      '✨ New chat, new possibilities! Where would you like to go?',
      '🚀 Let\'s discover somewhere new! What\'s your destination?',
      '🌟 Ready for a fresh journey? Tell me your next destination!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // رسائل تفاعلية شاملة للمحادثة الطبيعية
  const getContextualResponse = (input) => {
    const lowerInput = input.toLowerCase().trim();
    
    // 1️⃣ التحيات والمجاملات فقط - لا تعطي معلومات
    if (/^(hi|hello|hey|greetings|sup|what's up|howdy|hey there|hiya|heya)[\s!]*$/.test(lowerInput)) {
      const greetings = [
        { emoji: '👋', message: 'Hello! Great to see you! Ready to explore some amazing destinations? 🌍' },
        { emoji: '😊', message: 'Hey there! What an exciting day to plan your next adventure!' },
        { emoji: '✨', message: 'Hi! Welcome back! Let\'s find your dream destination! 🚀' },
        { emoji: '🌟', message: 'Hello my friend! So glad you\'re here. What destination calls to you?' },
        { emoji: '😄', message: 'Hey! Perfect timing! I\'m ready to help you discover somewhere amazing! ✈️' },
        { emoji: '🎉', message: 'Hi there! Great to see you again! Ready for your next adventure?' },
        { emoji: '💫', message: 'Hello! The world is waiting for you. Which place should we explore? 🗺️' }
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // 2️⃣ الأسئلة الشخصية عن البوت فقط
    if (lowerInput.includes('how are you') || lowerInput.includes('how\'re you') || 
        lowerInput.includes('how u doing') || lowerInput.includes('are you doing') ||
        lowerInput.includes('you okay') || lowerInput.includes('feeling good')) {
      const personalResponses = [
        { emoji: '😊', message: 'I\'m doing amazing! There\'s nothing better than helping people discover their dream destinations. How about you? Ready for an adventure? 🚀' },
        { emoji: '💫', message: 'I\'m wonderful, thank you for asking! Honestly, I\'m always excited when I get to help someone plan their next trip. Let\'s do this! 🌍' },
        { emoji: '🌟', message: 'I\'m fantastic! And you know why? Because I get to help you explore the world! So, what destination shall we dive into today?' },
        { emoji: '❤️', message: 'I\'m loving this! My day is always better when I\'m helping people find their perfect getaway. So tell me, where do you want to go? ✈️' },
        { emoji: '🎉', message: 'I\'m absolutely thrilled! There\'s nothing I love more than the joy of travel planning! Ready to explore something amazing with me? 🌟' }
      ];
      return personalResponses[Math.floor(Math.random() * personalResponses.length)];
    }

    // 3️⃣ الشكر والامتنان فقط
    if (lowerInput.includes('thank') || lowerInput.includes('thanks') || lowerInput.includes('appreciate') ||
        lowerInput.includes('grateful') || lowerInput.includes('awesome job')) {
      const thankYouResponses = [
        { emoji: '😊', message: 'Aw, that\'s so sweet! I\'m here to help you discover the world. Keep dreaming big! 🌍✨' },
        { emoji: '💚', message: 'Of course! That\'s what I love doing! Now go plan that amazing trip and create unforgettable memories! 🚀' },
        { emoji: '🙌', message: 'You\'re very welcome! Making your travel dreams come true is what I live for! Enjoy your journey! 🌟' },
        { emoji: '😄', message: 'Happy to help! Remember, adventure awaits at every corner. Go out there and explore! 🗺️' },
        { emoji: '💖', message: 'It\'s my pleasure! Your happiness is my happiness! Now let\'s make your travel dreams a reality! 🌈' }
      ];
      return thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)];
    }

    // 4️⃣ طلب المساعدة العام فقط - بدون سياق محدد
    if ((lowerInput === 'help' || lowerInput === 'help me' || lowerInput === 'guide me') && !lowerInput.includes('about')) {
      const helpResponses = [
        { emoji: '🤝', message: 'I\'ve got you covered! I\'m here to guide you through everything. Just tell me which city excites you most! 🌟' },
        { emoji: '💡', message: 'Absolutely! I\'m your personal travel expert. Just tell me which destination interests you! 🌍' },
        { emoji: '✨', message: 'I\'m here to help! Tell me which city you\'d like to explore, and I\'ll provide all the details! 🚀' }
      ];
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }

    // 5️⃣ الكلمات الإيجابية البحتة فقط - بدون التحدث عن مكان محدد
    if ((lowerInput === 'beautiful' || lowerInput === 'amazing' || lowerInput === 'awesome' || 
         lowerInput === 'wonderful' || lowerInput === 'fantastic' || lowerInput === 'love' ||
         lowerInput === 'incredible' || lowerInput === 'excellent' || lowerInput === 'brilliant' ||
         lowerInput === 'great' || lowerInput === 'nice') && 
        !lowerInput.includes('place') && !lowerInput.includes('city') && !lowerInput.includes('destination')) {
      const positiveResponses = [
        { emoji: '💫', message: 'YES! I LOVE your enthusiasm! Let\'s channel that excitement into finding your perfect destination! 🎉' },
        { emoji: '🔥', message: 'Right?! The world IS amazing! And I\'m thrilled to help you explore it. Which place should we learn about? 🌍' },
        { emoji: '❤️', message: 'I absolutely agree! Your positive energy is contagious! Now let\'s use it to plan an unforgettable trip! ✈️' },
        { emoji: '🌟', message: 'Oh, you get it! This is the energy I love! Let\'s find that perfect destination that matches your amazing outlook! 🚀' }
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    }

    // 6️⃣ أسئلة الهوية عن البوت
    if (lowerInput.includes('what do you do') || lowerInput.includes('who are you') || lowerInput.includes('what are you') ||
        lowerInput.includes('tell me about yourself') || lowerInput.includes('introduce yourself')) {
      const whoAmIResponses = [
        { emoji: '🤖', message: 'I\'m Wings AI, your intelligent travel companion! I\'m here to make your travel dreams a reality with all the info you need! 🌍✨' },
        { emoji: '✈️', message: 'I\'m your personal travel assistant! I know everything about amazing destinations, and I\'m passionate about helping you explore the world! 🗺️' },
        { emoji: '🌟', message: 'I\'m Wings AI - part tour guide, part budget planner, part voice assistant! Basically, I\'m your new best travel buddy! 😄' },
        { emoji: '💚', message: 'I\'m Wings, your travel soul mate! I\'m obsessed with helping people discover amazing places and creating unforgettable memories! 🌈' }
      ];
      return whoAmIResponses[Math.floor(Math.random() * whoAmIResponses.length)];
    }

    // ❌ لا نعطي رسائل ودية للأسئلة التي تحتاج معلومات محددة عن:
    // - الرحلات والسفر (trip, travel, journey, tour)
    // - الطعام والمطاعم (food, restaurant, cuisine)
    // - الفنادق والإقامة (hotel, accommodation)
    // - السعر والميزانية (price, cost, budget)
    // - الأنشطة والعروض (activity, things to do)
    // - آراء البوت في المدن (what do you think about)

    return null;
  };

  // رسائل تفاعلية عند الإجابة على أسئلة شائعة
  const getSmartResponse = (input) => {
    // First try contextual response for better matches
    const contextual = getContextualResponse(input);
    if (contextual) return contextual;

    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
      return {
        emoji: '😊',
        message: 'Happy to help! Keep dreaming about those adventures!'
      };
    }
    if (lowerInput.includes('help') || lowerInput.includes('how')) {
      return {
        emoji: '🤝',
        message: 'I\'m here to help! Just tell me which city interests you.'
      };
    }
    if (lowerInput.includes('beautiful') || lowerInput.includes('amazing')) {
      return {
        emoji: '✨',
        message: 'I love your enthusiasm! Let\'s explore it together!'
      };
    }
    return null;
  };

  // ========================
  // توليد توصيات ذكية مخصصة
  // ========================
  const generateSmartRecommendations = () => {
    const recommendations = [];
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    
    // تحليل التفضيلات
    const { preferredDestinations, budgetRange, travelStyle, interests, _activityRatings, dislikedDestinations } = userPreferences;
    
    // تصفية المدن المكروهة
    const availableDestinations = Object.keys(destinations).filter(
      city => !dislikedDestinations.includes(city)
    );
    
    // توصيات بناءً على الموسم
    const seasonalDestinations = availableDestinations.filter(city => {
      const bestTime = destinations[city].bestTime.toLowerCase();
      if (bestTime.includes('november') && bestTime.includes('march') && (currentMonth >= 11 || currentMonth <= 3)) {
        return true; // شتاء
      }
      if (bestTime.includes('april') && bestTime.includes('june') && currentMonth >= 4 && currentMonth <= 6) {
        return true; // ربيع
      }
      if (bestTime.includes('september') && bestTime.includes('october') && currentMonth >= 9 && currentMonth <= 10) {
        return true; // خريف
      }
      if (bestTime.includes('may') && bestTime.includes('september') && currentMonth >= 5 && currentMonth <= 9) {
        return true; // صيف
      }
      return false;
    });
    
    // توصيات بناءً على نمط السفر
    const styleBasedDestinations = availableDestinations.filter(city => {
      const avgHotelPrice = destinations[city].hotels.reduce((sum, hotel) => {
        const price = parseInt(hotel.price.replace(/[^0-9]/g, '')) || 0;
        return sum + price;
      }, 0) / destinations[city].hotels.length;
      
      switch (travelStyle) {
        case 'budget':
          return avgHotelPrice < 200;
        case 'balanced':
          return avgHotelPrice >= 200 && avgHotelPrice < 500;
        case 'luxury':
          return avgHotelPrice >= 500;
        case 'adventure':
          return destinations[city].attractions.some(attr => 
            attr.description.toLowerCase().includes('adventure') || 
            attr.description.toLowerCase().includes('desert') ||
            attr.description.toLowerCase().includes('mountain')
          );
        case 'cultural':
          return destinations[city].attractions.some(attr => 
            attr.description.toLowerCase().includes('historic') || 
            attr.description.toLowerCase().includes('cultural') ||
            attr.description.toLowerCase().includes('museum') ||
            attr.description.toLowerCase().includes('temple') ||
            attr.description.toLowerCase().includes('mosque')
          );
        default:
          return true;
      }
    });
    
    // توصيات بناءً على الاهتمامات
    const interestBasedDestinations = availableDestinations.filter(city => {
      if (interests.length === 0) return true;
      
      return interests.some(interest => {
        const cityData = destinations[city];
        return (
          cityData.attractions.some(attr => 
            attr.description.toLowerCase().includes(interest) ||
            attr.name.toLowerCase().includes(interest)
          ) ||
          cityData.restaurants.some(rest => 
            rest.cuisine.toLowerCase().includes(interest)
          )
        );
      });
    });
    
    // دمج التوصيات مع الأوزان
    const destinationScores = {};
    
    availableDestinations.forEach(city => {
      let score = 0;
      
      // نقاط للموسم
      if (seasonalDestinations.includes(city)) score += 3;
      
      // نقاط لنمط السفر
      if (styleBasedDestinations.includes(city)) score += 2;
      
      // نقاط للاهتمامات
      if (interestBasedDestinations.includes(city)) score += interests.length;
      
      // نقاط للمدن المفضلة سابقاً
      if (preferredDestinations.includes(city)) score += 4;
      
      // نقاط بناءً على الميزانية
      const avgPrice = destinations[city].hotels.reduce((sum, hotel) => {
        const price = parseInt(hotel.price.replace(/[^0-9]/g, '')) || 0;
        return sum + price;
      }, 0) / destinations[city].hotels.length;
      
      if (avgPrice >= budgetRange.min && avgPrice <= budgetRange.max) {
        score += 2;
      }
      
      destinationScores[city] = score;
    });
    
    // ترتيب التوصيات
    const sortedDestinations = Object.entries(destinationScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city]) => city);
    
    // بناء التوصيات
    if (sortedDestinations.length > 0) {
      recommendations.push({
        type: 'personalized_destinations',
        title: '🌍 Personalized Destinations For You',
        destinations: sortedDestinations.map(city => ({
          name: city.charAt(0).toUpperCase() + city.slice(1),
          reason: getRecommendationReason(city, userPreferences),
          matchScore: destinationScores[city],
          data: destinations[city]
        })),
        priority: 'high'
      });
    }
    
    // توصيات الأنشطة بناءً على التقييمات السابقة
    const activityRecommendations = generateActivityRecommendations();
    if (activityRecommendations.length > 0) {
      recommendations.push({
        type: 'activities',
        title: '🎯 Activities You Might Love',
        activities: activityRecommendations,
        priority: 'medium'
      });
    }
    
    // توصيات المطاعم
    const restaurantRecommendations = generateRestaurantRecommendations();
    if (restaurantRecommendations.length > 0) {
      recommendations.push({
        type: 'restaurants',
        title: '🍽️ Dining Recommendations',
        restaurants: restaurantRecommendations,
        priority: 'medium'
      });
    }
    
    // توصيات بناءً على الوقت من السنة
    const seasonalRecommendation = generateSeasonalRecommendation();
    if (seasonalRecommendation) {
      recommendations.push(seasonalRecommendation);
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  // توليد سبب التوصية
  const getRecommendationReason = (city, preferences) => {
    const reasons = [];
    const cityData = destinations[city];
    
    if (preferences.preferredDestinations.includes(city)) {
      reasons.push('You\'ve shown interest in this destination before');
    }
    
    if (preferences.travelStyle === 'cultural' && cityData.attractions.some(attr => 
      attr.description.toLowerCase().includes('historic') || 
      attr.description.toLowerCase().includes('cultural')
    )) {
      reasons.push('Rich cultural and historical attractions');
    }
    
    if (preferences.travelStyle === 'adventure' && cityData.attractions.some(attr => 
      attr.description.toLowerCase().includes('adventure') || 
      attr.description.toLowerCase().includes('desert')
    )) {
      reasons.push('Perfect for adventure seekers');
    }
    
    if (preferences.interests.some(interest => 
      cityData.restaurants.some(rest => rest.cuisine.toLowerCase().includes(interest))
    )) {
      reasons.push('Matches your culinary interests');
    }
    
    // تحقق من الموسم
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const bestTime = cityData.bestTime.toLowerCase();
    
    if ((bestTime.includes('november') && bestTime.includes('march') && (currentMonth >= 11 || currentMonth <= 3)) ||
        (bestTime.includes('april') && bestTime.includes('june') && currentMonth >= 4 && currentMonth <= 6) ||
        (bestTime.includes('september') && bestTime.includes('october') && currentMonth >= 9 && currentMonth <= 10)) {
      reasons.push('Perfect weather season right now');
    }
    
    return reasons.length > 0 ? reasons[0] : 'Great destination matching your travel preferences';
  };

  // توليد توصيات الأنشطة
  const generateActivityRecommendations = () => {
    const { activityRatings, interests } = userPreferences;
    const highlyRatedActivities = Object.entries(activityRatings)
      .filter(([, rating]) => rating > 3)
      .map(([activity]) => activity);
    
    const recommendations = [];
    
    // البحث عن أنشطة مشابهة للأنشطة التي أعجبت المستخدم
    Object.keys(destinations).forEach(city => {
      destinations[city].attractions.forEach(attraction => {
        const attractionName = attraction.name.toLowerCase();
        const attractionDesc = attraction.description.toLowerCase();
        
        // البحث عن تطابقات مع الأنشطة المحببة
        highlyRatedActivities.forEach(likedActivity => {
          if (attractionDesc.includes(likedActivity.toLowerCase()) || 
              attractionName.includes(likedActivity.toLowerCase())) {
            recommendations.push({
              city: city.charAt(0).toUpperCase() + city.slice(1),
              activity: attraction.name,
              description: attraction.description,
              rating: attraction.rating,
              reason: `Similar to activities you've enjoyed`
            });
          }
        });
        
        // البحث عن تطابقات مع الاهتمامات
        interests.forEach(interest => {
          if (attractionDesc.includes(interest.toLowerCase()) || 
              attractionName.includes(interest.toLowerCase())) {
            recommendations.push({
              city: city.charAt(0).toUpperCase() + city.slice(1),
              activity: attraction.name,
              description: attraction.description,
              rating: attraction.rating,
              reason: `Matches your interest in ${interest}`
            });
          }
        });
      });
    });
    
    return recommendations.slice(0, 5);
  };

  // توليد توصيات المطاعم
  const generateRestaurantRecommendations = () => {
    const { interests } = userPreferences;
    
    const recommendations = [];
    
    Object.keys(destinations).forEach(city => {
      destinations[city].restaurants.forEach(restaurant => {
        // البحث عن مطابقات مع الاهتمامات الغذائية
        interests.forEach(interest => {
          if (restaurant.cuisine.toLowerCase().includes(interest.toLowerCase())) {
            recommendations.push({
              city: city.charAt(0).toUpperCase() + city.slice(1),
              name: restaurant.name,
              cuisine: restaurant.cuisine,
              rating: restaurant.rating,
              price: restaurant.price,
              reason: `Matches your interest in ${interest} cuisine`
            });
          }
        });
      });
    });
    
    return recommendations.slice(0, 5);
  };

  // توليد توصيات موسمية
  const generateSeasonalRecommendation = () => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    
    let seasonalDestinations = [];
    let reason = '';
    
    if (currentMonth >= 12 || currentMonth <= 2) {
      // شتاء
      seasonalDestinations = ['dubai', 'makkah', 'egypt'];
      reason = 'Escape the cold with these warm winter destinations';
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      // ربيع
      seasonalDestinations = ['netherlands', 'paris', 'london'];
      reason = 'Perfect spring weather for European adventures';
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      // صيف
      seasonalDestinations = ['germany', 'netherlands', 'new york'];
      reason = 'Summer festivals and perfect city exploration weather';
    } else {
      // خريف
      seasonalDestinations = ['istanbul', 'paris', 'london'];
      reason = 'Beautiful autumn colors and comfortable temperatures';
    }
    
    const availableDestinations = seasonalDestinations.filter(city => 
      Object.keys(destinations).includes(city) && 
      !userPreferences.dislikedDestinations.includes(city)
    );
    
    if (availableDestinations.length > 0) {
      return {
        type: 'seasonal',
        title: '🌤️ Seasonal Spotlight',
        destinations: availableDestinations.map(city => ({
          name: city.charAt(0).toUpperCase() + city.slice(1),
          reason: reason,
          data: destinations[city]
        })),
        priority: 'medium'
      };
    }
    
    return null;
  };

  // عرض التوصيات الذكية
  const showSmartRecommendations = () => {
    setAvatarMood('excited');
    const recommendations = generateSmartRecommendations();
    setSmartRecommendations(recommendations);
    setShowRecommendations(true);
    // رسالة ودية
    console.log("✨ Based on your preferences, here are my recommendations for you!");
  };

  // معالجة تفاعل المستخدم مع التوصية
  const handleRecommendationInteraction = (interaction) => {
    updateUserPreferences(interaction);
    
    // إذا نقر على توصية مدينة، افتح محادثة عنها
    if (interaction.type === 'DESTINATION_SELECTION') {
      setInput(`Tell me about ${interaction.data}`);
      setTimeout(() => {
        handleSend();
      }, 500);
      setShowRecommendations(false);
    }
  };

  // ==========================================
  // CHAT HISTORY MANAGEMENT - محدث
  // إدارة سجل المحادثات
  // ==========================================

  // تهيئة سجل المحادثات من localStorage عند التحميل
  useEffect(() => {
    const savedChats = localStorage.getItem('wingsAi_chatHistory');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        setChatHistory(parsedChats);
        
        // إذا كان هناك محادثة حالية، قم بتحميلها
        const currentChat = parsedChats.find(chat => chat.isCurrent);
        if (currentChat) {
          setMessages(currentChat.messages);
          setCurrentChatId(currentChat.id);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // حفظ سجل المحادثات في localStorage عند التغيير
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('wingsAi_chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // إنشاء محادثة جديدة
  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        {
          type: 'assistant',
          content: `${getPersonalizedGreeting()} 👋\n\nI'm Wings Ai, your intelligent travel assistant. Ready to plan your next adventure?\n\nTell me which city you want to visit, and I'll provide you with:\n• 🎯 Best tourist attractions\n• 🍽️ Top restaurants\n• 🏨 Best hotels with prices\n• 🌤️ Weather information\n• 💰 Budget planning & breakdown\n• 🎤 Voice interaction\n• 🎉 Browse Event Resources\n• ⚡ Destination comparison\n• 🤖 Smart personalized recommendations\n\nYou can also use voice - just tell me about your destination!\n\nSo, which city catches your interest? 🌍✨`,
          timestamp: new Date()
        }
      ],
      timestamp: new Date(),
      isCurrent: true,
      isStarred: false
    };

    // تحديث جميع المحادثات السابقة لإزالة حالة isCurrent
    const updatedHistory = chatHistory.map(chat => ({
      ...chat,
      isCurrent: false
    }));

    setChatHistory([newChat, ...updatedHistory]);
    setMessages(newChat.messages);
    setCurrentChatId(newChat.id);
    setSelectedCity(null);
    setEvents([]);
    setAvatarMood('friendly');
    stopSpeaking();
  };

  // تحميل محادثة محددة
  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      const updatedHistory = chatHistory.map(c => ({
        ...c,
        isCurrent: c.id === chatId
      }));
      
      setChatHistory(updatedHistory);
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setSidebarOpen(false);
    }
  };

  // تبديل حالة النجمة للمحادثة
  const toggleStarChat = (chatId, e) => {
    e.stopPropagation();
    
    const updatedHistory = chatHistory.map(chat => 
      chat.id === chatId 
        ? { ...chat, isStarred: !chat.isStarred }
        : chat
    );
    
    setChatHistory(updatedHistory);
  };

  // حذف محادثة
  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);
    
    // إذا كانت المحادثة المحذوفة هي الحالية، أنشئ محادثة جديدة
    if (chatId === currentChatId) {
      createNewChat();
    }
  };



  // تحديث عنوان المحادثة تلقائياً بناءً على المحتوى
  const updateChatTitle = (chatId, newMessages) => {
    if (newMessages.length < 2) return;

    // البحث عن أول رسالة مستخدم تحتوي على اسم مدينة
    const userMessage = newMessages.find(msg => 
      msg.type === 'user' && 
      (msg.content.toLowerCase().includes('tell me about') ||
      msg.content.toLowerCase().includes('dubai') ||
      msg.content.toLowerCase().includes('paris') ||
      msg.content.toLowerCase().includes('london') ||
      msg.content.toLowerCase().includes('new york') ||
      msg.content.toLowerCase().includes('istanbul') ||
      msg.content.toLowerCase().includes('netherlands') ||
      msg.content.toLowerCase().includes('germany') ||
      msg.content.toLowerCase().includes('syria') ||
      msg.content.toLowerCase().includes('makkah') ||
      msg.content.toLowerCase().includes('egypt') ||
      msg.content.toLowerCase().includes('riyadh'))
    );

    if (userMessage) {
      const cities = ['dubai', 'paris', 'london', 'new york', 'istanbul', 'netherlands', 'germany', 'syria', 'makkah', 'egypt', 'riyadh'];
      const foundCity = cities.find(city => 
        userMessage.content.toLowerCase().includes(city)
      );

      if (foundCity) {
        const newTitle = `Chat about ${foundCity.charAt(0).toUpperCase() + foundCity.slice(1)}`;
        
        setChatHistory(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        ));
        return;
      }
    }

    // إذا لم يتم العثور على مدينة، استخدم أول رسالة مستخدم
    const firstUserMessage = newMessages.find(msg => msg.type === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      const shortTitle = content.length > 30 ? content.substring(0, 30) + '...' : content;
      
      setChatHistory(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title: shortTitle } : chat
      ));
    }
  };

  // حفظ الرسائل في سجل المحادثات
  useEffect(() => {
    if (messages.length > 1 && currentChatId) {
      // استخدام functional form لتجنب dependency على chatHistory
      setChatHistory(prev => {
        const updatedHistory = prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: messages }
            : chat
        );
        
        updateChatTitle(currentChatId, messages);
        return updatedHistory;
      });
    }
  }, [messages, currentChatId]);

  // ==========================================
  // COMPARISON FEATURE - الجديد
  // ميزة المقارنة
  // ==========================================

  // فتح نافذة المقارنة
  const openComparisonModal = () => {
    setAvatarMood('thinking');
    setShowComparisonModal(true);
    // تحديد المدن الافتراضية للمقارنة
    setComparisonCities(['Dubai', 'Paris', 'London', 'New York', 'Istanbul']);
    console.log("🌍 Let me compare these amazing destinations for you!");
  };

  // إغلاق نافذة المقارنة
  const closeComparisonModal = () => {
    setShowComparisonModal(false);
    setComparisonCities([]);
  };

  // توليد تقرير المقارنة
  const generateComparisonReport = () => {
    const comparedCities = comparisonCities.map(city => ({
      name: city,
      data: destinations[city.toLowerCase()]
    }));

    let comparisonReport = `**⚡ Golden Destination Comparison**\n\n`;
    comparisonReport += `**📊 Comparing ${comparedCities.length} Top Destinations:**\n\n`;

    // مقارنة أفضل وقت للزيارة
    comparisonReport += `**🌤️ Best Time to Visit:**\n`;
    comparedCities.forEach(city => {
      comparisonReport += `• **${city.name}:** ${city.data.bestTime}\n`;
    });
    comparisonReport += `\n`;

    // مقارنة متوسط تكاليف الفنادق - معدل
    comparisonReport += `**🏨 Average Hotel Prices:**\n`;
    comparedCities.forEach(city => {
      const validPrices = city.data.hotels.map(hotel => {
        // استخراج الرقم من السعر بشكل صحيح
        const priceText = hotel.price;
        
        // البحث عن الأرقام في النص
        const numbers = priceText.match(/\d+/g);
        if (!numbers) return 0;
        
        // تحويل جميع الأرقام الموجودة
        const prices = numbers.map(num => parseInt(num)).filter(price => price > 0);
        
        if (prices.length === 0) return 0;
        
        // إذا كان هناك نطاق سعر (مثل 200-400)، نأخذ المتوسط
        if (prices.length >= 2) {
          return (prices[0] + prices[1]) / 2;
        }
        
        // إذا كان سعر واحد فقط
        return prices[0];
      }).filter(price => price > 0 && price < 10000); // تصفية الأسعار غير المنطقية

      const avgPrice = validPrices.length > 0 
        ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
        : 0;

      comparisonReport += `• **${city.name}:** $${Math.round(avgPrice)}/night\n`;
    });
    comparisonReport += `\n`;

    // مقارنة التقييمات
    comparisonReport += `**⭐ Average Attraction Ratings:**\n`;
    comparedCities.forEach(city => {
      const avgRating = city.data.attractions.reduce((sum, attr) => sum + attr.rating, 0) / city.data.attractions.length;
      comparisonReport += `• **${city.name}:** ${avgRating.toFixed(1)}/5\n`;
    });
    comparisonReport += `\n`;

    // مقارنة أنواع المطاعم
    comparisonReport += `**🍽️ Restaurant Variety:**\n`;
    comparedCities.forEach(city => {
      const cuisines = [...new Set(city.data.restaurants.map(r => r.cuisine))];
      comparisonReport += `• **${city.name}:** ${cuisines.slice(0, 3).join(', ')}${cuisines.length > 3 ? '...' : ''}\n`;
    });
    comparisonReport += `\n`;

    // التوصيات
    comparisonReport += `**🏆 Recommendations:**\n`;
    
    // أفضل مدينة من حيث التكلفة - معدل
    const costRanking = comparedCities.map(city => {
      const validPrices = city.data.hotels.map(hotel => {
        const priceText = hotel.price;
        const numbers = priceText.match(/\d+/g);
        if (!numbers) return 0;
        
        const prices = numbers.map(num => parseInt(num)).filter(price => price > 0);
        
        if (prices.length === 0) return 0;
        
        if (prices.length >= 2) {
          return (prices[0] + prices[1]) / 2;
        }
        
        return prices[0];
      }).filter(price => price > 0 && price < 10000);

      const avgPrice = validPrices.length > 0 
        ? validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length
        : Infinity;

      return { name: city.name, cost: avgPrice };
    }).filter(city => city.cost !== Infinity && city.cost > 0)
      .sort((a, b) => a.cost - b.cost);
    
    if (costRanking.length > 0) {
      comparisonReport += `• **Best Budget:** ${costRanking[0].name} ($${Math.round(costRanking[0].cost)}/night avg)\n`;
    }
    
    // أفضل مدينة من حيث التقييمات
    const ratingRanking = comparedCities.map(city => {
      const avgRating = city.data.attractions.reduce((sum, attr) => sum + attr.rating, 0) / city.data.attractions.length;
      return { name: city.name, rating: avgRating };
    }).sort((a, b) => b.rating - a.rating);
    
    comparisonReport += `• **Highest Rated:** ${ratingRanking[0].name} (${ratingRanking[0].rating.toFixed(1)}/5 avg)\n`;
    
    // أفضل مدينة من حيث التنوع
    const varietyRanking = comparedCities.map(city => {
      const cuisineCount = new Set(city.data.restaurants.map(r => r.cuisine)).size;
      return { name: city.name, variety: cuisineCount };
    }).sort((a, b) => b.variety - a.variety);
    
    comparisonReport += `• **Most Diverse Cuisine:** ${varietyRanking[0].name} (${varietyRanking[0].variety} types)\n\n`;

    comparisonReport += `💡 **Pro Tip:** Use this comparison to choose your next destination based on your priorities!\n\n`;
    comparisonReport += `🔍 **Want more details?** Ask me about any specific city from the comparison!`;

    return {
      type: 'assistant',
      content: comparisonReport,
      timestamp: new Date(),
      isComparison: true
    };
  };

  // معالجة طلب المقارنة
  const handleComparisonRequest = () => {
    setShowComparisonModal(false);
    setIsTyping(true);
    setAvatarMood('thinking');

    setTimeout(() => {
      const comparisonResponse = generateComparisonReport();
      setMessages(prev => [...prev, comparisonResponse]);
      setIsTyping(false);
      setAvatarMood('friendly');
    }, 1500);
  };

  // ==========================================
  // HYBRID EVENTS SYSTEM - محدث بالروابط الجديدة
  // نظام الأحداث الهجين
  // ==========================================

  // 1️⃣ مصادر موثوقة للأحداث لكل مدينة - محدث
  const getEventSources = (cityName) => {
    const sources = {
      'dubai': [
        {
          name: 'Visit Dubai Official',
          url: 'https://www.visitdubai.com/en/whats-on',
          description: 'Official Dubai tourism events calendar',
          icon: '🏙️'
        },
        {
          name: 'Platinumlist Dubai',
          url: 'https://dubai.platinumlist.net/',
          description: 'Book tickets for events and concerts',
          icon: '🎫'
        },
        {
          name: 'Time Out Dubai',
          url: 'https://www.timeoutdubai.com/things-to-do',
          description: 'Comprehensive events guide for Dubai',
          icon: '📰'
        },
        {
          name: 'Dubai Calendar',
          url: 'https://www.dubaicalendar.ae/',
          description: 'Official Dubai events calendar',
          icon: '📅'
        }
      ],
      
      'paris': [
        {
          name: 'Paris Tourist Office',
          url: 'https://en.parisinfo.com/what-to-do-in-paris',
          description: 'Official Paris events guide',
          icon: '🗼'
        },
        {
          name: 'Sortiraparis',
          url: 'https://www.sortiraparis.com/en',
          description: 'Events and outings in Paris',
          icon: '🎭'
        },
        {
          name: 'Time Out Paris',
          url: 'https://www.timeout.com/paris/things-to-do',
          description: 'Paris events and activities',
          icon: '📰'
        },
        {
          name: 'Paris Events Calendar',
          url: 'https://parisjetaime.com/eng/article/current-events-in-paris-a1696',
          description: 'Current events in Paris',
          icon: '📅'
        }
      ],
      
      'london': [
        {
          name: 'Visit London Official',
          url: 'https://www.visitlondon.com/things-to-do/whats-on',
          description: 'Official London events calendar',
          icon: '🇬🇧'
        },
        {
          name: 'Time Out London',
          url: 'https://www.timeout.com/london/things-to-do',
          description: 'London events guide',
          icon: '📰'
        },
        {
          name: 'Londonist Events',
          url: 'https://londonist.com/events',
          description: 'London events and culture',
          icon: '🎪'
        },
        {
          name: 'London Theatre Direct',
          url: 'https://www.londontheatredirect.com/',
          description: 'Theater events and tickets',
          icon: '🎭'
        }
      ],
      
      'new york': [
        {
          name: 'NYC Official Guide',
          url: 'https://www.nycgo.com/events',
          description: 'Official New York City events',
          icon: '🗽'
        },
        {
          name: 'Time Out New York',
          url: 'https://www.timeout.com/newyork/things-to-do',
          description: 'NYC events calendar',
          icon: '📰'
        },
        {
          name: 'Eventbrite NYC',
          url: 'https://www.eventbrite.com/d/ny--new-york/events/',
          description: 'Events and workshops in NYC',
          icon: '🎫'
        },
        {
          name: 'NYC Parks Events',
          url: 'https://www.nycgovparks.org/events',
          description: 'Parks and recreation events',
          icon: '🌳'
        }
      ],
      
      'istanbul': [
        {
          name: 'Visit Istanbul Official',
          url: 'https://visit.istanbul/festival-events',
          description: 'Official Istanbul events calendar',
          icon: '🕌'
        },
        {
          name: 'Time Out Istanbul',
          url: 'https://www.timeout.com/istanbul',
          description: 'Istanbul events guide',
          icon: '📰'
        },
        {
          name: 'Istanbul Events Calendar',
          url: 'https://www.goturkey.com/events',
          description: 'Turkey events calendar',
          icon: '📅'
        },
        {
          name: 'Biletix Turkey',
          url: 'https://www.biletix.com/',
          description: 'Ticket platform for events',
          icon: '🎫'
        }
      ],
      
      'netherlands': [
        {
          name: 'I Amsterdam Official',
          url: 'https://www.iamsterdam.com/en/whats-on',
          description: 'Official Amsterdam events calendar',
          icon: '🇳🇱'
        },
        {
          name: 'Amsterdam Festivals',
          url: 'https://www.iamsterdam.com/en/whats-on/festivals-and-events',
          description: 'Festivals and events guide',
          icon: '🎭'
        },
        {
          name: 'Amsterdam.org Events',
          url: 'https://amsterdam.org/en/events.php',
          description: 'Events and activities calendar',
          icon: '📅'
        },
        {
          name: 'Eventbrite Amsterdam',
          url: 'https://www.eventbrite.com/d/netherlands--amsterdam/events/',
          description: 'Local and international events',
          icon: '🎫'
        }
      ],
      
      'germany': [
        {
          name: 'Visit Berlin Official',
          url: 'https://www.visitberlin.de/en/event-calendar-berlin',
          description: 'Official Berlin events calendar',
          icon: '🇩🇪'
        },
        {
          name: 'Berlin.de Events',
          url: 'https://www.berlin.de/en/events/',
          description: 'Events and culture in Berlin',
          icon: '🎭'
        },
        {
          name: 'Eventbrite Berlin',
          url: 'https://www.eventbrite.de/d/germany--berlin/events/',
          description: 'Local events and workshops',
          icon: '🎫'
        },
        {
          name: 'Resident Advisor Berlin',
          url: 'https://ra.co/events/de/berlin',
          description: 'Electronic music events',
          icon: '🎵'
        }
      ],
      
      'syria': [
        {
          name: 'Syria Events Search',
          url: 'https://www.google.com/search?q=damascus+events+syria',
          description: 'Find events in Syria',
          icon: '🇸🇾'
        },
        {
          name: 'Damascus Cultural Events',
          url: 'https://www.google.com/search?q=damascus+cultural+events',
          description: 'Cultural events in Damascus',
          icon: '🏛️'
        }
      ],
      
      'makkah': [
        {
          name: 'Ministry of Hajj and Umrah',
          url: 'https://www.haj.gov.sa/en',
          description: 'Official Hajj events and information',
          icon: '🕋'
        },
        {
          name: 'Visit Saudi Events',
          url: 'https://www.visitsaudi.com/en/events',
          description: 'Official Saudi events calendar',
          icon: '🇸🇦'
        },
        {
          name: 'Makkah Events',
          url: 'https://www.google.com/search?q=makkah+events+saudi+arabia',
          description: 'Events in Makkah',
          icon: '🔍'
        }
      ],
      
      'egypt': [
        {
          name: 'Experience Egypt',
          url: 'https://www.experienceegypt.eg/en',
          description: 'Official Egypt tourism portal',
          icon: '🐪'
        },
        {
          name: 'Cairo 360',
          url: 'https://www.cairo360.com/upcoming-events/',
          description: 'Comprehensive Cairo events guide',
          icon: '🇪🇬'
        },
        {
          name: 'CairoScene Events',
          url: 'https://scenenow.com/Events',
          description: 'Cairo nightlife and events',
          icon: '🎭'
        },
        {
          name: 'Egypt Tourism Authority',
          url: 'https://www.egypt.travel/',
          description: 'Official tourism events',
          icon: '📅'
        }
      ],
      
      'riyadh': [
        {
          name: 'Visit Saudi',
          url: 'https://www.visitsaudi.com/en/events',
          description: 'Official Saudi events calendar',
          icon: '🇸🇦'
        },
        {
          name: 'Riyadh Season',
          url: 'https://riyadhseason.sa/',
          description: 'Major entertainment events',
          icon: '🏜️'
        },
        {
          name: 'Saudi Events',
          url: 'https://www.saudievents.sa/',
          description: 'Official events platform',
          icon: '🎪'
        },
        {
          name: 'Things to Do in Riyadh',
          url: 'https://www.visitsaudi.com/en/riyadh',
          description: 'Riyadh activities guide',
          icon: '📅'
        }
      ]
    };
    
    return sources[cityName.toLowerCase()] || [
      {
        name: 'Local Events Search',
        url: `https://www.google.com/search?q=events+in+${cityName}`,
        description: `Find events in ${cityName}`,
        icon: '🔍'
      }
    ];
  };

  // 2️⃣ دالة جلب الأحداث الهجينة - محدثة
  const fetchEventsForCity = async (cityName) => {
    // ✅ التأكد من استخدام المدينة الممررة وليس الحالة
    const targetCity = cityName || selectedCity;
    if (!targetCity) return [];
    
    setEventsLoading(true);
    try {
      console.log(`🔍 Starting hybrid events search for: ${targetCity}`);
      
      // المحاولة الأولى: Auto-fetch من APIs مجانية
      const autoEvents = await fetchEventsAuto(targetCity);
      
      if (autoEvents.length > 0) {
        console.log(`🎉 Auto-fetch found ${autoEvents.length} events for ${targetCity}`);
        setEvents(autoEvents);
        return autoEvents;
      }
      
      // المحاولة الثانية: الأحداث المنسقة
      console.log(`ℹ️ Using curated events for ${targetCity}`);
      const curatedEvents = generateCuratedEvents(targetCity);
      setEvents(curatedEvents);
      return curatedEvents;
      
    } catch (error) {
      console.error('❌ Error in hybrid events system:', error);
      // Fallback نهائي
      const fallbackEvents = generateCuratedEvents(targetCity);
      setEvents(fallbackEvents);
      return fallbackEvents;
    } finally {
      setEventsLoading(false);
    }
  };

  // 3️⃣ Auto-fetch من APIs مجانية
  const fetchEventsAuto = async () => {
    // هنا يمكن إضافة أي APIs مجانية أخرى
    // حالياً نستخدم الأحداث المنسقة كبديل
    return [];
  };

  // 4️⃣ الأحداث المنسقة - Fallback ذكي
  const generateCuratedEvents = (cityName) => {
    const now = new Date();
    const baseDate = new Date(now);
    baseDate.setDate(now.getDate() + 7); // أحداث الأسبوع القادم

    const curatedTemplates = {
      'dubai': [
        {
          id: 'dubai-1',
          title: 'Dubai Shopping Festival',
          date: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '10:00 AM - 10:00 PM',
          location: 'Various Locations, Dubai',
          description: 'The biggest shopping festival in the Middle East with amazing discounts and entertainment.',
          type: 'shopping',
          price: 'Free Entry',
          rating: 4.8,
          attendees: '500K+',
          source: 'curated',
          image: null
        },
        {
          id: 'dubai-2',
          title: 'Desert Safari Experience',
          date: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '3:00 PM - 9:00 PM',
          location: 'Arabian Desert, Dubai',
          description: 'Thrilling desert adventure with dune bashing, camel riding, and traditional dinner.',
          type: 'adventure',
          price: '$45-85',
          rating: 4.9,
          attendees: '200',
          source: 'curated',
          image: null
        }
      ],
      'paris': [
        {
          id: 'paris-1',
          title: 'Paris Fashion Week',
          date: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '2:00 PM - 6:00 PM',
          location: 'Carrousel du Louvre, Paris',
          description: 'World-renowned fashion event featuring top designers and latest trends.',
          type: 'fashion',
          price: 'Invitation Only',
          rating: 4.7,
          attendees: '5K+',
          source: 'curated',
          image: null
        }
      ],
      'egypt': [
        {
          id: 'egypt-1',
          title: 'Cairo International Film Festival',
          date: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '6:00 PM - 11:00 PM',
          location: 'Cairo Opera House, Egypt',
          description: 'Premier film festival showcasing international and Arab cinema.',
          type: 'cultural',
          price: 'Varies by event',
          rating: 4.6,
          attendees: '50K+',
          source: 'curated',
          image: null
        }
      ],
      'syria': [
        {
          id: 'syria-1',
          title: 'Damascus International Fair',
          date: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '9:00 AM - 9:00 PM',
          location: 'Damascus Fairground, Syria',
          description: 'Historic international trade fair showcasing Syrian culture and products.',
          type: 'cultural',
          price: 'Free Entry',
          rating: 4.5,
          attendees: '100K+',
          source: 'curated',
          image: null
        }
      ]
      // يمكن إضافة المزيد من المدن...
    };

    const cityKey = cityName.toLowerCase();
    return curatedTemplates[cityKey] || [
      {
        id: `${cityKey}-default-1`,
        title: `${cityName} Cultural Festival`,
        date: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00 AM - 6:00 PM',
        location: `${cityName} City Center`,
        description: `Experience the rich culture and traditions of ${cityName}.`,
        type: 'cultural',
        price: 'Free',
        rating: 4.5,
        attendees: '5K+',
        source: 'curated',
        image: null
      }
    ];
  };

  // ==========================================
  // VOICE RECOGNITION SETUP
  // إعداد التعرف على الصوت
  // ==========================================
  useEffect(() => {
    const handleVoiceInput = (text) => {
      if (text.trim()) {
        setInput(text);
        // The input will be handled in the useEffect or directly via UI interaction
      }
    };

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setAvatarMood('thinking');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(interimTranscript || finalTranscript);
        
        if (finalTranscript) {
          setInput(finalTranscript);
          handleVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setAvatarMood('friendly');
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setAvatarMood('friendly');
        setTranscript('');
      };
    } else {
      setVoiceSupported(false);
    }

    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ==========================================
  // AI AVATAR COMPONENT - UPDATED FOR MOBILE AND THEME
  // مكون الأفاتار المتحرك - محدث للجوال والثيم
  // ==========================================
  const AiAvatar = ({ mood = 'friendly', isTyping = false, isSpeaking = false, isListening = false, size = "small" }) => {
    const [blinkEyes, setBlinkEyes] = useState(false);
    const [wavingHand, setWavingHand] = useState(false);

    useEffect(() => {
      const blinkInterval = setInterval(() => {
        setBlinkEyes(true);
        setTimeout(() => setBlinkEyes(false), 200);
      }, 3000 + Math.random() * 2000);

      return () => clearInterval(blinkInterval);
    }, []);

    useEffect(() => {
      setWavingHand(true);
      setTimeout(() => setWavingHand(false), 2000);
    }, []);

    const getMoodStyles = () => {
      switch (mood) {
        case 'happy':
          return {
            eyes: 'happy-eyes',
            mouth: 'happy-mouth',
            color: 'from-blue-400 to-purple-500',
            eyebrows: 'happy-eyebrows'
          };
        case 'thinking':
          return {
            eyes: 'thinking-eyes',
            mouth: 'thinking-mouth',
            color: 'from-purple-400 to-pink-500',
            eyebrows: 'thinking-eyebrows'
          };
        case 'excited':
          return {
            eyes: 'excited-eyes',
            mouth: 'excited-mouth',
            color: 'from-pink-400 to-rose-500',
            eyebrows: 'excited-eyebrows'
          };
        case 'friendly':
          return {
            eyes: 'friendly-eyes',
            mouth: 'friendly-mouth',
            color: 'from-green-400 to-emerald-500',
            eyebrows: 'friendly-eyebrows'
          };
        case 'listening':
          return {
            eyes: 'listening-eyes',
            mouth: 'listening-mouth',
            color: 'from-orange-400 to-red-500',
            eyebrows: 'listening-eyebrows'
          };
        case 'confused':
          return {
            eyes: 'confused-eyes',
            mouth: 'confused-mouth',
            color: 'from-yellow-400 to-orange-500',
            eyebrows: 'confused-eyebrows'
          };
        case 'sad':
          return {
            eyes: 'sad-eyes',
            mouth: 'sad-mouth',
            color: 'from-gray-400 to-blue-500',
            eyebrows: 'sad-eyebrows'
          };
        default:
          return {
            eyes: 'friendly-eyes',
            mouth: 'friendly-mouth',
            color: 'from-blue-400 to-purple-500',
            eyebrows: 'friendly-eyebrows'
          };
      }
    };

    const moodStyle = getMoodStyles();

    const sizeStyles = {
      small: {
        container: "w-12 h-12 sm:w-16 sm:h-16",
        head: "w-12 h-12 sm:w-16 sm:h-16",
        eyesContainer: "top-4 sm:top-6 gap-2 sm:gap-3",
        eye: "w-2 h-2 sm:w-3 sm:h-3",
        pupil: "top-0.25 left-0.25 w-1 h-1 sm:top-0.5 sm:left-0.5 sm:w-1.5 sm:h-1.5",
        highlight: "top-0.125 left-0.125 w-0.5 h-0.5 sm:top-0.25 sm:left-0.25 sm:w-0.75 sm:h-0.75",
        nose: "top-8 sm:top-10",
        mouth: "top-10 sm:top-12",
        cheeks: "top-6 sm:top-8 left-1.5 right-1.5 sm:left-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2",
        hands: "-bottom-1 px-0.5",
        hand: "w-2 h-3 sm:w-3 sm:h-4",
        typingBubble: "-right-6 sm:-right-8 top-1 sm:top-2",
        bubbleDots: "w-1 h-1"
      },
      medium: {
        container: "w-20 h-20 sm:w-24 sm:h-24",
        head: "w-20 h-20 sm:w-24 sm:h-24",
        eyesContainer: "top-6 sm:top-8 gap-3 sm:gap-4",
        eye: "w-3 h-3 sm:w-4 sm:h-4",
        pupil: "top-0.5 left-0.5 w-1.5 h-1.5 sm:top-1 sm:left-1 sm:w-2 sm:h-2",
        highlight: "top-0.25 left-0.25 w-0.75 h-0.75 sm:top-0.5 sm:left-0.5 sm:w-1 sm:h-1",
        nose: "top-12 sm:top-14",
        mouth: "top-14 sm:top-16",
        cheeks: "top-8 sm:top-10 left-2.5 right-2.5 sm:left-3 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3",
        hands: "-bottom-1 px-1",
        hand: "w-3 h-4.5 sm:w-4 sm:h-6",
        typingBubble: "-right-8 sm:-right-10 top-3 sm:top-4",
        bubbleDots: "w-1.5 h-1.5"
      },
      large: {
        container: "w-28 h-28 sm:w-32 sm:h-32",
        head: "w-28 h-28 sm:w-32 sm:h-32",
        eyesContainer: "top-10 sm:top-12 gap-4 sm:gap-6",
        eye: "w-4 h-4 sm:w-5 sm:h-5",
        pupil: "top-0.75 left-0.75 w-2.5 h-2.5 sm:top-1 sm:left-1 sm:w-3 sm:h-3",
        highlight: "top-0.375 left-0.375 w-1.25 h-1.25 sm:top-0.5 sm:left-0.5 sm:w-1.5 sm:h-1.5",
        nose: "top-16 sm:top-20",
        mouth: "top-20 sm:top-24",
        cheeks: "top-12 sm:top-16 left-3.5 right-3.5 sm:left-4 sm:right-4 w-3.5 h-3.5 sm:w-4 sm:h-4",
        hands: "-bottom-2 px-2",
        hand: "w-5 h-6 sm:w-6 sm:h-8",
        typingBubble: "-right-10 sm:-right-12 top-6 sm:top-8",
        bubbleDots: "w-2 h-2"
      }
    };

    const currentSize = sizeStyles[size] || sizeStyles.small;

    return (
      <div className="relative">
        <div className={`relative ${currentSize.container} mx-auto`} style={{ animation: 'float 3s ease-in-out infinite' }}>
          
          {isTyping && (
            <>
              <div className="absolute top-0 right-0 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-400 rounded-full" 
                   style={{ animation: 'sparkle 1s ease-in-out infinite' }} />
              <div className="absolute bottom-0 left-0 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-400 rounded-full" 
                   style={{ animation: 'sparkle 1s ease-in-out infinite 0.3s' }} />
            </>
          )}

          {(isSpeaking || isListening) && (
            <>
              <div className="absolute -inset-3 sm:-inset-4 border-2 border-blue-400 rounded-full animate-ping"></div>
              <div className="absolute -inset-4 sm:-inset-6 border-2 border-purple-400 rounded-full animate-ping" 
                   style={{ animationDelay: '0.2s' }}></div>
            </>
          )}

          {mood === 'sad' && (
            <div className="absolute -inset-1 sm:-inset-2 border-2 border-gray-400 rounded-full animate-pulse"></div>
          )}

          <div className={`${currentSize.head} rounded-full bg-gradient-to-br ${moodStyle.color} shadow-2xl relative`}
               style={{ animation: 'glow 2s ease-in-out infinite' }}>
            
            <div className={`absolute top-4 sm:top-6 left-0 right-0 flex justify-center gap-6 sm:gap-8`}>
              <div className={`${size === 'small' ? 'w-3 h-0.5 sm:w-4 sm:h-0.5' : size === 'large' ? 'w-6 h-1 sm:w-8 sm:h-1' : 'w-4 h-0.5 sm:w-6 sm:h-1'} ${darkMode ? 'bg-gray-800' : 'bg-gray-600'} rounded-full ${moodStyle.eyebrows}`}></div>
              <div className={`${size === 'small' ? 'w-3 h-0.5 sm:w-4 sm:h-0.5' : size === 'large' ? 'w-6 h-1 sm:w-8 sm:h-1' : 'w-4 h-0.5 sm:w-6 sm:h-1'} ${darkMode ? 'bg-gray-800' : 'bg-gray-600'} rounded-full ${moodStyle.eyebrows}`}></div>
            </div>
            
            <div className={`absolute ${currentSize.eyesContainer} left-0 right-0 flex justify-center`}>
              <div className={`relative ${moodStyle.eyes}`}>
                <div className={`${currentSize.eye} ${darkMode ? 'bg-white' : 'bg-gray-100'} rounded-full shadow-lg ${blinkEyes ? 'scale-y-[0.1]' : 'scale-y-100'} transition-transform duration-200`}>
                  <div className={`absolute ${currentSize.pupil} ${darkMode ? 'bg-gray-900' : 'bg-gray-800'} rounded-full`}>
                    <div className={`absolute ${currentSize.highlight} ${darkMode ? 'bg-white' : 'bg-gray-100'} rounded-full`}></div>
                  </div>
                </div>
              </div>

              <div className={`relative ${moodStyle.eyes}`}>
                <div className={`${currentSize.eye} ${darkMode ? 'bg-white' : 'bg-gray-100'} rounded-full shadow-lg ${blinkEyes ? 'scale-y-[0.1]' : 'scale-y-100'} transition-transform duration-200`}>
                  <div className={`absolute ${currentSize.pupil} ${darkMode ? 'bg-gray-900' : 'bg-gray-800'} rounded-full`}>
                    <div className={`absolute ${currentSize.highlight} ${darkMode ? 'bg-white' : 'bg-gray-100'} rounded-full`}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`absolute ${currentSize.nose} left-1/2 transform -translate-x-1/2`}>
              <div className={`${size === 'small' ? 'w-1 h-1 sm:w-1 sm:h-1.5' : size === 'large' ? 'w-1.5 h-2 sm:w-2 sm:h-3' : 'w-1 h-1.5 sm:w-1.5 sm:h-2'} ${darkMode ? 'bg-white/30' : 'bg-gray-400/30'} rounded-full`}></div>
            </div>

           <div className={`absolute ${currentSize.mouth} left-[34%] transform ${moodStyle.mouth}`}>
              {isSpeaking ? (
                <div className={`${size === 'small' ? 'w-3 h-2 sm:w-4 sm:h-3' : size === 'large' ? 'w-6 h-4 sm:w-8 sm:h-5' : 'w-4 h-3 sm:w-6 sm:h-4'} ${darkMode ? 'bg-gray-800' : 'bg-gray-700'} rounded-full`} 
                     style={{ animation: 'speaking 0.3s ease-in-out infinite' }}>
                  <div className="absolute top-0.5 left-0.5 right-0.5 h-1 sm:top-1 sm:left-1 sm:right-1 sm:h-2 bg-pink-400 rounded-full"></div>
                </div>
              ) : isListening ? (
                <div className={`${size === 'small' ? 'w-4 h-1.5 sm:w-6 sm:h-2' : size === 'large' ? 'w-8 h-3 sm:w-10 sm:h-4' : 'w-6 h-2 sm:w-8 sm:h-3'} bg-red-400 rounded-full animate-pulse`}></div>
              ) : mood === 'sad' ? (
                <div className={`${size === 'small' ? 'w-4 h-1 sm:w-6 sm:h-1.5' : size === 'large' ? 'w-8 h-2 sm:w-10 sm:h-2.5' : 'w-6 h-1.5 sm:w-8 sm:h-2'} border-t-2 sm:border-t-3 ${darkMode ? 'border-white' : 'border-gray-800'} rounded-t-full`}></div>
              ) : mood === 'confused' ? (
                <div className={`${size === 'small' ? 'w-3 h-1.5 sm:w-4 sm:h-2' : size === 'large' ? 'w-6 h-3 sm:w-8 sm:h-4' : 'w-4 h-2 sm:w-6 sm:h-3'} ${darkMode ? 'bg-gray-800' : 'bg-gray-700'} rounded-full transform rotate-45`}></div>
              ) : (
                <div className={`${size === 'small' ? 'w-4 h-1 sm:w-6 sm:h-1.5' : size === 'large' ? 'w-8 h-2 sm:w-10 sm:h-2.5' : 'w-6 h-1.5 sm:w-8 sm:h-2'} border-b-2 sm:border-b-3 ${darkMode ? 'border-white' : 'border-gray-800'} rounded-b-full`}></div>
              )}
            </div>

            {mood !== 'sad' && mood !== 'confused' && (
              <>
                <div className={`absolute ${currentSize.cheeks} bg-pink-300/50 rounded-full blur-sm`}></div>
                <div className={`absolute ${currentSize.cheeks} bg-pink-300/50 rounded-full blur-sm`}></div>
              </>
            )}

            {mood === 'sad' && (
              <>
                <div className="absolute top-8 sm:top-10 left-2 sm:left-3 w-1 h-1.5 sm:w-1 sm:h-2 bg-blue-300 rounded-full animate-bounce"></div>
                <div className="absolute top-8 sm:top-10 right-2 sm:right-3 w-1 h-1.5 sm:w-1 sm:h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </>
            )}
          </div>

          <div className={`absolute ${currentSize.hands} left-0 right-0 flex justify-between`}>
            <div className={`${currentSize.hand} bg-gradient-to-br ${moodStyle.color} rounded-full shadow-lg`}
                 style={{ animation: wavingHand ? 'waveHand 0.5s ease-in-out infinite' : 'none' }}>
            </div>
            
            <div className={`${currentSize.hand} bg-gradient-to-br ${moodStyle.color} rounded-full shadow-lg`}>
            </div>
          </div>

          {isTyping && (
            <div className={`absolute ${currentSize.typingBubble} ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg sm:rounded-xl px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-lg`}>
              <div className="flex gap-0.5">
                <div className={`${currentSize.bubbleDots} bg-blue-400 rounded-full`} style={{ animation: 'typing 1s ease-in-out infinite' }}></div>
                <div className={`${currentSize.bubbleDots} bg-purple-400 rounded-full`} style={{ animation: 'typing 1s ease-in-out infinite 0.2s' }}></div>
                <div className={`${currentSize.bubbleDots} bg-pink-400 rounded-full`} style={{ animation: 'typing 1s ease-in-out infinite 0.4s' }}></div>
              </div>
              <div className={`absolute left-0 top-1 sm:top-2 w-0 h-0 border-t-2 sm:border-t-3 border-t-transparent border-r-4 sm:border-r-6 ${darkMode ? 'border-r-gray-800' : 'border-r-white'} border-b-2 sm:border-b-3 border-b-transparent -ml-1 sm:-ml-1.5`}></div>
            </div>
          )}

          {mood === 'confused' && (
            <div className="absolute -right-4 sm:-right-6 top-1 sm:top-2 bg-yellow-400 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs">?</span>
            </div>
          )}
        </div>

        <div className="text-center mt-1 sm:mt-2">
          <p className={`${currentTheme.text.primary} font-semibold text-xs sm:text-sm`}>Wings AI</p>
          <p className={`${currentTheme.text.tertiary} text-xs`}>
            {isListening ? '🎤 Listening...' : 
             isSpeaking ? '🔊 Speaking...' : 
             isTyping ? '✍️ Typing...' : 
             mood === 'sad' ? '😢 I didn\'t understand' :
             mood === 'confused' ? '🤔 Let me think...' :
             '😊 Ready to help!'}
          </p>
          {transcript && (
            <p className={`text-blue-300 text-xs mt-0.5 sm:mt-1 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-200'} rounded px-1.5 sm:px-2 py-0.5 sm:py-1`}>
              "{transcript}"
            </p>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // SIDEBAR COMPONENT - UPDATED WITH CHAT HISTORY AND STARS
  // مكون الشريط الجانبي - محدث بسجل المحادثات والنجوم
  // ==========================================
  const Sidebar = () => (
  <div className={`fixed inset-y-0 left-0 z-50 w-80 ${currentTheme.sidebar} border-r ${darkMode ? 'border-purple-500/20' : 'border-purple-300/20'} transform transition-transform duration-300 ease-in-out ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  }`}>
    <div className="flex flex-col h-full">
      {/* رأس الشريط الجانبي */}
      <div className={`p-6 border-b ${darkMode ? 'border-purple-500/20' : 'border-purple-300/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Plane className="w-6 h-9 text-purple-400" />
              <Sparkles className="w-3 h-3 text-purple-300 absolute -top-1 -right-1" />
            </div>
            <h2 className="text-lg font-bold md:text-xl lg:text-2xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 drop-shadow-lg">
              Wings AI
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-2 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-200/50'} rounded-lg ${currentTheme.text.tertiary} ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className={`${currentTheme.text.tertiary} text-sm mt-2`}>Your Intelligent Travel Assistant</p>
      </div>

      {/* سجل المحادثات - محدث */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${currentTheme.text.primary} font-semibold text-lg flex items-center gap-2`}>
            <MessageCircle className="w-5 h-5 text-blue-400" />
            Chat History
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${currentTheme.text.tertiary} ${darkMode ? 'bg-gray-800/50' : 'bg-gray-200/50'} px-2 py-1 rounded`}>
              {chatHistory.length}/50
            </span>
            <button
              onClick={() => {
                if (chatHistory.length === 0) {
                  createNewChat();
                } else {
                  setShowDeleteAllConfirm(true);
                }
              }}
              className={`p-2 ${chatHistory.length === 0 ? 'hover:bg-green-500/20' : 'hover:bg-red-500/20'} rounded ${currentTheme.text.tertiary} ${chatHistory.length === 0 ? 'hover:text-green-300' : 'hover:text-red-300'} transition-colors`}
              title={chatHistory.length === 0 ? "Create New Chat" : "Delete All Chats"}
            >
              {chatHistory.length === 0 ? (
                <Plus className="w-5 h-5" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {chatHistory
            .sort((a, b) => {
              // وضع المحادثات المميزة في الأعلى
              if (a.isStarred && !b.isStarred) return -1;
              if (!a.isStarred && b.isStarred) return 1;
              return new Date(b.timestamp) - new Date(a.timestamp);
            })
            .map((chat) => (
            <div
              key={chat.id}
              onClick={() => loadChat(chat.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                chat.isCurrent 
                  ? `${darkMode ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-200/50 border-blue-400/50'} ${currentTheme.text.primary}` 
                  : `${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-gray-100/50 border-gray-300/50'} ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50'}`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {chat.isStarred && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                    <p className={`text-sm font-medium truncate ${
                      chat.isCurrent ? 'text-blue-300' : currentTheme.text.primary
                    }`}>
                      {chat.title}
                    </p>
                  </div>
                  <p className={`text-xs ${currentTheme.text.tertiary}`}>
                    {new Date(chat.timestamp).toLocaleDateString()} • 
                    {chat.messages.length} messages
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => toggleStarChat(chat.id, e)}
                    className={`p-1 rounded transition-colors ${
                      chat.isStarred 
                        ? 'text-yellow-400 hover:text-yellow-300' 
                        : `${currentTheme.text.tertiary} hover:text-yellow-400`
                    }`}
                    title={chat.isStarred ? "Unstar chat" : "Star chat"}
                  >
                    <Star className={`w-4 h-4 ${chat.isStarred ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className={`p-1 hover:bg-red-500/20 rounded ${currentTheme.text.tertiary} hover:text-red-300 transition-colors ml-1`}
                    title="Delete Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {chatHistory.length === 0 && (
            <div className={`text-center py-8 ${currentTheme.text.tertiary} text-sm`}>
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className={`${currentTheme.text.secondary} mb-2`}>No chat history yet</p>
              <p className={`${currentTheme.text.tertiary} text-xs`}>Start a conversation to see your history here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// DELETE ALL CONFIRMATION MODAL - محدث
// نافذة تأكيد حذف الكل
// ==========================================
const DeleteAllConfirmationModal = () => {
  // دالة حذف جميع المحادثات مع الاحتفاظ بالحالية
  const handleDeleteAllChats = () => {
    if (chatHistory.length === 0) {
      createNewChat();
    } else {
      // الاحتفاظ بالمحادثة الحالية فقط
      const currentChat = chatHistory.find(chat => chat.isCurrent);
      if (currentChat) {
        setChatHistory([currentChat]);
      } else {
        setChatHistory([]);
        createNewChat();
      }
    }
    setShowDeleteAllConfirm(false);
  };

  return (
    <div className={`fixed inset-0 ${darkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      showDeleteAllConfirm ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-red-900' : 'bg-gradient-to-br from-red-50 to-red-100'} border ${darkMode ? 'border-red-500/30' : 'border-red-400/30'} rounded-2xl p-6 max-w-sm w-full`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`${currentTheme.text.primary} font-semibold text-lg`}>
              {chatHistory.length === 0 ? 'Create New Chat?' : 'Delete All Chats?'}
            </h3>
            <p className={`${currentTheme.text.tertiary} text-sm`}>
              {chatHistory.length === 0 ? 'Start a new conversation' : 'Keep current chat only'}
            </p>
          </div>
        </div>
        
        {chatHistory.length > 0 && (
          <div className={`${darkMode ? 'bg-red-500/10' : 'bg-red-200/50'} border ${darkMode ? 'border-red-500/20' : 'border-red-400/30'} rounded-lg p-3 mb-4`}>
            <div className="flex items-center gap-2 text-red-300 text-sm">
              <span className="font-semibold">Note:</span>
              <span>Current chat will be kept, {chatHistory.length - 1} chats will be deleted</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteAllConfirm(false)}
            className={`flex-1 px-4 py-2.5 ${currentTheme.button.secondary} rounded-lg font-medium transition-all`}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAllChats}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            {chatHistory.length === 0 ? (
              <>
                <Plus className="w-4 h-4" />
                New Chat
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Others
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

  // ==========================================
  // SMART RECOMMENDATIONS MODAL - الجديد
  // نافذة التوصيات الذكية
  // ==========================================
  const SmartRecommendationsModal = () => {
    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        showRecommendations ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-indigo-900' : 'bg-gradient-to-br from-indigo-50 to-purple-100'} border ${darkMode ? 'border-indigo-500/30' : 'border-indigo-400/30'} rounded-2xl p-6 max-w-4xl w-full max-h-96 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`${currentTheme.text.primary} font-semibold text-xl flex items-center gap-2`}>
                <Zap className="w-6 h-6 text-yellow-400" />
                Smart Recommendations
              </h3>
              <p className={`${currentTheme.text.tertiary} text-sm`}>Personalized suggestions based on your preferences</p>
            </div>
            <button 
              onClick={() => setShowRecommendations(false)}
              className={`p-2 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-200/50 hover:bg-gray-300/50'} rounded-lg ${currentTheme.text.tertiary} ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {smartRecommendations.length > 0 ? (
              smartRecommendations.map((recommendation, index) => (
                <div key={index} className={`${currentTheme.card} rounded-xl p-4 border ${darkMode ? 'border-gray-700/50' : 'border-gray-300/50'}`}>
                  <h4 className={`${currentTheme.text.primary} font-semibold text-lg flex items-center gap-2`}>
                    {recommendation.title}
                  </h4>
                  
                  {recommendation.type === 'personalized_destinations' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recommendation.destinations.map((dest, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleRecommendationInteraction({
                            type: 'DESTINATION_SELECTION',
                            data: dest.name.toLowerCase()
                          })}
                          className={`p-3 ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100/50'} rounded-lg border ${darkMode ? 'border-gray-600/50 hover:border-indigo-500/50' : 'border-gray-300/50 hover:border-indigo-400/50'} cursor-pointer transition-all ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className={`${currentTheme.text.primary} font-medium`}>{dest.name}</h5>
                            <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded text-xs text-green-300">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{dest.matchScore} pts</span>
                            </div>
                          </div>
                          <p className={`${currentTheme.text.secondary} text-sm mb-2`}>{dest.reason}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span>Best time: {dest.data.bestTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {recommendation.type === 'activities' && (
                    <div className="space-y-2">
                      {recommendation.activities.map((activity, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700/20' : 'bg-gray-100/30'} rounded-lg`}>
                          <div>
                            <h5 className={`${currentTheme.text.primary} font-medium`}>{activity.activity}</h5>
                            <p className={`${currentTheme.text.secondary} text-sm`}>{activity.description}</p>
                            <p className="text-blue-300 text-xs">{activity.reason}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-sm">⭐ {activity.rating}</span>
                            <span className={`${currentTheme.text.tertiary} text-sm`}>{activity.city}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {recommendation.type === 'restaurants' && (
                    <div className="space-y-2">
                      {recommendation.restaurants.map((restaurant, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700/20' : 'bg-gray-100/30'} rounded-lg`}>
                          <div>
                            <h5 className={`${currentTheme.text.primary} font-medium`}>{restaurant.name}</h5>
                            <p className={`${currentTheme.text.secondary} text-sm`}>{restaurant.cuisine} • {restaurant.price}</p>
                            <p className="text-blue-300 text-xs">{restaurant.reason}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-sm">⭐ {restaurant.rating}</span>
                            <span className={`${currentTheme.text.tertiary} text-sm`}>{restaurant.city}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {recommendation.type === 'seasonal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recommendation.destinations.map((dest, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleRecommendationInteraction({
                            type: 'DESTINATION_SELECTION',
                            data: dest.name.toLowerCase()
                          })}
                          className={`p-3 bg-gradient-to-br ${darkMode ? 'from-blue-500/10 to-purple-500/10' : 'from-blue-100 to-purple-100'} rounded-lg border ${darkMode ? 'border-blue-500/30' : 'border-blue-400/30'} cursor-pointer transition-all ${darkMode ? 'hover:border-blue-400/50' : 'hover:border-blue-300/50'}`}
                        >
                          <h5 className={`${currentTheme.text.primary} font-medium mb-2`}>{dest.name}</h5>
                          <p className={`${currentTheme.text.secondary} text-sm`}>{dest.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className={`${currentTheme.text.secondary} text-lg`}>No recommendations yet</p>
                <p className={`${currentTheme.text.tertiary} text-sm mt-1`}>Start exploring destinations to get personalized recommendations</p>
              </div>
            )}
          </div>

          <div className={`mt-6 p-4 ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-100/50'} border ${darkMode ? 'border-indigo-500/20' : 'border-indigo-400/30'} rounded-lg`}>
            <div className="flex items-center gap-2 text-indigo-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">How it works:</span>
            </div>
            <p className={`${currentTheme.text.tertiary} text-sm`}>
              Our AI analyzes your search history, preferences, and interactions to provide personalized travel recommendations that match your unique style.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // COMPARISON MODAL COMPONENT - الجديد
  // نافذة المقارنة
  // ==========================================
  const ComparisonModal = () => {
    const topDestinations = [
      'Dubai', 'Paris', 'London', 'New York', 'Istanbul',
      'Netherlands', 'Germany', 'Syria', 'Makkah', 'Egypt', 'Riyadh'
    ];

    const toggleCitySelection = (city) => {
      setComparisonCities(prev => {
        if (prev.includes(city)) {
          return prev.filter(c => c !== city);
        } else if (prev.length < 5) {
          return [...prev, city];
        }
        return prev;
      });
    };

    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        showComparisonModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-amber-900' : 'bg-gradient-to-br from-amber-50 to-yellow-100'} border ${darkMode ? 'border-amber-500/30' : 'border-amber-400/30'} rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`${currentTheme.text.primary} font-semibold text-xl flex items-center gap-2`}>
                <GitCompare className="w-6 h-6 text-amber-400" />
                Golden Destination Comparison
              </h3>
              <p className={`${currentTheme.text.tertiary} text-sm`}>Compare up to 5 destinations side by side</p>
            </div>
            <button 
              onClick={closeComparisonModal}
              className={`p-2 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-200/50 hover:bg-gray-300/50'} rounded-lg ${currentTheme.text.tertiary} ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <h4 className={`${currentTheme.text.primary} font-medium mb-3`}>Select Destinations to Compare (Max 5)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {topDestinations.map(city => (
                <button
                  key={city}
                  onClick={() => toggleCitySelection(city)}
                  className={`p-3 rounded-lg border transition-all ${
                    comparisonCities.includes(city)
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : `${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-gray-100/50 border-gray-300/50'} ${currentTheme.text.secondary} ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50'}`
                  }`}
                  disabled={!comparisonCities.includes(city) && comparisonCities.length >= 5}
                >
                  <div className="text-sm font-medium">{city}</div>
                  {comparisonCities.includes(city) && (
                    <div className="text-xs text-amber-400 mt-1">✓ Selected</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {comparisonCities.length > 0 && (
            <div className={`${darkMode ? 'bg-amber-500/10' : 'bg-amber-100/50'} border ${darkMode ? 'border-amber-500/20' : 'border-amber-400/30'} rounded-lg p-4 mb-4`}>
              <div className="flex items-center gap-2 text-amber-300 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Selected for Comparison:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {comparisonCities.map(city => (
                  <span key={city} className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={closeComparisonModal}
              className={`flex-1 px-4 py-2.5 ${currentTheme.button.secondary} rounded-xl font-medium transition-all`}
            >
              Cancel
            </button>
            <button
              onClick={handleComparisonRequest}
              disabled={comparisonCities.length < 2}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              Compare {comparisonCities.length} Destinations
            </button>
          </div>

          {comparisonCities.length < 2 && (
            <p className="text-amber-400 text-sm mt-3 text-center">
              Select at least 2 destinations to compare
            </p>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // EVENTS COMPONENTS - UPDATED
  // مكونات الأحداث - محدثة
  // ==========================================
  const EventsModal = () => {
    // ✅ استخدام المدينة المحددة الحالية
    const currentCity = selectedCity ? selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1) : 'Your Destination';
    const trustedSources = selectedCity ? getEventSources(selectedCity) : [];

    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        showEventsModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-purple-900' : 'bg-gradient-to-br from-purple-50 to-pink-100'} border ${darkMode ? 'border-purple-500/30' : 'border-purple-400/30'} rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`${currentTheme.text.primary} font-semibold text-xl`}>Event Resources for {currentCity}</h3>
              <p className={`${currentTheme.text.tertiary} text-sm`}>Browse trusted sources to find amazing events</p>
            </div>
            <button 
              onClick={() => setShowEventsModal(false)}
              className={`p-2 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-200/50 hover:bg-gray-300/50'} rounded-lg ${currentTheme.text.tertiary} ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Trusted Sources Section */}
          {selectedCity && (
            <div className="space-y-4">
              <h4 className={`${currentTheme.text.primary} font-medium mb-3 flex items-center gap-2`}>
                <Globe className="w-5 h-5 text-blue-400" />
                Trusted Event Sources for {currentCity}
              </h4>
              <div className="space-y-3">
                {trustedSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-4 ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'} rounded-xl border ${darkMode ? 'border-gray-700/50 hover:border-blue-500/30' : 'border-gray-300/50 hover:border-blue-400/30'} transition-all ${darkMode ? 'hover:bg-gray-700/40' : 'hover:bg-gray-200/50'} group`}
                  >
                    <span className="text-2xl">{source.icon}</span>
                    <div className="flex-1">
                      <div className={`${currentTheme.text.primary} font-semibold group-hover:text-blue-300 transition-colors`}>
                        {source.name}
                      </div>
                      <div className={`${currentTheme.text.tertiary} text-sm mt-1`}>{source.description}</div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </a>
                ))}
              </div>
              <p className={`${currentTheme.text.tertiary} text-sm mt-4 text-center`}>
                💡 Click on any source to browse events and activities in {currentCity}
              </p>
            </div>
          )}

          {!selectedCity && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className={`${currentTheme.text.secondary} text-lg`}>No city selected</p>
              <p className={`${currentTheme.text.tertiary} text-sm mt-1`}>Ask about a city first to see event resources</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // DESTINATIONS DATABASE
  // قاعدة بيانات المدن
  // ==========================================
  const destinations = {
    'dubai': {
      weather: 'https://www.google.com/search?q=weather+dubai',
      bestTime: 'November to March (cooler weather)',
      attractions: [
        { name: 'Burj Khalifa', rating: 4.8, description: 'The world\'s tallest building' },
        { name: 'Dubai Fountain', rating: 4.7, description: 'Spectacular water show' },
        { name: 'Dubai Mall', rating: 4.6, description: 'World\'s largest shopping mall' }
      ],
      restaurants: [
        { name: 'At.mosphere', rating: 4.5, cuisine: 'International', price: '$$$$', location: 'https://www.google.com/maps/search/At.mosphere+Burj+Khalifa+Dubai' },
        { name: 'Pierchic', rating: 4.7, cuisine: 'Seafood', price: '$$$', location: 'https://www.google.com/maps/search/Pierchic+Restaurant+Dubai' },
        { name: 'Al Nafoorah', rating: 4.6, cuisine: 'Lebanese', price: '$$', location: 'https://www.google.com/maps/search/Al+Nafoorah+Restaurant+Dubai' }
      ],
      hotels: [
        { name: 'Burj Al Arab', rating: 4.9, price: '$800-2000/night', location: 'https://www.google.com/maps/search/Burj+Al+Arab+Hotel+Dubai' },
        { name: 'Atlantis The Palm', rating: 4.7, price: '$400-800/night', location: 'https://www.google.com/maps/search/Atlantis+The+Palm+Dubai' },
        { name: 'Armani Hotel Dubai', rating: 4.8, price: '$500-1000/night', location: 'https://www.google.com/maps/search/Armani+Hotel+Dubai+Burj+Khalifa' }
      ]
    },
    'paris': {
      weather: 'https://www.google.com/search?q=weather+paris',
      bestTime: 'April to June, September to October',
      attractions: [
        { name: 'Eiffel Tower', rating: 4.8, description: 'Iconic iron tower' },
        { name: 'Louvre Museum', rating: 4.7, description: 'World\'s largest art museum' },
        { name: 'Arc de Triomphe', rating: 4.6, description: 'Historic monument' }
      ],
      restaurants: [
        { name: 'Le Jules Verne', rating: 4.6, cuisine: 'French Fine Dining', price: '$$$$', location: 'https://www.google.com/maps/search/Le+Jules+Verne+Paris+Eiffel+Tower' },
        { name: 'L\'Astrance', rating: 4.8, cuisine: 'Contemporary French', price: '$$$$', location: 'https://www.google.com/maps/search/L+Astrance+Restaurant+Paris' },
        { name: 'Café de Flore', rating: 4.5, cuisine: 'French Café', price: '$$', location: 'https://www.google.com/maps/search/Cafe+de+Flore+Paris' }
      ],
      hotels: [
        { name: 'Ritz Paris', rating: 4.9, price: '$900-2500/night', location: 'https://www.google.com/maps/search/Ritz+Paris+Hotel' },
        { name: 'Le Meurice', rating: 4.8, price: '$700-1500/night', location: 'https://www.google.com/maps/search/Le+Meurice+Hotel+Paris' },
        { name: 'Plaza Athénée', rating: 4.8, price: '$800-2000/night', location: 'https://www.google.com/maps/search/Plaza+Athenee+Hotel+Paris' }
      ]
    },
    'istanbul': {
      weather: 'https://www.google.com/search?q=weather+istanbul',
      bestTime: 'March to May, September to November',
      attractions: [
        { name: 'Hagia Sophia', rating: 4.8, description: 'Byzantine architectural marvel' },
        { name: 'Blue Mosque', rating: 4.7, description: 'Historic Ottoman mosque' },
        { name: 'Topkapi Palace', rating: 4.6, description: 'Ottoman sultans\' palace' }
      ],
      restaurants: [
        { name: 'Mikla', rating: 4.7, cuisine: 'Modern Turkish', price: '$$$', location: 'https://www.google.com/maps/search/Mikla+Restaurant+Istanbul' },
        { name: 'Nusr-Et Steakhouse', rating: 4.6, cuisine: 'Steakhouse', price: '$$$$', location: 'https://www.google.com/maps/search/Nusr+Et+Steakhouse+Istanbul' },
        { name: 'Pandeli', rating: 4.5, cuisine: 'Traditional Turkish', price: '$$', location: 'https://www.google.com/maps/search/Pandeli+Restaurant+Istanbul' }
      ],
      hotels: [
        { name: 'Four Seasons Istanbul', rating: 4.8, price: '$400-900/night', location: 'https://www.google.com/maps/search/Four+Seasons+Hotel+Istanbul+Sultanahmet' },
        { name: 'Çırağan Palace', rating: 4.9, price: '$500-1200/night', location: 'https://www.google.com/maps/search/Ciragan+Palace+Hotel+Istanbul' },
        { name: 'Pera Palace Hotel', rating: 4.7, price: '$300-600/night', location: 'https://www.google.com/maps/search/Pera+Palace+Hotel+Istanbul' }
      ]
    },
    'london': {
      weather: 'https://www.google.com/search?q=weather+london',
      bestTime: 'Late May to September',
      attractions: [
        { name: 'Big Ben', rating: 4.7, description: 'Iconic clock tower' },
        { name: 'British Museum', rating: 4.8, description: 'World history museum' },
        { name: 'Tower Bridge', rating: 4.6, description: 'Famous bascule bridge' }
      ],
      restaurants: [
        { name: 'The Ledbury', rating: 4.8, cuisine: 'Modern European', price: '$$$$', location: 'https://www.google.com/maps/search/The+Ledbury+Restaurant+London' },
        { name: 'Dishoom', rating: 4.7, cuisine: 'Indian', price: '$$', location: 'https://www.google.com/maps/search/Dishoom+Restaurant+London' },
        { name: 'Sketch', rating: 4.6, cuisine: 'Contemporary', price: '$$$', location: 'https://www.google.com/maps/search/Sketch+Restaurant+London' }
      ],
      hotels: [
        { name: 'The Savoy', rating: 4.9, price: '$600-1800/night', location: 'https://www.google.com/maps/search/The+Savoy+Hotel+London' },
        { name: 'Claridge\'s', rating: 4.8, price: '$700-2000/night', location: 'https://www.google.com/maps/search/Claridges+Hotel+London' },
        { name: 'The Ritz London', rating: 4.9, price: '$800-2500/night', location: 'https://www.google.com/maps/search/The+Ritz+London+Hotel' }
      ]
    },
    'new york': {
      weather: 'https://www.google.com/search?q=weather+new+york',
      bestTime: 'April to June, September to November',
      attractions: [
        { name: 'Statue of Liberty', rating: 4.8, description: 'Iconic American symbol' },
        { name: 'Central Park', rating: 4.7, description: 'Urban green oasis' },
        { name: 'Empire State Building', rating: 4.6, description: 'Art Deco skyscraper' }
      ],
      restaurants: [
        { name: 'Eleven Madison Park', rating: 4.9, cuisine: 'Contemporary American', price: '$$$$', location: 'https://www.google.com/maps/search/Eleven+Madison+Park+New+York' },
        { name: 'Le Bernardin', rating: 4.8, cuisine: 'French Seafood', price: '$$$$', location: 'https://www.google.com/maps/search/Le+Bernardin+Restaurant+NY' },
        { name: 'Katz\'s Delicatessen', rating: 4.6, cuisine: 'Deli', price: '$$', location: 'https://www.google.com/maps/search/Katz+Delicatessen+New+York' }
      ],
      hotels: [
        { name: 'The Plaza Hotel', rating: 4.8, price: '$700-2000/night', location: 'https://www.google.com/maps/search/The+Plaza+Hotel+New+York' },
        { name: 'The St. Regis New York', rating: 4.9, price: '$800-2500/night', location: 'https://www.google.com/maps/search/St+Regis+Hotel+New+York' },
        { name: 'Park Hyatt New York', rating: 4.7, price: '$600-1500/night', location: 'https://www.google.com/maps/search/Park+Hyatt+New+York' }
      ]
    },
    'netherlands': {
      weather: 'https://www.google.com/search?q=weather+amsterdam',
      bestTime: 'April to May, September to October',
      attractions: [
        { name: 'Rijksmuseum', rating: 4.7, description: 'Dutch national museum in Amsterdam' },
        { name: 'Anne Frank House', rating: 4.6, description: 'Historic house and museum' },
        { name: 'Van Gogh Museum', rating: 4.8, description: 'Art museum dedicated to Van Gogh' }
      ],
      restaurants: [
        { name: 'Restaurant Bougainville', rating: 4.7, cuisine: 'French', price: '$$$$', location: 'https://www.google.com/maps/search/Restaurant+Bougainville+Amsterdam' },
        { name: 'The Seafood Bar', rating: 4.5, cuisine: 'Seafood', price: '$$$', location: 'https://www.google.com/maps/search/The+Seafood+Bar+Amsterdam' },
        { name: 'Foodhallen', rating: 4.4, cuisine: 'International', price: '$$', location: 'https://www.google.com/maps/search/Foodhallen+Amsterdam' }
      ],
      hotels: [
        { name: 'Waldorf Astoria Amsterdam', rating: 4.8, price: '$400-900/night', location: 'https://www.google.com/maps/search/Waldorf+Astoria+Amsterdam' },
        { name: 'Conservatorium Hotel', rating: 4.9, price: '$450-1000/night', location: 'https://www.google.com/maps/search/Conservatorium+Hotel+Amsterdam' },
        { name: 'Pulitzer Amsterdam', rating: 4.7, price: '$300-600/night', location: 'https://www.google.com/maps/search/Pulitzer+Hotel+Amsterdam' }
      ]
    },
    'germany': {
      weather: 'https://www.google.com/search?q=weather+berlin',
      bestTime: 'May to September',
      attractions: [
        { name: 'Brandenburg Gate', rating: 4.7, description: '18th-century neoclassical monument' },
        { name: 'Neuschwanstein Castle', rating: 4.8, description: '19th-century palace in Bavaria' },
        { name: 'Cologne Cathedral', rating: 4.8, description: 'Gothic cathedral in Cologne' }
      ],
      restaurants: [
        { name: 'Facil Restaurant', rating: 4.7, cuisine: 'Modern German', price: '$$$$', location: 'https://www.google.com/maps/search/Facil+Restaurant+Berlin' },
        { name: 'Borough', rating: 4.6, cuisine: 'International', price: '$$$', location: 'https://www.google.com/maps/search/Borough+Restaurant+Berlin' },
        { name: 'Curry 36', rating: 4.5, cuisine: 'German Fast Food', price: '$', location: 'https://www.google.com/maps/search/Curry+36+Berlin' }
      ],
      hotels: [
        { name: 'Hotel Adlon Kempinski', rating: 4.8, price: '$350-800/night', location: 'https://www.google.com/maps/search/Hotel+Adlon+Kempinski+Berlin' },
        { name: 'The Ritz-Carlton Berlin', rating: 4.9, price: '$400-900/night', location: 'https://www.google.com/maps/search/Ritz+Carlton+Berlin' },
        { name: 'Mandarin Oriental Munich', rating: 4.8, price: '$380-850/night', location: 'https://www.google.com/maps/search/Mandarin+Oriental+Munich' }
      ]
    },
    'syria': {
      weather: 'https://www.google.com/search?q=weather+damascus',
      bestTime: 'March to May, September to November',
      attractions: [
        { name: 'Umayyad Mosque', rating: 4.9, description: 'One of the largest and oldest mosques in the world' },
        { name: 'Crac des Chevaliers', rating: 4.8, description: 'Medieval Crusader castle' },
        { name: 'Ancient City of Aleppo', rating: 4.7, description: 'Historic UNESCO World Heritage site' }
      ],
      restaurants: [
        { name: 'Naranj Restaurant', rating: 4.6, cuisine: 'Syrian Traditional', price: '$$', location: 'https://www.google.com/maps/search/Naranj+Restaurant+Damascus' },
        { name: 'Beit Jabri', rating: 4.7, cuisine: 'Syrian & Lebanese', price: '$$$', location: 'https://www.google.com/maps/search/Beit+Jabri+Damascus' },
        { name: 'Abu al-Ezz', rating: 4.5, cuisine: 'Traditional Syrian', price: '$$', location: 'https://www.google.com/maps/search/Abu+al+Ezz+Restaurant+Syria' }
      ],
      hotels: [
        { name: 'Four Seasons Damascus', rating: 4.8, price: '$200-500/night', location: 'https://www.google.com/maps/search/Four+Seasons+Damascus' },
        { name: 'Cham Palace Damascus', rating: 4.6, price: '$150-350/night', location: 'https://www.google.com/maps/search/Cham+Palace+Damascus' },
        { name: 'Beit Al Mamlouka', rating: 4.7, price: '$100-250/night', location: 'https://www.google.com/maps/search/Beit+Al+Mamlouka+Damascus' }
      ]
    },
    'makkah': {
      weather: 'https://www.google.com/search?q=weather+makkah',
      bestTime: 'November to February (cooler), avoid summer heat',
      attractions: [
        { name: 'Masjid al-Haram', rating: 5.0, description: 'The Great Mosque of Mecca - Holiest site in Islam' },
        { name: 'Kaaba', rating: 5.0, description: 'House of Allah - Qibla for Muslims worldwide' },
        { name: 'Mount Arafat', rating: 4.9, description: 'Site of Hajj pilgrimage standing' }
      ],
      restaurants: [
        { name: 'Al Baik', rating: 4.8, cuisine: 'Fast Food', price: '$', location: 'https://www.google.com/maps/search/Al+Baik+Makkah' },
        { name: 'Makkah Restaurant', rating: 4.5, cuisine: 'Arabic', price: '$$', location: 'https://www.google.com/maps/search/Makkah+Restaurant' },
        { name: 'The Royal Clock Tower Restaurant', rating: 4.6, cuisine: 'International', price: '$$$', location: 'https://www.google.com/maps/search/Royal+Clock+Tower+Restaurant+Makkah' }
      ],
      hotels: [
        { name: 'Fairmont Makkah', rating: 4.8, price: '$200-600/night', location: 'https://www.google.com/maps/search/Fairmont+Makkah+Hotel' },
        { name: 'Swissôtel Makkah', rating: 4.7, price: '$180-500/night', location: 'https://www.google.com/maps/search/Swissotel+Makkah' },
        { name: 'Raffles Makkah', rating: 4.9, price: '$300-800/night', location: 'https://www.google.com/maps/search/Raffles+Makkah+Hotel' }
      ]
    },
    'egypt': {
      weather: 'https://www.google.com/search?q=weather+cairo',
      bestTime: 'October to April (mild weather)',
      attractions: [
        { name: 'Pyramids of Giza', rating: 4.9, description: 'Ancient wonders of the world' },
        { name: 'Luxor Temple', rating: 4.8, description: 'Ancient Egyptian temple complex' },
        { name: 'Karnak Temple', rating: 4.7, description: 'Vast ancient temple complex' }
      ],
      restaurants: [
        { name: 'Abou El Sid', rating: 4.6, cuisine: 'Egyptian Traditional', price: '$$', location: 'https://www.google.com/maps/search/Abou+El+Sid+Restaurant+Cairo' },
        { name: 'Sequoia', rating: 4.7, cuisine: 'Mediterranean', price: '$$$', location: 'https://www.google.com/maps/search/Sequoia+Restaurant+Cairo' },
        { name: 'Kazoku', rating: 4.5, cuisine: 'Japanese', price: '$$$', location: 'https://www.google.com/maps/search/Kazoku+Restaurant+Cairo' }
      ],
      hotels: [
        { name: 'Four Seasons Cairo', rating: 4.8, price: '$250-600/night', location: 'https://www.google.com/maps/search/Four+Seasons+Cairo+Nile+Plaza' },
        { name: 'The Nile Ritz-Carlton', rating: 4.9, price: '$300-700/night', location: 'https://www.google.com/maps/search/Nile+Ritz+Carlton+Cairo' },
        { name: 'Kempinski Nile Hotel', rating: 4.7, price: '$200-500/night', location: 'https://www.google.com/maps/search/Kempinski+Nile+Hotel+Cairo' }
      ]
    },
    'riyadh': {
      weather: 'https://www.google.com/search?q=weather+riyadh',
      bestTime: 'November to March (cooler weather)',
      attractions: [
        { name: 'Kingdom Centre', rating: 4.7, description: 'Iconic skyscraper with sky bridge' },
        { name: 'Al Masmak Palace', rating: 4.6, description: 'Historic clay and mud-brick fort' },
        { name: 'Riyadh Front', rating: 4.5, description: 'Modern entertainment destination' }
      ],
      restaurants: [
        { name: 'The Globe', rating: 4.7, cuisine: 'International', price: '$$$$', location: 'https://www.google.com/maps/search/The+Globe+Restaurant+Riyadh' },
        { name: 'Najd Village', rating: 4.6, cuisine: 'Traditional Saudi', price: '$$', location: 'https://www.google.com/maps/search/Najd+Village+Restaurant+Riyadh' },
        { name: 'Spazio', rating: 4.5, cuisine: 'Italian', price: '$$$', location: 'https://www.google.com/maps/search/Spazio+Riyadh' }
      ],
      hotels: [
        { name: 'Ritz-Carlton Riyadh', rating: 4.8, price: '$300-800/night', location: 'https://www.google.com/maps/search/Ritz+Carlton+Riyadh' },
        { name: 'Four Seasons Riyadh', rating: 4.9, price: '$400-1000/night', location: 'https://www.google.com/maps/search/Four+Seasons+Riyadh' },
        { name: 'Al Faisaliah Hotel', rating: 4.7, price: '$250-600/night', location: 'https://www.google.com/maps/search/Al+Faisaliah+Hotel+Riyadh' }
      ]
    }
  };

  // ==========================================
  // HELPER FUNCTIONS
  // الدوال المساعدة
  // ==========================================
  
  const findDestination = (text) => {
    const normalizedText = text.toLowerCase().trim();
    
    // قائمة المدن المدعومة
    const supportedCities = [
      'dubai', 'paris', 'istanbul', 'london', 'new york', 
      'netherlands', 'germany', 'syria', 'makkah', 'egypt', 'riyadh'
    ];

    // بحث أكثر دقة في النص
    for (const city of supportedCities) {
      // البحث عن المدينة في النص مع مراعاة الاختلافات
      const cityPattern = new RegExp(`\\b${city}\\b|about ${city}|visit ${city}|travel to ${city}`, 'i');
      if (cityPattern.test(normalizedText)) {
        return { city, data: destinations[city] };
      }
    }

    // محاولة ثانية: البحث الجزئي
    for (const city of supportedCities) {
      if (normalizedText.includes(city)) {
        return { city, data: destinations[city] };
      }
    }

    return null;
  };

  const generateResponse = async (userMessage) => {
    const destination = findDestination(userMessage);
    
    if (!destination) {
      // ✅ تحديث حالة الأفاتار إلى حزين فوراً
      setAvatarMood('sad');
      
      return {
        type: 'assistant',
        content: `${getFriendlyErrorMessage()}\n\n**Available destinations:**\n• Dubai\n• Paris\n• Istanbul\n• London\n• New York\n• Netherlands\n• Germany\n• Syria\n• Makkah\n• Egypt\n• Riyadh\n\nTry one of these cities! Or ask me about travel tips in general. 🌍`,
        timestamp: new Date(),
        isError: true
      };
    }

    const { city, data } = destination;
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    
    // ✅ عرض رسالة تشجيعية أثناء المعالجة
    setAvatarMood('excited');
    setSelectedCity(city);
    
    // تحديث تفضيلات المستخدم
    updateUserPreferences({
      type: 'DESTINATION_SELECTION',
      data: city
    });
    
    // جلب الأحداث للمدينة المختارة
    await fetchEventsForCity(city);
    
    // ✅ تأخير بسيط لمحاكاة التفكير
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let response = `**Your Complete Guide to ${cityName}** 🌟\n\n`;
    
    response += `**🌤️ Weather & Best Time to Visit**\n\n`;
    response += `📅 Best Time: ${data.bestTime}\n`;
    response += `🌡️ [Check Current Weather](${data.weather})\n\n`;
    
    response += `**🎯 Top Attractions**\n\n`;
    data.attractions.forEach((place, idx) => {
      response += `${idx + 1}. **${place.name}**\n`;
      response += `   ⭐ ${place.rating}/5 • ${place.description}\n\n`;
    });
    
    response += `**🍽️ Best Restaurants**\n\n`;
    data.restaurants.forEach((restaurant, idx) => {
      response += `${idx + 1}. **${restaurant.name}**\n`;
      response += `   ⭐ ${restaurant.rating}/5 • ${restaurant.cuisine} • ${restaurant.price}\n`;
      response += `   📍 [View on Google Maps](${restaurant.location})\n\n`;
    });
    
    response += `**🏨 Top Hotels**\n\n`;
    data.hotels.forEach((hotel, idx) => {
      response += `${idx + 1}. **${hotel.name}**\n`;
      response += `   ⭐ ${hotel.rating}/5 • ${hotel.price}\n`;
      response += `   📍 [View on Google Maps](${hotel.location})\n\n`;
    });

    // إضافة قسم مصادر الأحداث
    const eventSources = getEventSources(city);
    if (eventSources.length > 0) {
      response += `\n💫 **Looking for events?** Use the "Browse Event Resources" button below to discover amazing activities in ${cityName}!\n\n`;
    }
    
    response += `💡 **Tip:** Click on "View on Google Maps" to see the exact location and get directions!\n\n`;
    response += `💰 **Want a personalized budget plan?** Click the "Plan Budget" button below!\n\n`;
    response += `⚡ **Compare destinations?** Use the "Golden Comparison" feature below!\n\n`;
    response += `🤖 **Want personalized recommendations?** Try our Smart Recommendations feature!`;

    // ✅ تحديث حالة الأفاتار إلى ودود بعد الانتهاء
    setTimeout(() => setAvatarMood('friendly'), 500);

    return {
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      destination: city,
      showBudgetButton: true,
      showEvents: eventSources.length > 0,
      showComparison: true,
      showRecommendations: true
    };
  };

  const formatMessageContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={idx} className="font-semibold text-blue-300 mb-2 mt-3">{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <div key={idx} className="mb-1">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className={currentTheme.text.primary}>{part}</strong> : <span className={currentTheme.text.secondary}>{part}</span>)}
          </div>
        );
      }
      
      if (line.includes('📍 [View on Google Maps](')) {
        const linkMatch = line.match(/📍 \[View on Google Maps\]\((.*?)\)/);
        if (linkMatch) {
          const url = linkMatch[1];
          return (
            <div key={idx} className={`mb-1 ${currentTheme.text.secondary} flex items-center gap-2`}>
              <MapPin className="w-3 h-3 text-blue-400" />
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                View on Google Maps
              </a>
            </div>
          );
        }
      }
      
      if (line.includes('🌡️ [Check Current Weather](')) {
        const linkMatch = line.match(/🌡️ \[Check Current Weather\]\((.*?)\)/);
        if (linkMatch) {
          const url = linkMatch[1];
          return (
            <div key={idx} className={`mb-2 ${currentTheme.text.secondary} flex items-center gap-2`}>
              <Cloud className="w-4 h-4 text-sky-400 animate-pulse" />
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 underline font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                Check Current Weather
              </a>
            </div>
          );
        }
      }
      
      // تنسيق روابط مصادر الأحداث
      if (line.includes('**[') && line.includes(']**(')) {
        const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const linkText = linkMatch[1];
          const url = linkMatch[2];
          return (
            <div key={idx} className={`mb-1 ${currentTheme.text.secondary} flex items-center gap-2`}>
              <ExternalLink className="w-3 h-3 text-purple-400" />
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
              >
                {linkText}
              </a>
            </div>
          );
        }
      }
      
      if (line.trim().startsWith('•')) {
        return <div key={idx} className={`mb-1 ${currentTheme.text.secondary} ml-4`}>{line}</div>;
      }
      
      if (line.trim().startsWith('💫')) {
        return <div key={idx} className="mb-1 text-yellow-300 font-semibold">{line}</div>;
      }
      
      if (line.trim()) {
        return <div key={idx} className={`mb-1 ${currentTheme.text.secondary}`}>{line}</div>;
      }
      
      return <div key={idx} className="h-2" />;
    });
  };

  // ==========================================
  // VOICE HANDLING FUNCTIONS
  // دوال التعامل مع الصوت
  // ==========================================

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/\n/g, '. ')
      .replace(/•/g, '.')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAvatarMood('excited');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAvatarMood('friendly');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setAvatarMood('friendly');
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAvatarMood('friendly');
    }
  };

  const toggleSpeaking = (messageContent) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(messageContent);
    }
  };

  // ==========================================
  // BUDGET PLANNING FUNCTIONS
  // دوال تخطيط الميزانية
  // ==========================================

  const handleBudgetClick = () => {
    setAvatarMood('excited');
    setShowBudgetModal(true);
    // رسالة ودية عند فتح البودجت
    const budgetMessages = [
      "💰 Let's create the perfect budget for your trip!",
      "🎯 Time to plan your spending smartly!",
      "✨ Budget planning made easy!"
    ];
    console.log(budgetMessages[Math.floor(Math.random() * budgetMessages.length)]);
  };

  const calculateBudgetPlan = () => {
    if (!budget || !selectedCity) return null;

    const budgetNum = parseFloat(budget);
    const city = selectedCity;
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);

    const accommodation = budgetNum * 0.40;
    const food = budgetNum * 0.30;
    const activities = budgetNum * 0.20;
    const transport = budgetNum * 0.10;

    let response = `**💰 Your Personalized Budget Plan for ${cityName}**\n\n`;
    response += `**Total Budget: ${budgetNum.toLocaleString()}**\n\n`;
    response += `**Budget Breakdown:**\n\n`;
    response += `🏨 **Accommodation (40%):** ${accommodation.toLocaleString()}\n`;
    response += `   • Recommended: Mid-range to luxury hotels\n`;
    response += `   • Duration: ${Math.floor(accommodation / 150)}-${Math.floor(accommodation / 100)} nights\n\n`;
    response += `🍽️ **Food & Dining (30%):** ${food.toLocaleString()}\n`;
    response += `   • ${Math.floor(food / 50)} restaurant meals\n`;
    response += `   • Mix of fine dining and local cuisine\n\n`;
    response += `🎯 **Activities & Tours (20%):** ${activities.toLocaleString()}\n`;
    response += `   • Entry tickets to attractions\n`;
    response += `   • Guided tours and experiences\n\n`;
    response += `🚗 **Transportation (10%):** ${transport.toLocaleString()}\n`;
    response += `   • Local taxis and transport\n`;
    response += `   • Airport transfers\n\n`;

    if (budgetNum < 1000) {
      response += `💡 **Budget Travel Tips:**\n`;
      response += `• Choose budget-friendly accommodations\n`;
      response += `• Try local street food\n`;
      response += `• Use public transportation\n`;
      response += `• Look for free attractions\n`;
    } else if (budgetNum < 3000) {
      response += `💡 **Comfortable Travel Tips:**\n`;
      response += `• Book 3-4 star hotels\n`;
      response += `• Mix of restaurants and cafes\n`;
      response += `• Combine taxis and public transport\n`;
      response += `• Enjoy popular attractions\n`;
    } else {
      response += `💡 **Luxury Travel Tips:**\n`;
      response += `• Stay at 5-star hotels\n`;
      response += `• Fine dining experiences\n`;
      response += `• Private transfers and tours\n`;
      response += `• VIP access to attractions\n`;
    }

    return {
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      budgetData: {
        total: budgetNum,
        accommodation,
        food,
        activities,
        transport
      }
    };
  };

  const handleBudgetSubmit = () => {
    if (!budget) return;

    const budgetPlan = calculateBudgetPlan();
    if (budgetPlan) {
      setMessages(prev => [...prev, budgetPlan]);
      setShowBudgetModal(false);
      setBudget('');
    }
  };

  // ==========================================
  // MESSAGE HANDLING FUNCTIONS
  // دوال معالجة الرسائل
  // ==========================================

  const handleSend = async () => {
    if (!input.trim()) return;

    // إذا لم تكن هناك محادثة حالية، أنشئ واحدة جديدة
    if (!currentChatId) {
      createNewChat();
    }

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    // ✅ التحقق أولاً: هل الرسالة تحتوي على اسم مدينة؟
    const containsDestination = findDestination(input);
    
    // إذا كانت الرسالة عن مدينة، تجاوز الرسائل التفاعلية وأعطِ التفاصيل مباشرة
    if (containsDestination) {
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);
      updateAvatarMoodByAction('excited');
      stopListening();

      setTimeout(async () => {
        try {
          const botResponse = await generateResponse(input);
          setMessages(prev => [...prev, botResponse]);
          
          if (!botResponse.isError && botResponse.destination) {
            setSelectedCity(botResponse.destination);
          }
          
        } catch (error) {
          console.error('Error generating response:', error);
          setAvatarMood('sad');
          
          const errorMessage = {
            type: 'assistant',
            content: "I'm having trouble processing your request. Please try again. 😢",
            timestamp: new Date(),
            isError: true
          };
          setMessages(prev => [...prev, errorMessage]);
          
        } finally {
          setIsTyping(false);
          setTimeout(() => setAvatarMood('friendly'), 7000);
        }
      }, 1200);
      return;
    }

    // ✅ إذا لم تكن عن مدينة، تحقق من الرسائل التفاعلية الذكية
    const smartResponse = getSmartResponse(input);
    
    const messagesToAdd = [userMessage];
    if (smartResponse) {
      messagesToAdd.push({
        type: 'assistant',
        content: `${smartResponse.emoji} ${smartResponse.message}`,
        timestamp: new Date(),
        isQuickReply: true
      });
    }

    setMessages(prev => [...prev, ...messagesToAdd]);
    setInput('');
    
    // إذا كانت رسالة تفاعلية ذكية، لا نستدعي generateResponse
    if (smartResponse) {
      setAvatarMood('happy');
      stopListening();
      return;
    }

    setIsTyping(true);
    updateAvatarMoodByAction('excited');
    stopListening();

    setTimeout(async () => {
      try {
        const botResponse = await generateResponse(input);
        setMessages(prev => [...prev, botResponse]);
        
        if (!botResponse.isError && botResponse.destination) {
          setSelectedCity(botResponse.destination);
        }
        
      } catch (error) {
        console.error('Error generating response:', error);
        setAvatarMood('sad');
        
        const errorMessage = {
          type: 'assistant',
          content: "I'm having trouble processing your request. Please try again. 😢",
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
        
      } finally {
        setIsTyping(false);
        setTimeout(() => setAvatarMood('friendly'), 7000);
      }
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };



  // ==========================================
  // VOICE FEATURE COMPONENTS
  // مكونات ميزة الصوت
  // ==========================================

  const VoiceButton = () => (
    <button
      onClick={isListening ? stopListening : startListening}
      disabled={!voiceSupported}
      className={`voice-button p-3 rounded-xl transition-all duration-300 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : `${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-200/50 hover:bg-gray-300/50'} ${currentTheme.text.secondary}`
      } ${!voiceSupported && 'opacity-50 cursor-not-allowed'}`}
      title={voiceSupported ? (isListening ? 'Stop listening' : 'Start voice input') : 'Voice not supported'}
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );

  const SpeechButton = ({ content }) => (
    <button
      onClick={() => toggleSpeaking(content)}
      className={`voice-button p-2 rounded-lg transition-all duration-300 ${
        isSpeaking 
          ? 'bg-orange-500 hover:bg-orange-600 text-white' 
          : `${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-200/50 hover:bg-gray-300/50'} ${currentTheme.text.secondary}`
      }`}
      title={isSpeaking ? 'Stop speaking' : 'Speak this message'}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </button>
  );

  // ==========================================
  // SCROLL TO BOTTOM FUNCTION
  // دالة التمرير للأسفل
  // ==========================================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatHistory, currentChatId]);



  // ==========================================
  // MAIN RENDER
  // العرض الرئيسي
  // ==========================================
  return (
    <div className={`min-h-screen ${currentTheme.background} relative`}>
      
      {/* CSS للأنيميشن */}
      <style>{`
        /* أنيميشن نبض الكيرسور */
        @keyframes cursorPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 0 0 10px rgba(147, 51, 234, 0);
          }
        }
        
        /* أنيميشن دوران الكيرسور */
        @keyframes cursorRotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        /* أنيميشن نبض الكيرسور الداخلي */
        @keyframes innerCursorPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
          }
        }

        /* 🎭 أنيميشن الأفاتار الجديدة */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.8); }
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
        }

        @keyframes speaking {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.6); }
        }

        @keyframes typing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes waveHand {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }

        /* تعابير العيون */
        .happy-eyes { animation: happyEyes 0.5s ease-in-out; }
        .thinking-eyes { animation: thinkingEyes 1s ease-in-out infinite; }
        .excited-eyes { animation: excitedEyes 0.3s ease-in-out infinite; }
        .friendly-eyes { animation: friendlyEyes 2s ease-in-out infinite; }
        .listening-eyes { animation: listeningEyes 0.5s ease-in-out infinite; }
        .confused-eyes { animation: confusedEyes 1s ease-in-out infinite; }
        .sad-eyes { animation: sadEyes 2s ease-in-out infinite; }

        /* تعابير الفم */
        .happy-mouth { animation: happyMouth 0.5s ease-in-out; }
        .thinking-mouth { animation: thinkingMouth 2s ease-in-out infinite; }
        .excited-mouth { animation: excitedMouth 0.4s ease-in-out infinite; }
        .friendly-mouth { animation: friendlyMouth 3s ease-in-out infinite; }
        .listening-mouth { animation: listeningMouth 0.3s ease-in-out infinite; }
        .confused-mouth { animation: confusedMouth 1s ease-in-out infinite; }
        .sad-mouth { animation: sadMouth 2s ease-in-out infinite; }

        /* تعابير الحواجب */
        .happy-eyebrows { transform: translateY(0); }
        .thinking-eyebrows { animation: thinkingEyebrows 2s ease-in-out infinite; }
        .excited-eyebrows { transform: translateY(-1px); }
        .friendly-eyebrows { transform: translateY(0); }
        .listening-eyebrows { animation: listeningEyebrows 0.5s ease-in-out infinite; }
        .confused-eyebrows { animation: confusedEyebrows 1s ease-in-out infinite; }
        .sad-eyebrows { animation: sadEyebrows 2s ease-in-out infinite; }

        @keyframes happyEyes {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.8); }
        }

        @keyframes thinkingEyes {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }

        @keyframes excitedEyes {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes friendlyEyes {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.9); }
        }

        @keyframes listeningEyes {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes confusedEyes {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }

        @keyframes sadEyes {
          0%, 100% { transform: scaleY(0.8); }
          50% { transform: scaleY(0.6); }
        }

        @keyframes happyMouth {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.1); }
        }

        @keyframes thinkingMouth {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(1px) rotate(1deg); }
        }

        @keyframes excitedMouth {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        @keyframes friendlyMouth {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.05); }
        }

        @keyframes listeningMouth {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.3); }
        }

        @keyframes confusedMouth {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes sadMouth {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(1px); }
        }

        @keyframes thinkingEyebrows {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }

        @keyframes listeningEyebrows {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        @keyframes confusedEyebrows {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-1px) rotate(5deg); }
          75% { transform: translateY(-1px) rotate(-5deg); }
        }

        @keyframes sadEyebrows {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(1px) rotate(5deg); }
        }
        
        /* الكيرسور الخارجي */
        .custom-cursor-outer {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(59, 130, 246, 0.8);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 10000;
          mix-blend-mode: none;
          transform: translate(-50%, -50%);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation: cursorRotate 4s linear infinite;
          backdrop-filter: invert(2);
        }
        
        /* الكيرسور الداخلي */
        .custom-cursor-inner {
          width: 8px;
          height: 8px;
          background: rgba(59, 130, 246, 0.7);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 10001;
          mix-blend-mode: difference;
          transform: translate(-50%, -50%);
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation: innerCursorPulse 2s ease-in-out infinite;
        }
        
        /* إخفاء الكيرسور الافتراضي */
        * {
          cursor: none !important;
        }
        
        /* إظهار الكيرسور الافتراضي على الموبايل */
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
          .custom-cursor-outer,
          .custom-cursor-inner {
            display: none;
          }
        }

        /* تأثيرات الخلفية الجديدة */
        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .floating-shape {
          position: absolute;
          background: linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 50%;
          animation: floatShape 20s infinite linear;
        }

        @keyframes floatShape {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(100px, 50px) rotate(90deg);
          }
          50% {
            transform: translate(50px, 100px) rotate(180deg);
          }
          75% {
            transform: translate(-50px, 50px) rotate(270deg);
          }
        }

        /* ✨ INTERACTIVE MESSAGE ANIMATIONS */
        /* تفاعلية رسائل الأنيميشن */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.4s ease-out forwards;
        }

        /* Animated button hover scale */
        .hover-scale-105:hover {
          transform: scale(1.05);
        }

        /* Pulse animation for assistant icons */
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Smooth message content animation */
        .text-animation {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      {/* تأثيرات الخلفية الجديدة */}
      <div className="floating-shapes">
        <div className="floating-shape" style={{ width: '200px', height: '200px', top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className="floating-shape" style={{ width: '150px', height: '150px', top: '60%', left: '80%', animationDelay: '5s' }}></div>
        <div className="floating-shape" style={{ width: '100px', height: '100px', top: '20%', left: '70%', animationDelay: '10s' }}></div>
        <div className="floating-shape" style={{ width: '120px', height: '120px', top: '80%', left: '20%', animationDelay: '15s' }}></div>
      </div>

      {/* نجوم متلألئة */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className={`absolute w-1 h-1 ${darkMode ? 'bg-white' : 'bg-gray-400'} rounded-full animate-pulse pointer-events-none`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.8 + 0.2,
            filter: 'blur(0.5px) brightness(1.8)',
            boxShadow: `0 0 8px ${darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(100, 100, 100, 0.8)'}`,
            zIndex: 0
          }}
        />
      ))}

      {/* الشريط الجانبي */}
      <Sidebar />

      {/* نافذة التوصيات الذكية */}
      <SmartRecommendationsModal />

      {/* نافذة المقارنة */}
      <ComparisonModal />

      {/* نافذة الأحداث */}
      <EventsModal />

      {/* نافذة تأكيد حذف الكل */}
      <DeleteAllConfirmationModal />

      {/* الحاوية الرئيسية */}
      <div className="relative z-10 flex flex-col">
        
{/* الرأس */}
<div className={`border-b ${darkMode ? 'border-purple-500/20' : 'border-purple-300/20'} backdrop-blur-sm ${darkMode ? 'bg-black/20' : 'bg-white/20'}`}>
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`p-2 ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-200/50'} rounded-lg ${currentTheme.text.tertiary} ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors lg:hidden`}
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Plane className="w-7 h-7 text-purple-400" />
          <Sparkles className="w-4 h-4 text-purple-300 absolute -top-1 -right-1" />
        </div>
        <div>
          <h3 className="text-lg font-bold md:text-xl lg:text-2xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 drop-shadow-lg">Wings AI</h3>
          <p className={`text-xs ${currentTheme.text.tertiary}`}>Your Intelligent Travel Assistant</p>
        </div>
      </div>
    </div>
    
    {/* زر Menu للشاشات الكبيرة - في أقصى اليمين */}
    <div className="flex items-center gap-5">
        {/* زر العودة الدائري */}
  <button
    onClick={() => window.location.href = '/'}
    className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center group"
    title="Back to Home"
  >
    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
  </button>
      {/* زر تبديل الثيم */}
      <button
        onClick={toggleDarkMode}
        className={`p-2 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-200/50 hover:bg-gray-300/50'} rounded-xl ${currentTheme.text.secondary} transition-all`}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-xl font-medium transition-all items-center gap-2"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  </div>
</div>
        

        {/* منطقة المحادثة */}
        <div className="flex-1 max-w-5xl w-full mx-auto flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
            {/* الرسائل */}
            {messages.map((message, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 animate-fade-in ${message.isQuickReply ? 'opacity-80' : ''}`}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`
                }}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`flex-1 ${message.type === 'user' ? 'ml-12' : ''}`}>
                  {message.type === 'user' && (
                    <div className={`text-sm ${currentTheme.text.tertiary} mb-1`}>You</div>
                  )}
                  <div className={`rounded-2xl p-4 transition-all duration-300 ${
                    message.type === 'user' 
                      ? `${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} backdrop-blur border ${darkMode ? 'border-gray-700/50' : 'border-gray-300/50'}` 
                      : 'bg-transparent'
                  } ${message.isQuickReply ? `${darkMode ? 'bg-purple-600/20 border-purple-500/30' : 'bg-purple-100/30 border-purple-400/30'}` : ''}`}
                  >
                    <div className="text-sm leading-relaxed">
                      {message.type === 'assistant' ? (
                        <>
                          {formatMessageContent(message.content)}
                          
                          {/* أزرار التحكم بالصوت للرسائل */}
                          <div className="flex gap-2 mt-3 flex-wrap">
                            <SpeechButton content={message.content} />
                            
                            {message.showBudgetButton && (
                              <button
                                onClick={handleBudgetClick}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                              >
                                <DollarSign className="w-4 h-4" />
                                Plan Budget
                              </button>
                            )}

                            {message.showEvents && (
                              <button
                                onClick={() => {
                                  setSelectedCity(message.destination);
                                  setShowEventsModal(true);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                              >
                                <Calendar className="w-4 h-4" />
                                Browse Event Resources
                              </button>
                            )}

                            {message.showComparison && (
                              <button
                                onClick={openComparisonModal}
                                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                              >
                                <GitCompare className="w-4 h-4" />
                                Golden Comparison
                              </button>
                            )}

                            {message.showRecommendations && (
                              <button
                                onClick={showSmartRecommendations}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                              >
                                <Zap className="w-4 h-4" />
                                Smart Recommendations
                              </button>
                            )}
                          </div>

                          {/* رسم بياني للميزانية */}
                          {message.budgetData && (
                            <div className={`mt-4 ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'} backdrop-blur border ${darkMode ? 'border-gray-700/50' : 'border-gray-300/50'} rounded-xl p-4`}>
                              <div className="flex items-center gap-2 mb-4">
                                <PieChart className="w-5 h-5 text-blue-400" />
                                <h3 className={`${currentTheme.text.primary} font-semibold`}>Budget Distribution</h3>
                              </div>
                              
                              {/* الرسم البياني */}
                              <div className="space-y-3">
                                {/* السكن */}
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className={currentTheme.text.secondary}>🏨 Accommodation</span>
                                    <span className="text-blue-400 font-semibold">${message.budgetData.accommodation.toLocaleString()}</span>
                                  </div>
                                  <div className={`h-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'} rounded-full overflow-hidden`}>
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000"
                                      style={{ width: '40%' }}
                                    ></div>
                                  </div>
                                </div>

                                {/* الطعام */}
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className={currentTheme.text.secondary}>🍽️ Food & Dining</span>
                                    <span className="text-green-400 font-semibold">${message.budgetData.food.toLocaleString()}</span>
                                  </div>
                                  <div className={`h-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'} rounded-full overflow-hidden`}>
                                    <div 
                                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                                      style={{ width: '30%', animationDelay: '0.2s' }}
                                    ></div>
                                  </div>
                                </div>

                                {/* الأنشطة */}
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className={currentTheme.text.secondary}>🎯 Activities</span>
                                    <span className="text-purple-400 font-semibold">${message.budgetData.activities.toLocaleString()}</span>
                                  </div>
                                  <div className={`h-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'} rounded-full overflow-hidden`}>
                                    <div 
                                      className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-1000"
                                      style={{ width: '20%', animationDelay: '0.4s' }}
                                    ></div>
                                  </div>
                                </div>

                                {/* المواصلات */}
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className={currentTheme.text.secondary}>🚗 Transportation</span>
                                    <span className="text-orange-400 font-semibold">${message.budgetData.transport.toLocaleString()}</span>
                                  </div>
                                  <div className={`h-2 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-300/50'} rounded-full overflow-hidden`}>
                                    <div 
                                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-1000"
                                      style={{ width: '10%', animationDelay: '0.6s' }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              {/* مجموع الميزانية */}
                              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-300/50'} flex justify-between items-center`}>
                                <span className={`${currentTheme.text.secondary} font-medium`}>Total Budget</span>
                                <span className="text-xl text-blue-400 font-bold">${message.budgetData.total.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className={currentTheme.text.secondary}>{message.content}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* مؤشر الكتابة */}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl p-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

{/* منطقة الإدخال */}
<div className={`border-t ${darkMode ? 'border-purple-500/20' : 'border-purple-300/20'} backdrop-blur-sm ${darkMode ? 'bg-black/20' : 'bg-white/20'} px-4 sm:px-6 py-4`}>
  <div className="max-w-4xl mx-auto">
    
    <div className="flex gap-2 mb-3 flex-wrap text-sm">
      {['Dubai', 'Paris', 'London', 'New York', 'Istanbul', 'Netherlands', 'Germany', 'Syria', 'Makkah', 'Egypt', 'Riyadh'].map(city => (
        <button
          key={city}
          onClick={() => setInput(`Tell me about ${city}`)}
          className={`px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} ${currentTheme.text.secondary} ${darkMode ? 'hover:bg-purple-500/20 hover:text-purple-300' : 'hover:bg-purple-200/50 hover:text-purple-600'} transition-colors border ${darkMode ? 'border-gray-700/50 hover:border-purple-500/30' : 'border-gray-300/50 hover:border-purple-400/30'} text-xs sm:text-sm`}
        >
          {city}
        </button>
      ))}
    </div>
    
    <div className="flex gap-3 items-end">
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about any destination or use voice input..."
          className={`flex-1 px-4 py-3 ${currentTheme.input} backdrop-blur border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base`}
        />
        <VoiceButton />
      </div>
      
      {/* الأفاتار بجانب حقل الإرسال - ظاهر في جميع الشاشات */}
      <div className="flex sm:hidden">
        <AiAvatar 
          mood={isListening ? 'listening' : avatarMood} 
          isTyping={isTyping}
          isSpeaking={isSpeaking}
          isListening={isListening}
          size="small"
        />
      </div>
      
      <div className="hidden sm:flex">
        <AiAvatar 
          mood={isListening ? 'listening' : avatarMood} 
          isTyping={isTyping}
          isSpeaking={isSpeaking}
          isListening={isListening}
          size="small"
        />
      </div>
      
      {/* زر New Chat الدائري المضاف هنا */}
      <button
        onClick={createNewChat}
        className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all shadow-lg hover:shadow-xl"
        title="New Chat"
      >
        <Plus className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleSend}
        disabled={!input.trim() || isTyping}
        className="px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Send</span>
      </button>
    </div>

              

              {/* مؤشر الاستماع للصوت */}
              {isListening && (
                <div className={`mt-3 p-3 ${darkMode ? 'bg-red-500/20' : 'bg-red-200/50'} rounded-lg border ${darkMode ? 'border-red-500/30' : 'border-red-400/30'}`}>
                  <div className="flex items-center gap-2 text-red-300">
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">Listening... Speak now</span>
                  </div>
                  {transcript && (
                    <p className={`${currentTheme.text.primary} text-sm mt-2`}>"{transcript}"</p>
                  )}
                </div>
              )}

              {/* رسالة عدم الدعم */}
              {!voiceSupported && (
                <div className="mt-2 text-xs text-orange-400">
                  ⚠️ Voice features are not supported in your browser
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* تأثيرات الخلفية */}
      <div className={`absolute top-1/4 left-1/4 w-32 h-32 ${darkMode ? 'bg-blue-400/10' : 'bg-blue-200/20'} rounded-full blur-2xl animate-pulse`}></div>
      <div className={`absolute bottom-1/3 right-1/4 w-40 h-40 ${darkMode ? 'bg-purple-500/10' : 'bg-purple-200/20'} rounded-full blur-3xl animate-pulse`} 
           style={{animationDelay: '2s'}}></div>

      {/* نافذة الميزانية */}
      {showBudgetModal && (
        <div className={`fixed inset-0 ${darkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
          <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'} border ${darkMode ? 'border-purple-500/30' : 'border-purple-400/30'} rounded-2xl p-6 max-w-md w-full shadow-2xl`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`${currentTheme.text.primary} text-xl font-bold`}>Budget Planner</h2>
                <p className={`${currentTheme.text.tertiary} text-sm`}>Plan your perfect trip</p>
              </div>
            </div>

            {selectedCity && (
              <div className={`mb-4 p-3 ${darkMode ? 'bg-purple-500/10' : 'bg-purple-100/50'} border ${darkMode ? 'border-purple-500/20' : 'border-purple-400/30'} rounded-lg`}>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 font-medium">
                    Destination: {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
                  </span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className={`block text-sm font-medium ${currentTheme.text.secondary} mb-2`}>
                Enter Your Budget (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., 2000"
                  className={`w-full pl-10 pr-4 py-3 ${currentTheme.input} border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50`}
                  autoFocus
                />
              </div>
              <p className={`mt-2 text-xs ${currentTheme.text.tertiary}`}>
                💡 Recommended: $1000+ for a comfortable trip
              </p>
            </div>

            <div className="mb-6 space-y-2 text-xs">
              <div className={`flex items-center gap-2 ${currentTheme.text.tertiary}`}>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Budget Travel: $500 - $1000</span>
              </div>
              <div className={`flex items-center gap-2 ${currentTheme.text.tertiary}`}>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Comfortable: $1000 - $3000</span>
              </div>
              <div className={`flex items-center gap-2 ${currentTheme.text.tertiary}`}>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Luxury: $3000+</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBudgetModal(false);
                  setBudget('');
                }}
                className={`flex-1 px-4 py-2.5 ${currentTheme.button.secondary} rounded-xl font-medium transition-all`}
              >
                Cancel
              </button>
              <button
                onClick={handleBudgetSubmit}
                disabled={!budget || parseFloat(budget) <= 0}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Calculate Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default WingsAi;