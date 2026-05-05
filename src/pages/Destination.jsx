import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, ArrowUpDown, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Destination() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const PAGE_SIZE = 12;
  const [ordering, setOrdering] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    min_static_rate: "",
    max_static_rate: "",
    min_avg_rate: "",
    max_avg_rate: "",
    is_top_destination: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showOrdering, setShowOrdering] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const defaultImage =
    "https://via.placeholder.com/400x300?text=No+Image+Available";
  const BASE_URL = "https://hosting-wings.onrender.com";

  const getImagePath = (imageName) => {
    if (!imageName) return defaultImage;

    if (typeof imageName === "string" && imageName.startsWith("http")) {
      return imageName;
    }

    const cleanPath = imageName.startsWith("/") ? imageName : `/${imageName}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const safeRate = (r) => {
    const n = parseFloat(r);
    return Number.isFinite(n) ? n : 0;
  };

  const API_URL = "https://hosting-wings.onrender.com/api/flights/Destination/";

  const buildUrl = (base = API_URL, params = {}) => {
    const u = new URL(base);
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "" && v !== false) {
        sp.set(k, String(v));
      }
    });
    u.search = sp.toString();
    return u.toString();
  };

  const fetchDestinations = async (url = null, explicitParams = null) => {
    console.log("🚀 fetchDestinations START");
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      console.log("🔑 TOKEN EXISTS:", !!token);
      console.log("🔑 TOKEN VALUE:", token);

      const cleanParams = (params) => {
        const cleaned = {};
        Object.entries(params).forEach(([key, value]) => {
          if (
            value !== "" &&
            value !== null &&
            value !== undefined &&
            value !== false
          ) {
            cleaned[key] = value;
          }
        });
        return cleaned;
      };

      const queryParams = cleanParams({
        search: searchQuery,
        ordering,
        ...filters,
        ...explicitParams,
      });
      console.log("📦 QUERY PARAMS:");
      console.table(queryParams);

      console.log("🧠 STATE SNAPSHOT:", {
        searchQuery,
        ordering,
        filters,
        currentPage,
      });
      const finalUrl = url || buildUrl(API_URL, queryParams);
      console.log("🔥 Final URL:", finalUrl);
      console.log("📦 Query Params:", queryParams);
      console.log("🔑 Token:", token);

      console.log("📡 SENDING REQUEST...");
      const res = await fetch(finalUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);

      const data = await res.json();
      console.log("📩 RAW RESPONSE:", data);
      console.log("📊 Results array/raw:", data.results || data.data || data);

      const results = data?.results || [];
      if (!Array.isArray(data.results)) {
        console.warn("Unexpected API format:", data);
      }
      console.log("🎯 Parsed Results:", results);
      console.log("📌 Pagination:", {
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
      const normalized = results.map((it) => ({
        city: it.city,
        country: it.country,
        Bio: it.Bio,
        image: it.image,
        slug: it.slug,
        avg_rate: it.avg_rate,
        static_rate: it.static_rate,
        landmarks: it.landmarks,
        airports: it.airports,
        travel_cond_group_go: it.travel_cond_group_go,
        travel_cond_group_back: it.travel_cond_group_back,
      }));

      setItems(normalized);
      setPagination({
        count: data.count || results.length,
        next: data.next || null,
        previous: data.previous || null,
      });
      console.log("📄 PAGINATION INFO:");
      console.log({
        count: data.count,
        next: data.next,
        previous: data.previous,
        totalPages: Math.ceil((data.count || 0) / PAGE_SIZE),
      });

      if (url) {
        const urlObj = new URL(url);
        const pageParam = urlObj.searchParams.get("page");
        if (pageParam) setCurrentPage(parseInt(pageParam));
      } else if (explicitParams?.page) {
        setCurrentPage(explicitParams.page);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      // console.log("🚨 URL that failed:", url || buildUrl(API_URL, queryParams));
      setItems([]);
      setPagination({
        count: 0,
        next: null,
        previous: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openBooking = (slug) => {
    navigate("/booking", { state: { slug } });
  };

  const renderStars = (rate) => {
    const rounded = Math.round(safeRate(rate));
    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rounded ? "text-white" : "text-white/40"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.436 2.676c-.784.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.567 9.377c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.95z" />
          </svg>
        ))}
      </div>
    );
  };

  const handlePageChange = (url) => {
    if (!url) return;

    fetchDestinations(url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const totalPages = Math.max(1, Math.ceil(pagination.count / PAGE_SIZE));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-violet-900 to-slate-950 text-white selection:bg-purple-500/30 p-8 relative overflow-hidden">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/")}
          className="fixed top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs md:text-sm font-medium hover:bg-white/20 transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </motion.button>

        {/* خلفيات وتوهجات - معدلة لألوان Booking (بنفسجي) */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-black to-black"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        </div>
        <div
          className="absolute bottom-1/4 right-1/3 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px] bg-purple-600/15 rounded-full blur-[90px] -z-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* GLOBAL RAIN DROPLETS EFFECT - مع تعديل الألوان للبنفسجي */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute top-[5%] left-[8%] w-2 h-2 bg-purple-400/70 rounded-full animate-ping"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-[12%] right-[10%] w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-ping"
            style={{ animationDelay: ".3s" }}
          ></div>
          <div
            className="absolute top-[20%] left-[25%] w-2 h-2 bg-violet-500/65 rounded-full animate-ping"
            style={{ animationDelay: ".6s" }}
          ></div>
          <div
            className="absolute top-[30%] right-[30%] w-1.5 h-1.5 bg-purple-400/70 rounded-full animate-ping"
            style={{ animationDelay: ".9s" }}
          ></div>
          <div
            className="absolute top-[40%] left-[12%] w-2 h-2 bg-purple-400/60 rounded-full animate-ping"
            style={{ animationDelay: "1.2s" }}
          ></div>
          <div
            className="absolute top-[50%] left-[45%] w-1 h-1 bg-purple-400/75 rounded-full animate-ping"
            style={{ animationDelay: ".2s" }}
          ></div>
          <div
            className="absolute top-[60%] right-[22%] w-1.5 h-1.5 bg-violet-400/70 rounded-full animate-ping"
            style={{ animationDelay: ".8s" }}
          ></div>
          <div
            className="absolute top-[70%] left-[60%] w-1.5 h-1.5 bg-purple-400/65 rounded-full animate-ping"
            style={{ animationDelay: "1.1s" }}
          ></div>
          <div
            className="absolute top-[80%] left-[30%] w-1 h-1 bg-violet-500/70 rounded-full animate-ping"
            style={{ animationDelay: "1.4s" }}
          ></div>
          <div
            className="absolute top-[85%] right-[6%] w-1 h-1 bg-purple-400/75 rounded-full animate-ping"
            style={{ animationDelay: ".5s" }}
          ></div>
          <div
            className="absolute top-[15%] left-[50%] w-1.5 h-1.5 bg-purple-300/70 rounded-full animate-ping"
            style={{ animationDelay: ".4s" }}
          ></div>
          <div
            className="absolute top-[35%] left-[75%] w-1 h-1 bg-violet-300/60 rounded-full animate-ping"
            style={{ animationDelay: ".7s" }}
          ></div>
          <div
            className="absolute top-[55%] left-[80%] w-1.5 h-1.5 bg-purple-300/60 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-[65%] left-[5%] w-1 h-1 bg-violet-300/60 rounded-full animate-ping"
            style={{ animationDelay: ".9s" }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-violet-600 bg-clip-text text-transparent mb-2">
              Destinations
            </h2>
            <p className="text-gray-400">Explore our destinations</p>
            <p className="text-sm text-white mt-2">
              Total Destinations: {pagination.count}
            </p>
          </header>

          {/* Search & Filters */}
          <div ref={searchRef} className="mb-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setShowOptions(true);
                setIsFocused(true);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
                  setIsFocused(false);
                  setShowOptions(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCurrentPage(1);
                  fetchDestinations(null, {
                    page: 1,
                    search: searchQuery,
                    ordering,
                    ...filters,
                  });
                }
              }}
              placeholder="Enter city name"
              className={`px-3 py-2 rounded-md bg-black/40 border border-white/10 text-gray-300 ${isFocused ? "w-3/4" : "w-full"}`}
            />

            {/* تظهر الأيقونات فقط بعد النقر/التركيز على شريط البحث */}
            {showOptions && (
              <div className="absolute top-1 right-1 flex items-center gap-2 z-20">
                <button
                  title="Filters"
                  onClick={() => setShowFilters((s) => !s)}
                  className="p-2 bg-white/10 text-white rounded-md border border-white/20 shadow-sm"
                >
                  <Filter size={16} />
                </button>

                <div className="relative">
                  <button
                    title="Ordering"
                    onClick={() => {
                      setShowOrdering((s) => !s);
                      setShowFilters(false);
                    }}
                    className="p-2 bg-white/10 text-white rounded-md border border-white/20 shadow-sm"
                  >
                    <ArrowUpDown size={16} />
                  </button>

                  {/* popover صغير للترتيب */}
                  {showOrdering && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/60 backdrop-blur-md border border-white/10 rounded-md p-3 shadow-lg">
                      <label className="text-xs text-purple-400 mb-1 block">
                        Order by
                      </label>
                      <select
                        value={ordering}
                        onChange={(e) => {
                          setOrdering(e.target.value);
                          setShowOrdering(false);
                          setCurrentPage(1);
                          fetchDestinations(null, { page: 1 });
                        }}
                        className="w-full px-2 py-1 rounded bg-black/50 text-gray-300 border border-white/10"
                      >
                        <option value="">Default ordering</option>
                        <option value="city">City ↑</option>
                        <option value="-city">City ↓</option>
                        <option value="country">Country ↑</option>
                        <option value="-country">Country ↓</option>
                        <option value="static_rate">Static ↑</option>
                        <option value="-static_rate">Static ↓</option>
                        <option value="avg_rate">Avg ↑</option>
                        <option value="-avg_rate">Avg ↓</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50 p-8 rounded-md bg-black/60 backdrop-blur-md border-2 border-purple-500/30 shadow-2xl grid grid-cols-1 gap-4 w-11/12 md:w-3/4 lg:w-1/2">
              {/* زر X للإغلاق */}
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
                aria-label="Close filters"
              >
                ✕
              </button>

              <input
                placeholder="Country"
                value={filters.country}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, country: e.target.value }))
                }
                className="px-2 py-2 rounded-md bg-black/50 text-gray-300 border border-white/10"
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Min Static Rate"
                value={filters.min_static_rate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, min_static_rate: e.target.value }))
                }
                className="px-2 py-2 rounded-md bg-black/50 text-gray-300 border border-white/10"
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Max Static Rate"
                value={filters.max_static_rate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, max_static_rate: e.target.value }))
                }
                className="px-2 py-2 rounded-md bg-black/50 text-gray-300 border border-white/10"
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Min Avg Rate"
                value={filters.min_avg_rate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, min_avg_rate: e.target.value }))
                }
                className="px-2 py-2 rounded-md bg-black/50 text-gray-300 border border-white/10"
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Max Avg Rate"
                value={filters.max_avg_rate}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, max_avg_rate: e.target.value }))
                }
                className="px-2 py-2 rounded-md bg-black/50 text-gray-300 border border-white/10"
              />
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.is_top_destination}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      is_top_destination: e.target.checked,
                    }))
                  }
                />
                Top destination only
              </label>

              <div className="col-span-full flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setFilters({
                      country: "",
                      min_static_rate: "",
                      max_static_rate: "",
                      min_avg_rate: "",
                      max_avg_rate: "",
                      is_top_destination: false,
                    });
                  }}
                  className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/20"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    fetchDestinations(null, {
                      page: 1,
                      search: searchQuery,
                      ordering,
                      ...filters,
                    });
                  }}
                  className="px-3 py-2 rounded-md bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No destinations available currently
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${showFilters ? "opacity-20" : ""}`}
              >
                {items.map((it, idx) => (
                  <div
                    key={
                      it.slug ?? `${it.city ?? it.City ?? it.country}-${idx}`
                    }
                    className="relative group bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden flex flex-col hover:scale-[1.02] transition-transform duration-300"
                  >
                    {/* القسم العلوي: صورة وتقييم */}
                    <div className="relative">
                      <img
                        src={getImagePath(it.image)}
                        alt={`${it.city || it.country} image`}
                        className="w-full h-44 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = defaultImage;
                        }}
                      />
                      {/* التقييم */}
                      <div
                        className="absolute top-3 right-3 rounded-full px-2 py-1 flex items-center gap-2 shadow-sm"
                        style={{
                          background:
                            "linear-gradient(90deg,#8b5cf6,#a78bfa,#c4b5fd)",
                        }}
                      >
                        {renderStars(
                          it.avg_rate ?? it.Avg_Rate ?? it.static_rate,
                        )}
                      </div>
                    </div>

                    {/* القسم الثاني: المعلومات والأزرار */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg text-gray-200">
                          <span className="font-extrabold text-white">
                            {it.city}
                          </span>
                          <span className="font-light text-sm text-gray-400 mx-1">
                            —
                          </span>
                          <span className="font-light text-sm text-gray-400">
                            {it.country}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-3">
                          {it.Bio}
                        </p>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => openBooking(it.slug)}
                          className="w-28 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-1 text-xs rounded-md shadow-md transition-all hover:shadow-lg"
                        >
                          Book Now
                        </button>

                        <button
                          onClick={() => setSelected(it)}
                          className="w-28 flex items-center justify-center gap-2 px-2 py-1 text-xs rounded-md hover:bg-white/10 text-gray-300 border border-white/20 transition-all"
                        >
                          <span>More details</span>
                          <span aria-hidden>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* pagination controls */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.previous)}
                  disabled={!pagination.previous}
                  className={`px-6 py-2 rounded-md flex items-center gap-2 transition-all ${
                    pagination.previous && currentPage > 1
                      ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white hover:shadow-lg"
                      : "bg-white/10 text-gray-500 cursor-not-allowed opacity-50"
                  }`}
                >
                  <span>←</span>
                  Previous
                </button>

                <span className="text-gray-400 px-4">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.next)}
                  disabled={!pagination.next}
                  className={`px-6 py-2 rounded-md flex items-center gap-2 transition-all ${
                    pagination.next && currentPage < totalPages
                      ? "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white hover:shadow-lg"
                      : "bg-white/10 text-gray-500 cursor-not-allowed opacity-50"
                  }`}
                >
                  Next
                  <span>→</span>
                </button>
              </div>
            </>
          )}

          {/* مودال التفاصيل */}
          {selected && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              onClick={() => setSelected(null)}
            >
              <div
                className="bg-black/60 backdrop-blur-md rounded-lg max-w-3xl w-full p-6 overflow-auto max-h-[80vh] border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl text-gray-200">
                    <span className="font-extrabold text-white">
                      {selected?.city}
                    </span>
                    <span className="font-light text-sm text-gray-400 mx-2">
                      —
                    </span>
                    <span className="font-light text-sm text-gray-400">
                      {selected?.country}
                    </span>
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(null);
                    }}
                    className="text-gray-400 hover:text-white text-xl"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <img
                    src={getImagePath(selected.image ?? selected.Image)}
                    alt={`${selected.city}`}
                    className="w-full h-56 object-cover rounded"
                    onError={(e) => {
                      console.warn(
                        `Failed to load image: ${getImagePath(selected.image ?? selected.Image)}`,
                      );
                      e.currentTarget.src = defaultImage;
                    }}
                  />

                  <div>
                    {/* تقييمات: Avg (نجوم للمستخدمين) و Static (ميدالية للإدارة) */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-200">
                      <div className="p-3 bg-white/5 rounded-md flex items-center gap-3">
                        {/* أيقونة مستخدم (Avg - Users) */}
                        <svg
                          className="w-5 h-5 flex-shrink-0 text-purple-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <div>
                          <div className="text-sm font-semibold">
                            Avg (Users)
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(
                              selected?.avg_rate ??
                                selected?.Avg_Rate ??
                                selected?.static_rate,
                            )}
                            <span className="text-sm text-gray-400">
                              {selected?.avg_rate ??
                                selected?.Avg_Rate ??
                                "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-md flex items-center gap-3">
                        {/* أيقونة مبنى/شركة (Admin - Static) */}
                        <svg
                          className="w-6 h-6 text-purple-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M19 21H5V3h7v4h2V3h3v18zM7 19h2v-2H7v2zm0-4h2v-2H7v2zm4 4h2v-2h-2v2zm0-4h2v-2h-2v2z" />
                        </svg>
                        <div>
                          <div className="text-sm font-semibold">
                            Admin (Static)
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {selected?.static_rate ?? "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Landmarks: تعامل مع نص مفصول بفواصل أو مصفوفة */}
                    <div className="mt-4 text-gray-200">
                      <strong>Landmarks:</strong>
                      <ul className="list-disc ml-5 mt-2 text-sm">
                        {(() => {
                          const lmRaw =
                            selected?.landmarks ?? selected?.Landmarks ?? "";
                          const items = Array.isArray(lmRaw)
                            ? lmRaw
                            : typeof lmRaw === "string"
                              ? lmRaw
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                              : [];
                          return items.length > 0 ? (
                            items.map((lm, i) => <li key={i}>{lm}</li>)
                          ) : (
                            <li>—</li>
                          );
                        })()}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-gray-200">
                  <strong>Bio:</strong>
                  <p className="text-sm text-gray-400 mt-2">{selected.Bio}</p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelected(null);
                      openBooking(selected.slug);
                    }}
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md hover:shadow-lg transition-all"
                  >
                    Book Now
                  </button>

                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 border border-white/20 text-gray-300 rounded-md hover:bg-white/10 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* عناصر زخرفية - بنفسجية */}
        <div className="fixed top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none -z-10"></div>
        <div
          className="fixed bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none -z-10"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>
    </>
  );
}
