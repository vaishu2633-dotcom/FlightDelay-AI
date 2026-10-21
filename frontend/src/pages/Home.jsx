import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Plane,
  ArrowRight,
  ArrowLeftRight,
  Calendar,
  Clock,
  Sparkles,
  BarChart3,
  GitBranch,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  TrendingDown,
  Building2,
  Compass,
  Layers,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { fetchDatasetSummary } from '../services/api';

// Verified top commercial carriers (U.S. BTS reporting carriers)
const AIRLINES = [
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'WN', name: 'Southwest Airlines' },
  { code: 'AS', name: 'Alaska Airlines' },
  { code: 'B6', name: 'JetBlue Airways' },
  { code: 'NK', name: 'Spirit Airlines' },
  { code: 'F9', name: 'Frontier Airlines' },
  { code: 'HA', name: 'Hawaiian Airlines' },
];

// Major U.S. commercial airports with city and full title
const AIRPORTS = [
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta', city: 'Atlanta, GA' },
  { code: 'ORD', name: "Chicago O'Hare", city: 'Chicago, IL' },
  { code: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas, TX' },
  { code: 'DEN', name: 'Denver International', city: 'Denver, CO' },
  { code: 'CLT', name: 'Charlotte Douglas', city: 'Charlotte, NC' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles, CA' },
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York, NY' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco, CA' },
  { code: 'SEA', name: 'Seattle-Tacoma', city: 'Seattle, WA' },
  { code: 'MIA', name: 'Miami International', city: 'Miami, FL' },
  { code: 'BOS', name: 'Boston Logan', city: 'Boston, MA' },
  { code: 'EWR', name: 'Newark Liberty', city: 'Newark, NJ' },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando, FL' },
  { code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas, NV' },
  { code: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix, AZ' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston, TX' },
];

// Local high-resolution aviation images
const HERO_IMAGE_URL = '/images/hero-airplane.jpg';
const TERMINAL_IMAGE_URL = '/images/airport-terminal.jpg';
const CTA_IMAGE_URL = '/images/airplane-takeoff.jpg';

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export default function Home({ modelStatus }) {
  const navigate = useNavigate();

  // Quick prediction form state
  const [formData, setFormData] = useState({
    origin: 'ATL',
    destination: 'LAX',
    airline: 'DL',
    flight_date: getTodayDateString(),
    scheduled_departure_time: '14:30',
  });

  // Autocomplete search states
  const [originSearch, setOriginSearch] = useState('');
  const [originDropdownOpen, setOriginDropdownOpen] = useState(false);
  const [destSearch, setDestSearch] = useState('');
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);

  // Dataset statistics state
  const [datasetStats, setDatasetStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Quick predict validation feedback
  const [validationError, setValidationError] = useState('');

  // References for outside click dismissal
  const originRef = useRef(null);
  const destRef = useRef(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchDatasetSummary();
        setDatasetStats(res);
      } catch (err) {
        console.error('Error fetching dataset summary:', err);
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  // Handle outside click for dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (originRef.current && !originRef.current.contains(e.target)) {
        setOriginDropdownOpen(false);
      }
      if (destRef.current && !destRef.current.contains(e.target)) {
        setDestDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Origin / Destination Swap
  const handleSwapAirports = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  // Filtered airports for autocomplete
  const filteredOriginAirports = AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(originSearch.toLowerCase()) ||
      a.city.toLowerCase().includes(originSearch.toLowerCase()) ||
      a.name.toLowerCase().includes(originSearch.toLowerCase())
  );

  const filteredDestAirports = AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(destSearch.toLowerCase()) ||
      a.city.toLowerCase().includes(destSearch.toLowerCase()) ||
      a.name.toLowerCase().includes(destSearch.toLowerCase())
  );

  // Submit quick prediction: navigates to Predict page with entered values preserved
  const handleQuickPredict = (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.origin === formData.destination) {
      setValidationError('Origin and destination airport cannot be identical.');
      return;
    }

    // Preserve entered values and navigate to the Predict page
    navigate('/predict', {
      state: {
        initialFlightData: {
          ...formData,
          distance: 1200,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* 1. Hero Section with /images/hero-airplane.jpg (75-85vh on desktop) */}
      <section className="relative overflow-hidden bg-primary text-white min-h-[75vh] lg:min-h-[82vh] flex items-center">
        
        {/* Full-width Aviation Hero Photo with Balanced Dark Navy Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE_URL}
            alt="Large commercial airplane cruising above clouds"
            fetchPriority="high"
            loading="eager"
            className="w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle multi-stop gradient overlay preserving clear view of the aircraft while ensuring text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-primary/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            
            {/* Research Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-secondary/35 backdrop-blur-md border border-secondary/40 text-accent text-xs font-semibold uppercase tracking-wider shadow-inner"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Aviation Machine Learning Research</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]"
            >
              Predict Delays. <br />
              Plan Smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-sky-200 to-white">
                Fly Better.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed max-w-xl drop-shadow-sm"
            >
              Predict commercial flight delay risks before heading to the terminal. 
              Powered by empirical machine learning that systematically tackles class imbalance 
              using official U.S. BTS aviation records with zero data leakage.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2"
            >
              <Link
                to="/predict"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl text-sm font-bold text-primary bg-accent hover:bg-sky-400 shadow-aviation hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <Plane className="w-4 h-4 mr-2.5 transform -rotate-45" />
                <span>Predict Your Flight</span>
              </Link>

              <Link
                to="/analytics"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl text-sm font-bold text-white bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2.5 text-accent" />
                <span>Explore Analytics</span>
              </Link>
            </motion.div>

            {/* Attribution Footnote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-2 flex items-center space-x-2 text-xs text-slate-200"
            >
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Grounded in U.S. Bureau of Transportation Statistics (BTS) • FAA 15-Minute Threshold</span>
            </motion.div>

          </div>
        </div>

      </section>

      {/* 2. Quick Flight Prediction Section (Interactive Search Card) */}
      <section className="relative z-20 -mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-card border border-slate-200/80 p-6 sm:p-8"
        >
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Plane className="w-5 h-5 transform -rotate-45" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Quick Flight Delay Check</h2>
                <p className="text-xs text-slate-500">
                  Select your itinerary to transfer parameters to the full prediction engine
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>U.S. Domestic Commercial Routes</span>
            </div>
          </div>

          {/* Validation Error if any */}
          {validationError && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs sm:text-sm text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{validationError}</div>
            </div>
          )}

          {/* Quick Search Form */}
          <form onSubmit={handleQuickPredict} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Origin Airport with Autocomplete */}
              <div className="md:col-span-5 relative" ref={originRef}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Origin Airport
                </label>
                <div
                  onClick={() => setOriginDropdownOpen(!originDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-secondary bg-slate-50/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <span className="text-base font-extrabold text-primary font-mono">
                      {formData.origin}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {AIRPORTS.find((a) => a.code === formData.origin)?.city || 'Select Airport'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {/* Autocomplete Dropdown Popover */}
                {originDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 max-h-72 overflow-y-auto">
                    <div className="relative mb-2">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search airport code or city..."
                        value={originSearch}
                        onChange={(e) => setOriginSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-secondary"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1">
                      {filteredOriginAirports.map((airport) => (
                        <div
                          key={airport.code}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, origin: airport.code }));
                            setOriginDropdownOpen(false);
                            setOriginSearch('');
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            formData.origin === airport.code
                              ? 'bg-secondary-light text-secondary font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-bold font-mono mr-2">{airport.code}</span>
                            <span className="text-slate-500">{airport.city}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {airport.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="md:col-span-2 flex justify-center pt-5 md:pt-0">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  title="Swap Origin and Destination"
                  className="p-3 rounded-full bg-slate-100 hover:bg-secondary-light text-slate-600 hover:text-secondary border border-slate-200 transition-all hover:rotate-180 duration-300"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* Destination Airport with Autocomplete */}
              <div className="md:col-span-5 relative" ref={destRef}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Destination Airport
                </label>
                <div
                  onClick={() => setDestDropdownOpen(!destDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-secondary bg-slate-50/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <span className="text-base font-extrabold text-primary font-mono">
                      {formData.destination}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {AIRPORTS.find((a) => a.code === formData.destination)?.city || 'Select Airport'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {/* Autocomplete Dropdown Popover */}
                {destDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 max-h-72 overflow-y-auto">
                    <div className="relative mb-2">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search airport code or city..."
                        value={destSearch}
                        onChange={(e) => setDestSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-secondary"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1">
                      {filteredDestAirports.map((airport) => (
                        <div
                          key={airport.code}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, destination: airport.code }));
                            setDestDropdownOpen(false);
                            setDestSearch('');
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            formData.destination === airport.code
                              ? 'bg-secondary-light text-secondary font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-bold font-mono mr-2">{airport.code}</span>
                            <span className="text-slate-500">{airport.city}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {airport.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Row 2: Airline, Date, Time & Submit Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end pt-2">
              
              {/* Airline Selection */}
              <div>
                <label htmlFor="quick_airline" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Airline Carrier
                </label>
                <select
                  id="quick_airline"
                  value={formData.airline}
                  onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {AIRLINES.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="quick_date" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Departure Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="quick_date"
                    value={formData.flight_date}
                    onChange={(e) => setFormData({ ...formData, flight_date: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Scheduled Time */}
              <div>
                <label htmlFor="quick_time" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Scheduled Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="quick_time"
                    value={formData.scheduled_departure_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_departure_time: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Action Button: Navigates to Predict Flight page with entered values preserved */}
              <div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-secondary hover:bg-secondary-hover text-white shadow-aviation hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span>Predict Flight</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </form>

          {/* Model Status Note below card */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary mr-1.5 flex-shrink-0" />
              Pre-departure features only: Carrier, Route, Scheduled Hour & Air Distance.
            </span>
            <Link to="/predict" className="font-bold text-secondary hover:underline flex items-center">
              <span>Open Advanced Predictor</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 3. How It Works — Modern Two-Column Layout with /images/airport-terminal.jpg */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Airport Terminal Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200 group bg-primary">
              <img
                src={TERMINAL_IMAGE_URL}
                alt="Modern commercial airport terminal with departing passengers"
                loading="lazy"
                className="w-full h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent" />
              
              {/* Floating terminal info chip */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg space-y-1">
                <div className="flex items-center space-x-2 text-secondary text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Terminal Operations Telemetry</span>
                </div>
                <p className="text-xs text-slate-700">
                  Pre-departure gate buffers, turnaround schedules, and historical airport congestion indicators.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Three Illustrated Steps */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary-light text-secondary text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Three-Step Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                How FlightDelay AI Works
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                A structured, leakage-free pipeline built for passengers, dispatchers, and researchers.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Step 1 */}
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 font-bold font-mono text-base">
                  01
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-primary flex items-center">
                    <span>Enter Flight Details</span>
                    <Plane className="w-4 h-4 ml-2 text-secondary transform -rotate-45" />
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Provide scheduled departure time, airline code, origin, and destination. 
                    Only pre-departure attributes are ingested to maintain authentic predictive validity.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-secondary flex-shrink-0 font-bold font-mono text-base">
                  02
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-primary flex items-center">
                    <span>AI Analyzes Historical Patterns</span>
                    <GitBranch className="w-4 h-4 ml-2 text-accent" />
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evaluates BTS historical records using class imbalance mitigation (SMOTE, cost-sensitive 
                    weighting, and balanced ensembles) to overcome naive majority-class bias.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 font-bold font-mono text-base">
                  03
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-primary flex items-center">
                    <span>View Delay Risk & Confidence</span>
                    <CheckCircle2 className="w-4 h-4 ml-2 text-emerald-600" />
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Receive clear binary classification (On-Time vs Delayed) adhering to the FAA 15-minute 
                    standard, complete with estimated risk level and probability meter.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. Real Aviation Insights (Dataset Statistics) */}
      <section className="py-16 bg-navy-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary-light text-secondary text-xs font-bold uppercase tracking-wider mb-2">
                <Database className="w-3.5 h-3.5" />
                <span>Empirical Grounding</span>
              </div>
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                Aviation Dataset Insights
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Real statistics derived from verified U.S. Bureau of Transportation Statistics historical data.
              </p>
            </div>

            <Link
              to="/analytics"
              className="inline-flex items-center text-xs font-bold text-secondary hover:text-secondary-hover group"
            >
              <span>Explore Interactive Charts</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Dataset Status Logic: Loading skeleton, true statistics if processed, else clean empty state */}
          {loadingStats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft h-32 flex flex-col justify-between">
                  <div className="h-3 w-28 bg-slate-200 rounded" />
                  <div className="h-8 w-20 bg-slate-200 rounded" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : datasetStats?.dataset_found ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Flights Analyzed
                </span>
                <div className="text-3xl font-extrabold text-primary mt-2 font-mono">
                  {datasetStats.total_records.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-1">Excludes canceled flight records</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  On-Time Flights
                </span>
                <div className="text-3xl font-extrabold text-emerald-700 mt-2 font-mono">
                  {datasetStats.on_time_percentage}%
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {datasetStats.on_time_count.toLocaleString()} flights (&lt; 15 min delay)
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Delayed Flights (Minority)
                </span>
                <div className="text-3xl font-extrabold text-amber-700 mt-2 font-mono">
                  {datasetStats.delayed_percentage}%
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {datasetStats.delayed_count.toLocaleString()} flights (≥ 15 min delay)
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Airlines Profiled
                </span>
                <div className="text-3xl font-extrabold text-secondary mt-2 font-mono">
                  {datasetStats.top_carriers ? datasetStats.top_carriers.length : '9+'}
                </div>
                <p className="text-xs text-slate-500 mt-1">Major commercial carriers</p>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft text-center max-w-2xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary">
                Dataset Processing Pending
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To guarantee scientific authenticity, no synthetic statistics are shown. 
                Place your historical BTS CSV in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-primary">ml/data/raw/</code> and 
                run the validator script to generate empirical distribution metrics:
              </p>
              <div className="bg-slate-900 rounded-xl p-3 text-xs font-mono text-emerald-400 max-w-md mx-auto">
                python ml/src/inspect_dataset.py
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 5. Features ("Why Choose FlightDelay AI?") */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary-light text-secondary text-xs font-bold uppercase tracking-wider">
            <span>Engineering Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Why Choose FlightDelay AI?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Addressing critical shortcomings in standard flight prediction models with rigorous machine learning principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-primary mb-2">ML-Powered Prediction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained on multi-dimensional flight attributes including seasonal trends, carrier turnarounds, and airport congestion.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-secondary mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-primary mb-2">Historical Insights</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Grounded exclusively in official commercial airline on-time records published by the U.S. Department of Transportation.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 mb-4">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-primary mb-2">Imbalance-Aware</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mitigates the 80/20 class skew using SMOTE, cost-sensitive re-weighting, and balanced bootstrap ensembles to boost delay recall.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-primary mb-2">Interactive Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dynamic dashboards analyzing diurnal departure patterns, airline reliability scores, and airport delay clusters.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 6. Full-Width CTA Section with /images/airplane-takeoff.jpg */}
      <section className="relative overflow-hidden bg-primary text-white py-24">
        {/* Full-width takeoff background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={CTA_IMAGE_URL}
            alt="Commercial airliner taking off at twilight"
            loading="lazy"
            className="w-full h-full object-cover object-center transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Balanced dark navy gradient overlay keeping the takeoff aircraft visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-secondary/35 backdrop-blur-md border border-secondary/40 text-accent text-xs font-semibold uppercase tracking-wider">
            <span>Ready for Departure?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Take the Uncertainty Out of Your Flight Schedule
          </h2>

          <p className="text-slate-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Whether evaluating passenger departure risk or benchmarking advanced ML resampling techniques, 
            FlightDelay AI provides the empirical tools you need.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/predict"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-bold text-primary bg-accent hover:bg-sky-400 shadow-aviation transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plane className="w-4 h-4 mr-2.5 transform -rotate-45" />
              <span>Launch Flight Predictor</span>
            </Link>

            <Link
              to="/model-comparison"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-bold text-white bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md transition-all duration-200"
            >
              <GitBranch className="w-4 h-4 mr-2.5 text-accent" />
              <span>Compare ML Models</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
