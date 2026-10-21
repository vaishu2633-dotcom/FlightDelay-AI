import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
  Search,
  ChevronDown,
  ArrowLeftRight,
  Sparkles
} from 'lucide-react';
import { predictFlight } from '../services/api';

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

// Local aircraft wing photograph
const WING_IMAGE_URL = '/images/flight-wing.jpg';

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export default function PredictFlight({ modelStatus, onPredictionComplete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.initialFlightData || location.state?.formData;

  const [formData, setFormData] = useState(() => ({
    flight_date: initialData?.flight_date || getTodayDateString(),
    airline: initialData?.airline || 'DL',
    origin: initialData?.origin || 'ATL',
    destination: initialData?.destination || 'LAX',
    scheduled_departure_time: initialData?.scheduled_departure_time || '14:30',
    distance: initialData?.distance || 1946,
  }));

  // Autocomplete search states
  const [originSearch, setOriginSearch] = useState('');
  const [originDropdownOpen, setOriginDropdownOpen] = useState(false);
  const [destSearch, setDestSearch] = useState('');
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const originRef = useRef(null);
  const destRef = useRef(null);

  // Close dropdowns on outside click
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwapAirports = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.origin === formData.destination) {
      setErrorMessage('Origin and destination airport cannot be identical.');
      return;
    }

    if (!modelStatus?.is_trained) {
      setErrorMessage(
        'Prediction functionality is currently locked because no validated ML model has been trained yet. To ensure research integrity and eliminate mock outputs, please run `python ml/src/train_models.py` in your backend.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await predictFlight(formData);
      if (onPredictionComplete) {
        onPredictionComplete(result);
      }
      navigate('/results', { state: { prediction: result, formData } });
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during prediction inference.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-secondary-light text-secondary text-xs font-bold uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5 transform -rotate-45" />
            <span>Flight Departure Risk Evaluator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Predict Flight Delay Likelihood
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Input scheduled flight parameters to estimate the probability of departure delays $\ge 15$ minutes, 
            computed with class imbalance mitigation and pre-departure attributes.
          </p>
        </div>

        {/* Two-Column Responsive Layout: Wing Image Alongside Prediction Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Local Flight Wing Image & Research Attributes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Wing Image Showcase Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200 group bg-primary">
              <img
                src={WING_IMAGE_URL}
                alt="Aircraft wing above cloud deck in bright sky"
                className="w-full h-[380px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-secondary flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-accent" />
                    En-Route Operational Standard
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">FAA 15-Min</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Predicting commercial departure delays using strictly pre-departure schedule features.
                </p>
              </div>
            </div>

            {/* Explanatory Cards Alongside Form */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
              <h3 className="text-sm font-bold text-primary flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-secondary" />
                <span>Zero-Leakage Feature Inputs</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2.5">
                  <Clock className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Diurnal Congestion:</strong> Scheduled departure hour captures compounding airport queue accumulation.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2.5">
                  <Plane className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Carrier Turnarounds:</strong> Carrier-specific operational buffers determine delay recovery speed.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Origin & Destination Hubs:</strong> Runway capacity and route air miles influence en-route pacing.
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Prediction Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            
            {/* Status Alert if model pending */}
            {!modelStatus?.is_trained && (
              <div className="mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">
                      Prediction Locked — Model Training Required
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      In accordance with empirical research standards, mock or invented predictions are prohibited. 
                      Run the training pipeline on genuine BTS records to enable inferences.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 flex-shrink-0">
                  python ml/src/train_models.py
                </div>
              </div>
            )}

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-xs sm:text-sm text-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Main Booking-Style Form */}
            <div className="bg-white rounded-3xl shadow-card border border-slate-200 p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Passenger Flight Form
                </span>
                <span className="text-xs text-secondary font-semibold">
                  U.S. Domestic Commercial Routes
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Airports Row with Autocomplete & Swap */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Origin Airport */}
                  <div className="md:col-span-5 relative" ref={originRef}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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

                  {/* Destination Airport */}
                  <div className="md:col-span-5 relative" ref={destRef}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
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

                {/* Carrier & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="airline" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Airline Carrier
                    </label>
                    <select
                      id="airline"
                      name="airline"
                      value={formData.airline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      {AIRLINES.map((a) => (
                        <option key={a.code} value={a.code}>
                          {a.name} ({a.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="flight_date" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Flight Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="flight_date"
                        name="flight_date"
                        value={formData.flight_date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                        required
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Scheduled Time & Distance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="scheduled_departure_time" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Scheduled Departure Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        id="scheduled_departure_time"
                        name="scheduled_departure_time"
                        value={formData.scheduled_departure_time}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                        required
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="distance" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Flight Distance (Miles)
                    </label>
                    <input
                      type="number"
                      id="distance"
                      name="distance"
                      min="50"
                      max="6000"
                      value={formData.distance}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isLoading || !modelStatus?.is_trained}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 ${
                      !modelStatus?.is_trained
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : isLoading
                        ? 'bg-primary text-white cursor-wait'
                        : 'bg-secondary hover:bg-secondary-hover text-white shadow-aviation hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    {!modelStatus?.is_trained ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Predictor Locked (Model Training Required)</span>
                      </>
                    ) : isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Evaluating Pre-Departure Features...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Flight Delay Prediction</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}
