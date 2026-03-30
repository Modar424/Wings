import { useState, useEffect, useCallback } from 'react';

// ── profile shape from json/1.json ──
// { username, email, first_name, last_name, birth_date, phone_number, gender, image }

const BASE = '';   // Vite proxy handles routing to onrender.com

function parseError(err) {
  if (!err) return 'حدث خطأ، حاول مجدداً.';
  if (typeof err === 'string') return err;
  if (Array.isArray(err)) return err.join(' ');
  if (typeof err === 'object') {
    return Object.entries(err)
      .flatMap(([k, v]) => {
        const msgs = Array.isArray(v) ? v : [v];
        return msgs.map(m => `${k}: ${m}`);
      })
      .join(' | ');
  }
  return 'حدث خطأ، حاول مجدداً.';
}

export const useAuth = () => {
  const [showAuthModal, setShowAuthModal]   = useState(false);
  const [isSignUp,      setIsSignUp]         = useState(false);
  const [loading,       setLoading]          = useState(false);
  const [error,         setError]            = useState('');
  const [user,          setUser]             = useState(null);
  const [isLoggedIn,    setIsLoggedIn]       = useState(false);

  const [formData, setFormData] = useState({
    // signin fields
    username: '',
    password: '',
    // signup extra fields
    email: '',
    password2: '',
    phone_number: '',
    birth_date: '',
    gender: 'Male',
    image: null,
  });

  // ── Try to restore session on mount ─────────────────────
  useEffect(() => {
    fetch('/api/auth/user/profile/', { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(profile => { 
        console.log('📋 Session restored:', profile);
        setUser(profile); 
        setIsLoggedIn(true); 
      })
      .catch(() => {});
  }, []);

  // ── Helpers ──────────────────────────────────────────────
  const resetForm = () => setFormData({
    username: '', password: '', email: '',
    password2: '', phone_number: '', birth_date: '', gender: 'Male', image: null,
  });

  const toggleAuthModal = useCallback(() => {
    setShowAuthModal(v => !v);
    setError('');
    resetForm();
  }, []);

  const toggleAuthMode = useCallback(() => {
    setIsSignUp(v => !v);
    setError('');
    resetForm();
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  }, []);

  // ── Google Login Handler ─────────────────────────────────
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    console.log('🔐 Google login success:', credentialResponse);
    setLoading(true);
    setError('');

    try {
      const token = credentialResponse.credential;
      
      // إرسال التوكن إلى الباك اند
      const response = await fetch('/api/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ access_token: token }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        console.error('Response not JSON:', e);
        data = { detail: 'Server response error' };
      }

      if (!response.ok) {
        console.error('❌ Google login failed:', data);
        setError(parseError(data));
        setLoading(false);
        return;
      }

      console.log('✅ Google login successful, fetching profile...');

      // جلب الملف الشخصي
      const profileRes = await fetch('/api/auth/user/profile/', { 
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (profileRes.ok) {
        const profile = await profileRes.json();
        console.log('📋 Profile fetched successfully:', profile);
        setUser(profile);
        setIsLoggedIn(true);
      } else {
        console.error('❌ Failed to fetch profile');
        // حتى لو فشل جلب الملف الشخصي، نستخدم بيانات من Google
        setUser({ username: data.user?.username || 'Google User' });
        setIsLoggedIn(true);
      }

      setShowAuthModal(false);
      resetForm();
      
    } catch (err) {
      console.error('Google login error:', err);
      setError('تعذّر الاتصال بالخادم، تحقق من اتصالك.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGoogleError = useCallback(() => {
    console.error('❌ Google login failed');
    setError('فشل تسجيل الدخول عبر Google، حاول مرة أخرى.');
  }, []);

  // ── Submit: login or register ─────────────────────────────
  const handleAuthSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // تحويل التاريخ من YYYY-MM-DD إلى DD/MM/YYYY
        let formattedBirthDate = formData.birth_date;
        if (formattedBirthDate && formattedBirthDate.includes('-')) {
          const [year, month, day] = formattedBirthDate.split('-');
          formattedBirthDate = `${day}/${month}/${year}`;
          console.log('📅 Date converted:', formData.birth_date, '→', formattedBirthDate);
        }

        const jsonData = {
          username: formData.username,
          email: formData.email,
          password1: formData.password,
          password2: formData.password2,
          birth_date: formattedBirthDate,
          gender: formData.gender,
          phone_number: formData.phone_number,
          image: formData.image || null,
        };

        console.log('📤 Sending registration data:', { ...jsonData, password1: '***', password2: '***' });

        const res = await fetch('/api/auth/user/register/', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData),
        });

        let data = {};
        try {
          data = await res.json();
        } catch (e) {
          console.error('Response not JSON:', e);
          data = { detail: 'Server response error' };
        }

        if (!res.ok) {
          setError(parseError(data));
          setLoading(false);
          return;
        }
        
        alert('✅ Account created successfully! Please sign in with your credentials.');
        setIsSignUp(false);
        resetForm();
        setLoading(false);
        return;
        
      } else {
        // تسجيل الدخول العادي
        console.log('🔐 Attempting login with username:', formData.username);
        
        const res = await fetch('/api/auth/user/login/', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
        
        let data = {};
        try {
          data = await res.json();
        } catch (e) {
          console.error('Response not JSON:', e);
          data = { detail: 'Server response error' };
        }
        
        if (!res.ok) { 
          console.error('❌ Login failed:', data);
          setError(parseError(data));
          setFormData(prev => ({ ...prev, password: '', password2: '' }));
          setLoading(false);
          return;
        }
        
        console.log('✅ Login successful, fetching profile...');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const profileRes = await fetch('/api/auth/user/profile/', { 
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        console.log('📋 Profile response status:', profileRes.status);
        
        if (profileRes.ok) {
          const profile = await profileRes.json();
          console.log('📋 Profile fetched successfully:', profile);
          setUser(profile);
          setIsLoggedIn(true);
        } else {
          console.error('❌ Failed to fetch profile, status:', profileRes.status);
          setUser({ username: formData.username });
          setIsLoggedIn(true);
          setError('تم تسجيل الدخول ولكن تعذر جلب بعض البيانات');
        }
        
        setShowAuthModal(false);
        resetForm();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('تعذّر الاتصال بالخادم، تحقق من اتصالك.');
    } finally {
      setLoading(false);
    }
  }, [isSignUp, formData]);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    console.log('🚪 Logging out...');
    try {
      await fetch('/api/auth/user/logout/', {
        method: 'POST',
        credentials: 'include',
      });
    } catch { /* ignore */ }
    setUser(null);
    setIsLoggedIn(false);
    console.log('✅ Logout successful');
  }, []);

  return {
    showAuthModal,
    isSignUp,
    formData,
    user,
    loading,
    error,
    isLoggedIn,
    toggleAuthModal,
    toggleAuthMode,
    handleInputChange,
    handleAuthSubmit,
    handleGoogleSuccess,
    handleGoogleError,
    logout,
  };
};