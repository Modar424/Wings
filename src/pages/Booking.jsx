import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Calendar,
  Users,
  CreditCard,
  Info,
  ArrowRight,
  MapPin,
  ChevronDown,
  ArrowLeft,
  ChevronUp,
  Clock,
  ShieldCheck,
  Ticket,
  Baby,
  Wifi,
  Coffee,
  Tv,
} from "lucide-react";

const Booking = () => {
  const [step, setStep] = useState(1);
  const [expandedFlight, setExpandedFlight] = useState(null);
  const [isLeaving, setIsLeaving] = useState(true);

  const [formData, setFormData] = useState({
    selectedGoFlight: null,
    seat_class: "Economy Class",
    adults: 1,
    children: 0,
    to_city: "",
    departure_date: "",
    flight_type: "one_direction",
  });

  const AvailableFlights = [
    {
      id: 1,
      flight_number: "WG-202",
      from: "Wings International Airport",
      to: "Dubai",
      departure: "10:00 AM",
      arrival: "01:00 PM",
      gate: "A12",
      prices: {
        "Economy Class": 450,
        "Business Class": 900,
        "First Class": 1500,
      },
      available_seats: {
        "Economy Class": 25,
        "Business Class": 5,
        "First Class": 2,
      },
    },
  ];

  const handleSwap = () => {
    setIsLeaving(!isLeaving);
    setFormData((prev) => ({ ...prev, to_city: "" }));
  };

  const handleNextStep = (flightData = null) => {
    if (flightData) {
      setFormData((prev) => ({ ...prev, selectedGoFlight: flightData }));
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-slate-950 text-white font-sans">
      <motion.button
        onClick={
          step === 1 ? () => (window.location.href = "/") : handlePrevStep
        }
        className="fixed top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> {step === 1 ? "Back to Home" : "Back"}
      </motion.button>

      <main className="container mx-auto px-6 pt-16 pb-20 relative z-10">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10"></div>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= s ? "bg-purple-600 border-purple-400" : "bg-slate-900 border-white/20"}`}
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
                <div className="flex p-1.5 bg-black/50 rounded-2xl border border-white/5 w-fit mx-auto">
                  {["one_direction", "tow_direction"].map((type) => (
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

                <div className="grid md:grid-cols-2 gap-6 relative items-end">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> From
                    </label>
                    {isLeaving ? (
                      <div className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-5 py-4 text-white font-medium h-[60px] flex items-center">
                        Wings International Airport
                      </div>
                    ) : (
                      <select
                        value={formData.to_city}
                        onChange={(e) =>
                          setFormData({ ...formData, to_city: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none text-white appearance-none h-[60px]"
                      >
                        <option value="">Select Destination</option>
                        <option value="Dubai">Dubai (DXB)</option>
                        <option value="Istanbul">Istanbul (IST)</option>
                      </select>
                    )}
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[20%] z-20 hidden md:block">
                    <button
                      onClick={handleSwap}
                      type="button"
                      className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:rotate-180 transition-all duration-500 border-4 border-slate-950 shadow-lg"
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
                    {!isLeaving ? (
                      <div className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-5 py-4 text-white font-medium h-[60px] flex items-center">
                        Wings International Airport
                      </div>
                    ) : (
                      <select
                        value={formData.to_city}
                        onChange={(e) =>
                          setFormData({ ...formData, to_city: e.target.value })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none text-white appearance-none h-[60px]"
                      >
                        <option value="">Select Destination</option>
                        <option value="Dubai">Dubai (DXB)</option>
                        <option value="Istanbul">Istanbul (IST)</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 transition-all duration-500">
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
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none text-white focus:border-purple-500/50 transition-colors h-[60px]"
                    />
                  </div>

                  <AnimatePresence>
                    {formData.flight_type === "tow_direction" && (
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
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 outline-none text-white appearance-none h-[60px]"
                    >
                      <option value="Economy Class">Economy Class</option>
                      <option value="Business Class">Business Class</option>
                      <option value="First Class">First Class</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between bg-white/5 px-5 rounded-xl border border-white/10 h-[60px]">
                    <div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-none">
                        Adults
                      </p>
                      <p className="text-[9px] text-gray-500 italic">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            adults: Math.max(1, p.adults - 1),
                          }))
                        }
                        className="w-8 h-8 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">
                        {formData.adults}
                      </span>
                      <button
                        onClick={() =>
                          setFormData((p) => ({ ...p, adults: p.adults + 1 }))
                        }
                        className="w-8 h-8 bg-purple-600 rounded-lg text-white hover:bg-purple-500 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between px-5 rounded-xl border transition-all h-[60px] ${
                      formData.seat_class === "Business Class"
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
                        disabled={formData.seat_class === "Business Class"}
                        onClick={() => {
                          if (formData.adults >= 1)
                            setFormData((p) => ({
                              ...p,
                              children: p.children + 1,
                            }));
                        }}
                        className="w-8 h-8 bg-purple-600 rounded-lg text-white disabled:bg-gray-600 disabled:cursor-not-allowed font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleNextStep()}
                    disabled={
                      !formData.to_city ||
                      !formData.departure_date ||
                      formData.adults < 1
                    }
                    className="w-full py-5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 uppercase tracking-widest"
                  >
                    SEARCH FLIGHTS <ArrowRight className="inline-block ml-2" />
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
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-4xl font-black italic uppercase text-white leading-tight">
                    Select <span className="text-purple-500">Your Flight</span>
                  </h2>
                </div>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    id: "flight-1",
                    flight_number: "EK-202",
                    departure_code: isLeaving
                      ? "WIA"
                      : formData.to_city.substring(0, 3).toUpperCase(),
                    arrival_code: !isLeaving
                      ? "WIA"
                      : formData.to_city.substring(0, 3).toUpperCase(),
                    departure: isLeaving
                      ? "Wings Int. Airport"
                      : formData.to_city,
                    arrival: !isLeaving
                      ? "Wings Int. Airport"
                      : formData.to_city,
                    departure_time: "10:30 AM",
                    arrival_time: "02:45 PM",

                    prices: {
                      "Economy Class": 450,
                      "Business Class": 900,
                      "First Class": 1500,
                    },
                    available_seats: 10,
                    departure_date: formData.departure_date,
                  },
                  {
                    id: "flight-2",
                    flight_number: "QR-505",
                    departure_code: isLeaving
                      ? "WIA"
                      : formData.to_city.substring(0, 3).toUpperCase(),
                    arrival_code: !isLeaving
                      ? "WIA"
                      : formData.to_city.substring(0, 3).toUpperCase(),
                    departure: isLeaving
                      ? "Wings Int. Airport"
                      : formData.to_city,
                    arrival: !isLeaving
                      ? "Wings Int. Airport"
                      : formData.to_city,
                    departure_time: "09:00 PM",
                    arrival_time: "01:15 AM",
                    prices: {
                      "Economy Class": 380,
                      "Business Class": 800,
                      "First Class": 1300,
                    },
                    available_seats: 0,
                    departure_date: formData.departure_date,
                  },
                ].map((flight) => {
                  const totalPassengers =
                    (Number(formData.adults) || 0) +
                    (Number(formData.children) || 0);

                  const hasSeats = flight.available_seats >= totalPassengers;
                  const matchesDate =
                    flight.departure_date === formData.departure_date;
                  const isAvailable = hasSeats && matchesDate;

                  return (
                    <div
                      key={flight.id}
                      className={`group relative rounded-[2.5rem] transition-all duration-500 border ${
                        isAvailable
                          ? "bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07]"
                          : "bg-black/40 border-red-900/20 opacity-60 grayscale-[0.3]"
                      }`}
                    >
                      <div
                        className={`absolute -top-3 right-12 py-1 px-4 rounded-full text-[9px] font-black uppercase tracking-widest z-20 shadow-xl ${isAvailable ? "bg-green-500 text-black" : "bg-red-600 text-white"}`}
                      >
                        {isAvailable ? "Fastest Choice" : "Unavailable"}
                      </div>

                      <div className="flex flex-col md:flex-row items-stretch">
                        <div
                          onClick={() => isAvailable && handleNextStep(flight)}
                          className={`flex-1 p-8 flex flex-col lg:flex-row items-center gap-8 ${isAvailable ? "cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          <div
                            className={`p-5 rounded-3xl transition-all duration-500 ${isAvailable ? "bg-purple-600/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white" : "bg-white/5 text-gray-600"}`}
                          >
                            <Plane size={28} />
                          </div>

                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-purple-400 border border-white/5 font-bold">
                                {flight.flight_number}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="text-2xl font-black text-white">
                                  {flight.departure_code}
                                </h4>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                                  {flight.departure}
                                </p>
                              </div>
                              <ArrowRight className="text-purple-500/50" />
                              <div>
                                <h4 className="text-2xl font-black text-white">
                                  {flight.arrival_code}
                                </h4>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                                  {flight.arrival}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 px-10 border-x border-white/5">
                            <div className="text-center">
                              <p className="text-xl font-bold text-white leading-none font-mono">
                                {flight.departure_time}
                              </p>
                            </div>
                            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent relative">
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-500"></div>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-bold text-white leading-none font-mono">
                                {flight.arrival_time}
                              </p>
                            </div>
                          </div>

                          <div className="lg:pl-8 text-right">
                            <p className="text-3xl font-black text-white tracking-tight">
                              ${flight.prices[formData.seat_class]}
                            </p>
                          </div>
                        </div>

                        <div className="p-6 md:border-l border-white/5 flex items-center justify-center bg-white/[0.02]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedFlight(
                                expandedFlight === flight.id ? null : flight.id,
                              );
                            }}
                            className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 ${expandedFlight === flight.id ? "bg-purple-600 border-purple-500 text-white" : "bg-white/5 border-white/10 text-gray-400"}`}
                          >
                            <ChevronDown
                              className={`transition-transform duration-500 ${expandedFlight === flight.id ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedFlight === flight.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/60 border-t border-white/5 overflow-hidden"
                          >
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">
                                  Flight Details
                                </h5>

                                <div className="grid grid-cols-2 gap-x-20 gap-y-3 max-w-md">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-gray-400 font-medium">
                                        Aircraft:
                                      </p>
                                      <p className="text-sm text-white">A350</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-gray-400 font-medium">
                                        Gate:
                                      </p>
                                      <p className="text-sm text-white">
                                        Gate B12
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-gray-400 font-medium">
                                        Duration:
                                      </p>
                                      <p className="text-sm text-white">
                                        {flight.duration || "4h 15m"}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-gray-400 font-medium">
                                        Status:
                                      </p>
                                      <span
                                        className={`text-sm font-bold ${isAvailable ? "text-green-400" : "text-red-400"}`}
                                      >
                                        {isAvailable ? "On Time" : "Full"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4 md:ml-40">
                                <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
                                  Amenities
                                </h5>
                                <div className="flex gap-6">
                                  <Wifi size={18} />
                                  <Coffee size={18} />
                                  <Tv size={18} />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && formData.selectedGoFlight && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black italic uppercase text-white">
                  Review Your Booking
                </h2>
                <p className="text-gray-400">
                  Review your flight details before payment
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl p-8">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Plane className="text-purple-400" />
                    <span className="font-bold tracking-widest">
                      FLIGHT: {formData.selectedGoFlight.flight_number}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                  <div className="text-center md:text-left">
                    <p className="text-xs text-purple-400 font-bold uppercase">
                      Departure
                    </p>
                    <h4 className="text-2xl font-black">
                      {isLeaving ? "Wings Int. Airport" : formData.to_city}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {formData.departure_date} |{" "}
                      {formData.selectedGoFlight.departure}
                    </p>
                  </div>

                  <div className="hidden md:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg shadow-white/10">
                    <ArrowRight className="text-purple-600 w-6 h-6" />
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-xs text-purple-400 font-bold uppercase">
                      Arrival
                    </p>
                    <h4 className="text-2xl font-black">
                      {!isLeaving ? "Wings Int. Airport" : formData.to_city}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {formData.selectedGoFlight.arrival}
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Total Passengers: {formData.adults + formData.children}
                    </p>
                    <p className="text-xs text-purple-400 italic">
                      * All taxes included
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-400 uppercase">
                      Total Amount
                    </p>
                    <p className="text-5xl font-black text-white">
                      $
                      {formData.selectedGoFlight.prices[formData.seat_class] *
                        (formData.adults + formData.children)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => alert("Redirecting to Secure Payment...")}
                  className="py-5 bg-white text-violet-900 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-5 h-5" /> PAY NOW
                </button>
                <button
                  onClick={() => alert("Saved!")}
                  className="py-5 bg-purple-600/20 border border-purple-500/40 text-white rounded-2xl font-black text-lg hover:bg-purple-600/30 transition-all"
                >
                  PAY LATER
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
export default Booking;
