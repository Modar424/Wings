import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../Config/api';

// ── profile shape from json/1.json ──
// { username, email, first_name, last_name, birth_date, phone_number, gender, image }

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
    console.log('🔍 Checking existing session...');
    fetch(`${API_BASE_URL}/api/auth/user/profile/`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(profile => { 
        console.log('📋 Session restored:', profile);
        setUser(profile); 
        setIsLoggedIn(true); 
      })
      .catch(() => {
        console.log('🔒 No active session');
      });
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
    console.log(`📝 Input changed: ${name} =`, files ? files[0]?.name : value);
  }, []);

  // ── Google Login Handler ─────────────────────────────────
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    console.log('🔐 Google login success:', credentialResponse);
    setLoading(true);
    setError('');

    try {
      const token = credentialResponse.credential;
      
      console.log('📤 Sending Google token to backend...');
      
   const response = await fetch(`${API_BASE_URL}/api/auth/user/google/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ 
    access_token: token
  }),
});

      console.log('📡 Google auth response status:', response.status);
      console.log('🍪 Set-Cookie header:', response.headers.get('set-cookie'));

      let data = {};
      try {
        data = await response.json();
        console.log('📦 Google auth response data:', data);
        if (data.non_field_errors) {
  console.log('❌ Error details:', data.non_field_errors);
}
      } catch (e) {
        console.error('Response not JSON:', e);
        const text = await response.text();
        console.error('Raw response:', text.substring(0, 500));
        data = { detail: 'Server response error' };
      }

      if (!response.ok) {
        console.error('❌ Google login failed:', data);
        // عرض رسالة الخطأ التفصيلية
        const errorMsg = data.non_field_errors?.[0] || data.detail || data.error || 'Google login failed';
        setError(errorMsg);
        setLoading(false);
        return;
      }

      console.log('✅ Google login successful, fetching profile...');

      const profileRes = await fetch(`${API_BASE_URL}/api/auth/user/profile/`, { 
        credentials: 'include'
      });

      console.log('📋 Profile response status:', profileRes.status);

      if (profileRes.ok) {
        const profile = await profileRes.json();
        console.log('📋 Profile fetched successfully:', profile);
        setUser(profile);
        setIsLoggedIn(true);
      } else {
        console.error('❌ Failed to fetch profile');
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
    
    // 🔐 === FORM SUBMITTED DEBUG ===
    console.log('═══════════════════════════════════════');
    console.log('🔐 === FORM SUBMITTED ===');
    console.log('📋 isSignUp:', isSignUp);
    console.log('👤 Username:', formData.username);
    console.log('📧 Email:', formData.email);
    console.log('🔒 Password:', formData.password ? '***' : '(empty)');
    console.log('📞 Phone:', formData.phone_number);
    console.log('📅 Birth date:', formData.birth_date);
    console.log('⚥ Gender:', formData.gender);
    console.log('🖼️ Image:', formData.image instanceof File ? formData.image.name : 'No file');
    console.log('═══════════════════════════════════════');
    // ==================================
    
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        console.log('📝 === STARTING REGISTRATION ===');
        
        // تحويل التاريخ
        let formattedBirthDate = formData.birth_date;
        if (formattedBirthDate && formattedBirthDate.includes('-')) {
          const [year, month, day] = formattedBirthDate.split('-');
          formattedBirthDate = `${day}/${month}/${year}`;
          console.log('📅 Date converted:', formData.birth_date, '→', formattedBirthDate);
        }

        // استخدام FormData بدلاً من JSON
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password1', formData.password);
        formDataToSend.append('password2', formData.password2);
        formDataToSend.append('birth_date', formattedBirthDate);
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('phone_number', formData.phone_number);
        
        if (formData.image && formData.image instanceof File) {
          formDataToSend.append('image', formData.image);
          console.log('🖼️ Image file attached:', formData.image.name);
        } else {
          console.log('🖼️ No image file attached');
        }

        console.log('📤 Sending registration data via FormData');
        console.log('📡 Target URL:', `${API_BASE_URL}/api/auth/user/register/`);

        const res = await fetch(`${API_BASE_URL}/api/auth/user/register/`, {
          method: 'POST',
          credentials: 'include',
          body: formDataToSend,
        });

        console.log('📡 Registration response status:', res.status);
        console.log('🍪 Set-Cookie header:', res.headers.get('set-cookie'));

        let data = {};
        try {
          const text = await res.text();
          console.log('📦 Raw response:', text.substring(0, 500));
          try {
            data = JSON.parse(text);
            console.log('📦 Parsed JSON:', data);
          } catch {
            console.log('Response is not JSON');
            data = { detail: text };
          }
        } catch (e) {
          console.error('Failed to read response:', e);
          data = { detail: 'Server response error' };
        }

        if (!res.ok) {
          console.error('❌ Registration failed:', data);
          setError(parseError(data));
          setLoading(false);
          return;
        }
        
        console.log('✅ Registration successful!');
        alert('✅ Account created successfully! Please sign in with your credentials.');
        setIsSignUp(false);
        resetForm();
        setLoading(false);
        return;
        
      } else {
        // تسجيل الدخول العادي
        console.log('🔐 === STARTING LOGIN ===');
        console.log('🔐 Username from form:', formData.username);
        console.log('🔐 Password from form:', formData.password ? '***' : '(empty)');
        console.log('📡 Target URL:', `${API_BASE_URL}/api/auth/user/login/`);
        
        const res = await fetch(`${API_BASE_URL}/api/auth/user/login/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
        
        console.log('📡 Login response status:', res.status);
        console.log('🍪 Set-Cookie header:', res.headers.get('set-cookie'));
        
        let data = {};
        try {
          const text = await res.text();
          console.log('📦 Raw response:', text.substring(0, 500));
          try {
            data = JSON.parse(text);
            console.log('📦 Parsed JSON:', data);
          } catch{
            console.log('Response is not JSON');
            data = { detail: text };
          }
        } catch (e) {
          console.error('Failed to read response:', e);
          data = { detail: 'Server response error' };
        }
        
        if (!res.ok) { 
          console.error('❌ Login failed:', data);
          setError(parseError(data));
          setFormData(prev => ({ ...prev, password: '', password2: '' }));
          setLoading(false);
          return;
        }
        
        console.log('✅ Login successful!');
        console.log('📋 Fetching user profile...');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const profileRes = await fetch(`${API_BASE_URL}/api/auth/user/profile/`, { 
          credentials: 'include',
        });
        
        console.log('📋 Profile response status:', profileRes.status);
        
        if (profileRes.ok) {
          const profile = await profileRes.json();
          console.log('📋 Profile fetched successfully:', profile);
          setUser(profile);
          setIsLoggedIn(true);
        } else {
          console.error('❌ Failed to fetch profile, status:', profileRes.status);
          let errorText = '';
          try {
            const errorData = await profileRes.json();
            errorText = JSON.stringify(errorData);
          } catch {
            errorText = await profileRes.text();
          }
          console.error('Profile error response:', errorText);
          setUser({ username: formData.username });
          setIsLoggedIn(true);
          setError('تم تسجيل الدخول ولكن تعذر جلب بعض البيانات');
        }
        
        console.log('🎉 Login process completed!');
        setShowAuthModal(false);
        resetForm();
      }
    } catch (err) {
      console.error('❌ Auth error:', err);
      setError('تعذّر الاتصال بالخادم، تحقق من اتصالك.');
    } finally {
      setLoading(false);
    }
  }, [isSignUp, formData]);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    console.log('🚪 Logging out...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/user/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
      console.log('📡 Logout response status:', res.status);
    } catch (err) {
      console.error('Logout error:', err);
    }
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