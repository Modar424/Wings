/* eslint-disable react-refresh/only-export-components */
import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import api from "../Config/api";

const AuthContext = createContext();

function parseError(err) {
  if (!err) return "error";
  if (typeof err === "string") return err;

  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === "string") return data;

    return Object.entries(data)
      .flatMap(([k, v]) => {
        const msgs = Array.isArray(v) ? v : [v];
        return msgs.map((m) => `${k}: ${m}`);
      })
      .join(" | ");
  }

  return "error";
}

export const AuthProvider = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const isLoggedIn = !!localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
    email: "",
    phone_number: "",
    birth_date: "",
    gender: "Male",
    image: null,
  });
  const saveTokens = (data) => {
    if (data?.access_token)
      localStorage.setItem("access_token", data.access_token);

    if (data?.refresh_token)
      localStorage.setItem("refresh_token", data.refresh_token);
  };

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/api/auth/user/profile/");
        setUser(res.data);
      } catch (err) {
        console.error("Auth Load Error:", err);
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const resetForm = () =>
    setFormData({
      username: "",
      password: "",
      password2: "",
      email: "",
      phone_number: "",
      birth_date: "",
      gender: "Male",
      image: null,
    });

  const toggleAuthModal = useCallback(() => {
    setShowAuthModal((v) => !v);
    setError("");
    resetForm();
  }, []);

  const toggleAuthMode = useCallback(() => {
    setIsSignUp((v) => !v);
    setError("");
    resetForm();
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }, []);

  // Google Login
  const handleGoogleSuccess = useCallback(async (accessToken) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/user/google/", {
        access_token: accessToken,
        provider: "google",
      });
      console.log("LOGIN RESPONSE:", res.data);
      saveTokens(res.data);

      const profileRes = await api.get("/api/auth/user/profile/");
      setUser(profileRes.data);

      setShowAuthModal(false);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  //  Login + Register
  const handleAuthSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        if (isSignUp) {
          let formattedBirthDate = formData.birth_date;

          if (formattedBirthDate?.includes("-")) {
            const [year, month, day] = formattedBirthDate.split("-");
            formattedBirthDate = `${day}/${month}/${year}`;
          }

          const fd = new FormData();
          fd.append("username", formData.username);
          fd.append("email", formData.email);
          fd.append("password1", formData.password);
          fd.append("password2", formData.password2);
          fd.append("phone_number", formData.phone_number);
          fd.append("birth_date", formattedBirthDate);
          fd.append("gender", formData.gender);

          if (formData.image) {
            fd.append("image", formData.image);
          }

          await api.post("/api/auth/user/register/", fd);

          setIsSignUp(false);
          resetForm();
          alert("Account created Successfully , Log in now !");
        } else {
          const res = await api.post("/api/auth/user/login/", {
            username: formData.username,
            password: formData.password,
          });
          console.log("🔥 LOGIN RESPONSE:", res.data);

          saveTokens(res.data);
          console.log("💾 Saved access:", localStorage.getItem("access_token"));
          console.log(
            "💾 Saved refresh:",
            localStorage.getItem("refresh_token"),
          );

          console.log(
            "📡 Sending access token:",
            localStorage.getItem("access_token"),
          );

          const profileRes = await api.get("/api/auth/user/profile/");
          setUser(profileRes.data);

          setShowAuthModal(false);
          resetForm();
        }
      } catch (err) {
        setError(parseError(err));
      } finally {
        setLoading(false);
      }
    },
    [isSignUp, formData],
  );

  //  Logout
  const logout = useCallback(async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        await api.post("/api/auth/user/logout/", {
          refresh_token: refresh,
        });
      }
    } catch (err) {
      console.warn("Logout failed:", err);
    }

    clearTokens();
    setUser(null);
  }, []);

  const value = {
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
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
