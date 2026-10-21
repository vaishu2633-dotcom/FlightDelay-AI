import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Database,
  PieChart as PieIcon,
  Clock,
  Plane,
  AlertCircle,
  Terminal,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { fetchDatasetSummary } from '../services/api';

const PIE_COLORS = ['#10b981', '#f59e0b']; // Emerald for On-Time, Amber for Delayed

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const summary = await fetchDatasetSummary();
      setData(summary);
    } catch (err) {
      setError(err.message || 'Failed to load dataset summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-aviation-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading BTS flight dataset analytics...</p>
        </div>
      </div>
    );
  }

  const isDatasetAvailable = data?.dataset_found;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-aviation-100 text-aviation-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Empirical Aviation Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Commercial Flight Dataset Analytics
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Statistical breakdown of flight delays, hourly congestion patterns, and class distribution in historical BTS records.
            </p>
          </div>

          <button
            onClick={loadSummary}
            className="self-start md:self-auto inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* State 1: No Processed Dataset Found Yet */}
        {!isDatasetAvailable && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Raw Dataset Awaiting Processing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {data?.message || 'No processed BTS dataset summary was detected.'} To adhere strictly to empirical standards without fabricated records, run the dataset inspection script to process real historical flights.
              </p>

              <div className="bg-slate-900 rounded-xl p-4 text-left font-mono text-xs text-slate-200 mb-6 space-y-2">
                <div className="text-slate-400"># 1. Place your BTS flight CSV in ml/data/raw/</div>
                <div className="text-aviation-400"># 2. Run the dataset inspection and validation script:</div>
                <div className="text-emerald-400 select-all font-bold">python ml/src/inspect_dataset.py</div>
              </div>

              <div className="p-4 rounded-xl bg-aviation-50 border border-aviation-100 text-left text-xs text-aviation-900 space-y-1">
                <p className="font-bold">Official Data Source:</p>
                <p className="text-slate-600">
                  U.S. Bureau of Transportation Statistics (BTS) Airline On-Time Performance Data (Domestic Flights).
                </p>
              </div>
            </div>

            {/* Educational Overview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Expected BTS Flight Dataset Architecture
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                When processed, the inspection pipeline validates and extracts the following pre-departure dimensions:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Temporal Dimensions</span>
                  <p className="text-slate-500">Month, Day of Week, Scheduled Departure Hour (CRSDepTime // 100)</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Spatial Dimensions</span>
                  <p className="text-slate-500">Origin Airport (IATA), Destination Airport (IATA), Distance (miles)</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Carrier Dimension</span>
                  <p className="text-slate-500">Reporting Carrier (DL, AA, UA, WN, etc.)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Processed Dataset Available */}
        {isDatasetAvailable && (
          <div className="space-y-8">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Valid Flights
                </span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  {data.total_records ? data.total_records.toLocaleString() : 'N/A'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Excludes canceled flights</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  On-Time Flights (Class 0)
                </span>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {data.on_time_count ? data.on_time_count.toLocaleString() : 'N/A'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {data.total_records ? `${((data.on_time_count / data.total_records) * 100).toFixed(1)}% of total` : ''}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Delayed Flights (Class 1)
                </span>
                <div className="text-2xl font-extrabold text-amber-700 mt-1">
                  {data.delayed_count ? data.delayed_count.toLocaleString() : 'N/A'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {data.minority_percentage ? `${data.minority_percentage}% (Delay ≥ 15m)` : ''}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-aviation-600">
                  Class Imbalance Ratio
                </span>
                <div className="text-2xl font-extrabold text-aviation-800 mt-1">
                  {data.imbalance_ratio || 'N/A'}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">On-Time vs Delayed Ratio</p>
              </div>

            </div>

            {/* Charts Row 1: Pie Chart & Hourly Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Class Imbalance Donut Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <PieIcon className="w-4 h-4 mr-2 text-aviation-600" />
                    Target Variable Distribution (Binary)
                  </h3>
                  <span className="text-xs text-slate-500">FAA 15-min Threshold</span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'On-Time (<15 min)', value: data.on_time_count || 0 },
                          { name: 'Delayed (≥15 min)', value: data.delayed_count || 0 },
                        ]}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {PIE_COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-xs text-slate-500 text-center mt-2">
                  Demonstrates the acute minority status of delayed flights (~20%), underscoring the requirement for specialized resampling.
                </p>
              </div>

              {/* Delay Rate by Scheduled Hour */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-aviation-600" />
                    Delay Rate by Departure Hour (Compounding Delays)
                  </h3>
                  <span className="text-xs text-slate-500">00:00 - 23:00</span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.hourly_distribution || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(val) => [`${val}%`, 'Delay Rate']} labelFormatter={(label) => `Hour: ${label}:00`} />
                      <Line type="monotone" dataKey="delay_rate" stroke="#0284c7" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-xs text-slate-500 text-center mt-2">
                  Delays consistently compound throughout the day as turnaround buffers absorb schedule propagation.
                </p>
              </div>

            </div>

            {/* Charts Row 2: Top Carriers & Top Airports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Carrier Delay Rate */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <Plane className="w-4 h-4 mr-2 text-aviation-600" />
                    Carrier Delay Rates (%)
                  </h3>
                  <span className="text-xs text-slate-500">Major Carriers</span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.top_carriers || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="carrier" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(val) => [`${val}%`, 'Delay Rate']} />
                      <Bar dataKey="delay_rate" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Airport Delay Rate */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-aviation-600" />
                    Origin Hub Delay Rates (%)
                  </h3>
                  <span className="text-xs text-slate-500">Major Origin Airports</span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.top_airports || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="airport" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(val) => [`${val}%`, 'Delay Rate']} />
                      <Bar dataKey="delay_rate" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
