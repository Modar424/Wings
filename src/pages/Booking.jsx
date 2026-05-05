import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  ShieldCheck,
  Plane,
} from "lucide-react";
import axios from "axios";

const Booking = () => {
  const [step, setStep] = useState(1);
  const [isLeaving, setIsLeaving] = useState(true);
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [isSwapped, setIsSwapped] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);

  const selectedGoFlightRef = useRef(null);

  const API_BASE_URL = "https://hosting-wings.onrender.com";

  const [formData, setFormData] = useState({
    selectedGoFlight: null,
    selectedBackFlight: null,
    seat_class: "Economy",
    adults: 1,
    children: 0,
    from_city: "",
    to_city: "",
    departure_date: "",
    flight_type: "one_direction",
  });

  const handleSwap = () => {
    setIsSwapped((prev) => !prev);
  };

  const handleNextStep = (flightData = null) => {
    console.log("🧠 SAVING FLIGHT:", flightData);
    if (flightData) {
      selectedGoFlightRef.current = flightData;
      setFormData((prev) => ({ ...prev, selectedGoFlight: flightData }));
    }
    console.log("➡️ GOING TO STEP 2");
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  const getAvailableSeats = (flight) => {
    switch (formData.seat_class) {
      case "Economy":
        return flight.Economy_Class_available ?? 0;
      case "Premium":
        return flight.Premium_Economy_available ?? 0;
      case "Business":
        return flight.Business_Class_available ?? 0;
      case "First":
        return flight.First_Class_available ?? 0;
      default:
        return 0;
    }
  };

  const isFlightAvailable = (flight) => {
    const required = formData.adults + formData.children;
    const available = getAvailableSeats(flight);
    const enough = available >= required;

    console.log("🧪 FLIGHT CHECK:", {
      flight: flight.flight_number,
      class: formData.seat_class,
      availableSeats: available,
      required,
      result: enough,
    });

    return enough;
  };

  const getPrice = (flight) => {
    switch (formData.seat_class) {
      case "Economy":
        return flight.Economy_Class_price;
      case "Premium":
        return flight.Premium_Economy_price;
      case "Business":
        return flight.Business_Class_price;
      case "First":
        return flight.First_Class_price;
      default:
        return 0;
    }
  };

  const searchFlights = async () => {
    try {
      setLoadingFlights(true);

      const token = localStorage.getItem("access_token");

      const res = await axios.get(`${API_BASE_URL}/api/flights/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🔥 RAW RESPONSE:", res.data);

      const data = res.data?.results || res.data || [];
      console.log("🧪 FIRST FLIGHT FULL:", data[0]);
      console.log("🧪 KEYS:", Object.keys(data[0] || {}));
      console.log(
        "🛫 API cities:",
        data.map((f) => ({
          from: f.departure_city,
          to: f.arrival_city,
        })),
      );

      console.log("🧾 FORM:", formData.from_city, formData.to_city);

      const filtered = data.filter((f) => f.type === "LEAVING");
      console.log("✈️ FILTERED FLIGHTS:", filtered);

      setFlights(filtered);

      setStep(2);
    } catch (err) {
      console.log("Search error:", err);
    } finally {
      setLoadingFlights(false);
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("access_token");

    const selectedFlight =
      formData.selectedGoFlight || selectedGoFlightRef.current;

    console.log("🧾 SELECTED FLIGHT (state):", formData.selectedGoFlight);
    console.log("🧾 SELECTED FLIGHT (ref):", selectedGoFlightRef.current);
    console.log("🔐 TOKEN:", token);

    if (!selectedFlight) {
      console.log("❌ No flight selected");
      alert("Choose your flight first");
      return;
    }

    console.log("ID:", selectedFlight.id);
    console.log("NUMBER:", selectedFlight.flight_number);

    if (!token) {
      alert("Sorry , you must log in first to complete your booking");
      return;
    }

    setLoading(true);
    try {
      const totalSeats = formData.adults + formData.children;

      const payload = {
        flight_type: formData.flight_type,
        flight_go: selectedFlight.id,
        flight_back:
          formData.flight_type === "two_direction"
            ? (formData.selectedBackFlight?.id ?? null)
            : null,
        chears: totalSeats,
        chears_checked_in_go: totalSeats,
        chears_checked_in_back:
          formData.flight_type === "two_direction" ? totalSeats : 0,
        chear_type: formData.seat_class,
      };

      console.log("📡 URL:", `${API_BASE_URL}/api/service/booking/create/`);
      console.log("📦 PAYLOAD:", payload);
      console.log("🔐 HEADERS:", {
        Authorization: `Bearer ${token}`,
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/service/booking/create/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      alert(
        "Booking Successful! , your Booking Number : " +
          response.data.booking_id,
      );
      window.location.href = "/";
    } catch (error) {
      console.log("❌ ERROR OBJECT:", error);

      if (error.response) {
        console.log("📛 STATUS:", error.response.status);
        console.log("📛 DATA:", error.response.data);
      } else if (error.request) {
        console.log("📡 NO RESPONSE:", error.request);
      } else {
        console.log("⚠️ ERROR MESSAGE:", error.message);
      }

      const errorMsg = error.response?.data
        ? Object.entries(error.response.data)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        : "  Error while connecting to the server .";

      alert("booking process error:\n" + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/flights/Destination/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data?.results || res.data?.data || res.data;
        setDestinations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setDestinations([]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-slate-950 text-white font-sans">
      <motion.button
        onClick={
          step === 1 ? () => (window.location.href = "/") : handlePrevStep
        }
        className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> {step === 1 ? "Home" : "Back"}
      </motion.button>

      <main className="container mx-auto px-6 pt-16 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10"></div>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= s
                  ? "bg-purple-600 border-purple-400"
                  : "bg-slate-900 border-white/20"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8"
            >
              <h2 className="text-3xl font-black mb-8 italic text-center uppercase tracking-tighter">
                Search Flights
              </h2>
              <div className="space-y-8">
                {/* Toggle Trip Type */}
                <div className="flex p-1.5 bg-black/50 rounded-2xl border border-white/5 w-fit mx-auto">
                  {["one_direction", "two_direction"].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFormData({ ...formData, flight_type: type })
                      }
                      className={`px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase ${
                        formData.flight_type === type
                          ? "bg-purple-600 shadow-lg"
                          : "text-gray-500"
                      }`}
                    >
                      {type === "one_direction" ? "One Way" : "Round Trip"}
                    </button>
                  ))}
                </div>

                {/* From & To Section */}
                <div className="grid md:grid-cols-2 gap-6 relative items-end">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> From
                    </label>
                    <div
                      onClick={() =>
                        isSwapped && setOpenDropdown(!openDropdown)
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-5 py-4 text-white font-medium h-[60px] flex items-center"
                    >
                      {isSwapped
                        ? formData.from_city || "Select Departure"
                        : "Wings International Airport"}
                    </div>

                    {/* DROPDOWN */}
                    {isSwapped && openDropdown && (
                      <div className="absolute left-0 top-full mt-2 w-full max-w-[100%] bg-black/90 border border-white/10 rounded-xl max-h-60 overflow-auto z-50">
                        {destinations.length === 0 ? (
                          <div className="p-3 text-gray-400">Loading...</div>
                        ) : (
                          destinations.map((dest) => (
                            <div
                              key={dest.slug}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  from_city: dest.city,
                                });
                                setOpenDropdown(false);
                              }}
                              className="px-4 py-3 hover:bg-purple-600/30 cursor-pointer text-white"
                            >
                              {dest.city}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[20%] z-20 hidden md:block">
                    <button
                      onClick={handleSwap}
                      className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:rotate-180 transition-all duration-500 border-4 border-slate-950"
                    >
                      <Plane
                        className={`w-4 h-4 transition-transform ${isLeaving ? "rotate-45" : "rotate-[225deg]"}`}
                      />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> To
                    </label>
                    <div
                      onClick={() =>
                        !isSwapped && setOpenDropdown(!openDropdown)
                      }
                      className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-5 py-4 text-white font-medium h-[60px] flex items-center"
                    >
                      {!isSwapped
                        ? formData.to_city || "Select Destination"
                        : "Wings International Airport"}
                    </div>

                    {/* DROPDOWN */}
                    {!isSwapped && openDropdown && (
                      <div className="absolute left-0 top-full mt-2 w-full bg-black/90 border border-white/10 rounded-xl max-h-60 overflow-auto z-50">
                        {destinations.length === 0 ? (
                          <div className="p-3 text-gray-400">Loading...</div>
                        ) : (
                          destinations.map((dest) => (
                            <div
                              key={dest.slug}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  to_city: dest.city,
                                });
                                setOpenDropdown(false);
                              }}
                              className="px-4 py-3 hover:bg-purple-600/30 cursor-pointer text-white"
                            >
                              {dest.city}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Departure Date
                    </label>
                    <input
                      type="date"
                      value={formData.departure_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departure_date: e.target.value,
                        })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none text-white h-[60px]"
                    />
                  </div>
                  <AnimatePresence>
                    {formData.flight_type === "two_direction" && (
                      <motion.div
                        key="return-field"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-3"
                      >
                        <label className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> Return Date
                        </label>
                        <input
                          type="date"
                          value={formData.return_date || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              return_date: e.target.value,
                            })
                          }
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none text-white focus:border-purple-500/50 transition-colors h-[60px]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Class & Passengers Section */}
                <div className="grid lg:grid-cols-3 gap-6 pt-6 border-t border-white/5 items-end">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Cabin Class
                    </label>
                    <select
                      value={formData.seat_class}
                      onChange={(e) => {
                        const newClass = e.target.value;
                        setFormData({
                          ...formData,
                          seat_class: newClass,
                          children:
                            newClass === "Business Class"
                              ? 0
                              : formData.children,
                        });
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none text-white h-[60px]"
                    >
                      <option value="Economy">Economy Class</option>
                      <option value="Business">Business Class</option>
                      <option value="First">First Class</option>
                    </select>
                  </div>

                  {/* Adults */}
                  <div className="flex items-center justify-between bg-white/5 px-5 rounded-xl border border-white/10 h-[60px]">
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-none">
                        Adults
                      </p>
                      <p className="text-[9px] text-gray-500 italic">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            adults: Math.max(1, p.adults - 1),
                          }))
                        }
                        className="w-8 h-8 bg-white/10 rounded-lg text-white hover:bg-white/20 font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">
                        {formData.adults}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, adults: p.adults + 1 }))
                        }
                        className="w-8 h-8 bg-purple-600 rounded-lg text-white hover:bg-purple-500 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div
                    className={`flex items-center justify-between px-5 rounded-xl border transition-all h-[60px] ${
                      formData.seat_class === "Business"
                        ? "bg-red-500/5 border-red-500/20 opacity-50"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-none">
                        Children
                      </p>
                      <p className="text-[9px] text-gray-500 italic">
                        Age 2-12
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        disabled={formData.seat_class === "Business Class"}
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            children: Math.max(0, p.children - 1),
                          }))
                        }
                        className="w-8 h-8 bg-white/10 rounded-lg text-white disabled:cursor-not-allowed font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">
                        {formData.children}
                      </span>
                      <button
                        type="button"
                        disabled={formData.seat_class === "Business Class"}
                        onClick={() => {
                          if (formData.adults >= 1)
                            setFormData((p) => ({
                              ...p,
                              children: p.children + 1,
                            }));
                        }}
                        className="w-8 h-8 bg-purple-600 rounded-lg text-white disabled:bg-gray-600 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    onClick={searchFlights}
                    disabled={
                      !formData.to_city ||
                      !formData.departure_date ||
                      formData.adults < 1
                    }
                    className="w-full py-5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 uppercase tracking-widest"
                  >
                    {loadingFlights ? "SEARCHING..." : "SEARCH FLIGHTS"}{" "}
                    <ArrowRight className="inline-block ml-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              <h2 className="text-4xl font-black italic uppercase">
                Select <span className="text-purple-500">Your Flight</span>
              </h2>
              <div className="grid gap-6">
                {flights.map((flight) => {
                  const available = isFlightAvailable(flight);
                  const availableSeats = getAvailableSeats(flight);
                  const requiredSeats = formData.adults + formData.children;
                  const noSeatsAtAll = availableSeats === 0;

                  return (
                    <div
                      key={flight.flight_number}
                      onClick={() => {
                        if (!available) return;
                        handleNextStep(flight);
                      }}
                      className={`relative bg-white/5 border rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between transition-all
                      ${
                        available
                          ? "border-white/10 hover:border-purple-500/50 cursor-pointer"
                          : "border-red-500/30 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {/* Badge */}
                      {!available && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1.5 rounded-xl text-xs font-bold">
                          <span>⛔</span>
                          <span>
                            {noSeatsAtAll
                              ? "SOLD OUT"
                              : `ONLY ${availableSeats} SEAT${availableSeats > 1 ? "S" : ""} LEFT — YOU NEED ${requiredSeats}`}
                          </span>
                        </div>
                      )}

                      {/* Available seats hint */}
                      {available && availableSeats <= requiredSeats + 3 && (
                        <div className="absolute top-4 right-4 bg-amber-500/80 text-white px-3 py-1.5 rounded-xl text-xs font-bold">
                          ⚠️ ONLY {availableSeats} SEATS LEFT
                        </div>
                      )}

                      <div className="flex items-center gap-6">
                        <div
                          className={`p-4 rounded-2xl ${available ? "bg-purple-600/20 text-purple-400" : "bg-red-600/10 text-red-400"}`}
                        >
                          <Plane size={32} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black">
                            {flight.departure_code} → {flight.arrival_code}
                          </h4>
                          <p className="text-gray-500 text-sm font-bold uppercase">
                            {flight.flight_number}
                          </p>
                          {/* Seats info */}
                          <p
                            className={`text-xs font-bold mt-1 ${available ? "text-green-400" : "text-red-400"}`}
                          >
                            {noSeatsAtAll
                              ? "No seats available"
                              : `${availableSeats} seat${availableSeats > 1 ? "s" : ""} available in ${formData.seat_class}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-3xl font-black ${!available ? "text-gray-500" : ""}`}
                        >
                          ${getPrice(flight)}
                        </p>
                        <p
                          className={`text-xs font-bold uppercase mt-1 ${available ? "text-purple-400" : "text-gray-600"}`}
                        >
                          {formData.seat_class}
                        </p>
                        {!available && (
                          <p className="text-red-400 text-xs font-bold mt-1">
                            NOT AVAILABLE
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">
                  CONFIRM BOOKING
                </h3>
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <p className="text-purple-400 text-xs font-bold uppercase mb-2">
                      Flight Details
                    </p>
                    <h4 className="text-xl font-bold">
                      {formData.selectedGoFlight?.flight_number}
                    </h4>
                    <p className="text-gray-400">{formData.departure_date}</p>
                    <p className="mt-4 font-bold text-lg">
                      {formData.seat_class} Class
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 text-xs font-bold uppercase mb-2">
                      Total Amount
                    </p>
                    <p className="text-6xl font-black">
                      $
                      {formData.selectedGoFlight?.[
                        `${formData.seat_class}_Class_price`
                      ] *
                        (formData.adults + formData.children)}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      For {formData.adults + formData.children} Passenger(s)
                    </p>
                  </div>
                </div>
                <div className="mt-12">
                  <button
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full py-5 bg-white text-violet-900 rounded-2xl font-black text-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    {loading ? "PROCESSING..." : "CONFIRM & PAY"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Booking;
