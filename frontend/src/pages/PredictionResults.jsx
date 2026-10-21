import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Plane,
  Clock,
  MapPin,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Percent,
  Layers,
  Sparkles
} from 'lucide-react';

export default function PredictionResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const prediction = state.prediction;
  const flight = state.formData || {};

  if (!prediction) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-aviation-50 text-aviation-600 flex items-center justify-center mx-auto mb-4">
            <Plane className="w-6 h-6 transform -rotate-45" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Prediction Result</h2>
          <p className="text-xs text-slate-500 mb-6">
            Please fill out the flight prediction form to generate delay probability estimates.
          </p>
          <Link
            to="/predict"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-aviation-600 hover:bg-aviation-700 shadow-sm"
          >
            Go to Predict Flight
          </Link>
        </div>
      </div>
    );
  }

  const isDelayed = prediction.is_delayed;
  const delayPercent = Math.round(prediction.delay_probability * 100);
  const onTimePercent = Math.round(prediction.on_time_probability * 100);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/predict')}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-aviation-700"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Predictor Form
          </button>
        </div>

        {/* Prediction Outcome Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          
          {/* Header Banner */}
          <div className={`px-6 sm:px-8 py-6 text-white ${
            isDelayed 
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700' 
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                  {isDelayed ? (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold opacity-90">
                    Predicted Departure Status
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {prediction.predicted_status}
                  </h1>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl text-right self-start sm:self-auto">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                  Risk Assessment
                </span>
                <span className="text-lg font-bold">
                  {prediction.risk_level} Delay Risk
                </span>
              </div>
            </div>
          </div>

          {/* Probability Gauge & Breakdown */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Model Estimated Probabilities
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Confidence: {Math.round(prediction.confidence_score * 100)}%
                </span>
              </div>

              {/* Probability Meter Bar */}
              <div className="w-full h-6 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${onTimePercent}%` }}
                  className="h-full bg-emerald-500 transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-white"
                  title="On-Time Probability"
                >
                  {onTimePercent >= 15 ? `${onTimePercent}% On-Time` : ''}
                </div>
                <div
                  style={{ width: `${delayPercent}%` }}
                  className="h-full bg-amber-500 transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-white"
                  title="Delay Probability"
                >
                  {delayPercent >= 15 ? `${delayPercent}% Delay` : ''}
                </div>
              </div>

              <div className="flex justify-between text-xs font-semibold mt-2 text-slate-600">
                <span className="flex items-center text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 mr-1.5" />
                  On-Time (Delay &lt; 15 min): {onTimePercent}%
                </span>
                <span className="flex items-center text-amber-700">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 mr-1.5" />
                  Delayed (Delay ≥ 15 min): {delayPercent}%
                </span>
              </div>
            </div>

            {/* Flight Summary Grid */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Flight Schedule Profile
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center text-slate-400 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5 mr-1" /> Date
                  </div>
                  <div className="text-sm font-bold text-slate-900">{flight.flight_date || 'N/A'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center text-slate-400 text-xs mb-1">
                    <Plane className="w-3.5 h-3.5 mr-1" /> Carrier
                  </div>
                  <div className="text-sm font-bold text-slate-900">{flight.airline || 'N/A'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center text-slate-400 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> Route
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {flight.origin || 'N/A'} → {flight.destination || 'N/A'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center text-slate-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5 mr-1" /> Scheduled
                  </div>
                  <div className="text-sm font-bold text-slate-900">{flight.scheduled_departure_time || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Model & Research Attribution */}
            <div className="pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6 sm:-mx-8 sm:-mb-8 sm:p-8 space-y-3">
              <div className="flex items-start space-x-3 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-aviation-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Pipeline Transparency:</strong> Generated by <em>{prediction.model_name}</em>. 
                  Trained with resampling on historical U.S. BTS commercial flights. Strictly excludes post-departure leakage.
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  Timestamp: {new Date(prediction.prediction_timestamp).toLocaleTimeString()}
                </span>

                <button
                  onClick={() => navigate('/predict')}
                  className="inline-flex items-center text-xs font-bold text-aviation-700 hover:text-aviation-900"
                >
                  Predict Another Flight →
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
