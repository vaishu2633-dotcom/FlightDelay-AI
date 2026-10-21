import React from 'react';
import {
  BookOpen,
  Award,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Database,
  GitBranch,
  Terminal,
  FileText,
  ExternalLink
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-aviation-100 text-aviation-800 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Research Methodology & Technical Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Class Imbalance in Commercial Flight Delay Prediction
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Evaluation and Mitigation Techniques for Predictive Aviation Analytics.
          </p>
        </div>

        {/* Abstract & Research Problem Statement */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <FileText className="w-5 h-5 text-aviation-600 mr-2" />
            Project Abstract & Problem Statement
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Commercial aviation operates under stringent reliability protocols. Consequently, historical flight databases 
            typically exhibit an intrinsic class imbalance: approximately <strong>78% to 83%</strong> of flights depart 
            on-time, while only <strong>17% to 22%</strong> encounter delays exceeding the Federal Aviation Administration 
            (FAA) standard threshold of 15 minutes.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            When standard machine learning classifiers (such as unweighted Logistic Regression or Random Forests) are trained 
            on this skewed distribution, they naturally optimize for overall accuracy by heavily favoring the majority on-time class. 
            This induces the notorious <em>"Accuracy Paradox"</em>: a model can report 80%+ accuracy while failing to identify a single 
            delayed flight (yielding a near-zero Recall). In practical aviation operations, false negatives (unpredicted delays) cause severe 
            passenger disruption, crew rescheduling failures, and gate congestion.
          </p>
        </div>

        {/* Research Objectives Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Key Research Objectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-aviation-50 text-aviation-600 flex items-center justify-center mb-3">
                <span className="font-bold font-mono text-sm">01</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Empirical Class Imbalance Profiling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quantify the true distribution of commercial departure delays using official U.S. Bureau of Transportation Statistics (BTS) data, 
                demonstrating the discrepancy between raw classification accuracy and genuine delay detection.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <span className="font-bold font-mono text-sm">02</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Comparative Mitigation Suite</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Benchmark five distinct mitigation paradigms: Random Undersampling (RUS), Random Oversampling (ROS), 
                Synthetic Minority Over-sampling Technique (SMOTE), Cost-Sensitive Class Weighting, and Balanced Ensembles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <span className="font-bold font-mono text-sm">03</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Rigorous Data Leakage Quarantine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ensure strict predictive validity by isolating inputs exclusively to pre-departure schedules. 
                Any feature influenced by the departure process itself (e.g. TaxiOut, WheelsOff) is strictly purged.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <span className="font-bold font-mono text-sm">04</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">In-Fold Resampling Isolation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enforce scientific evaluation protocols where synthetic oversampling or undersampling is applied 
                strictly within cross-validation training folds, preventing information bleed into validation sets.
              </p>
            </div>

          </div>
        </div>

        {/* Technical Architecture & Leakage Prevention Table */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <ShieldCheck className="w-5 h-5 text-aviation-600 mr-2" />
            Feature Engineering & Leakage Quarantine Policy
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Feature Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Predictive Status</th>
                  <th className="py-2.5 px-3">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">CRSDepTime / DepHour</td>
                  <td className="py-2.5 px-3 text-slate-600">Temporal</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Included</td>
                  <td className="py-2.5 px-3 text-slate-500">Scheduled departure hour captures diurnal airport congestion.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">Month / DayOfWeek</td>
                  <td className="py-2.5 px-3 text-slate-600">Temporal</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Included</td>
                  <td className="py-2.5 px-3 text-slate-500">Captures seasonal trends and weekend vs weekday volume.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">Reporting_Airline</td>
                  <td className="py-2.5 px-3 text-slate-600">Carrier</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Included</td>
                  <td className="py-2.5 px-3 text-slate-500">Fleet turnaround efficiency and carrier-specific buffer policies.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">Origin & Dest</td>
                  <td className="py-2.5 px-3 text-slate-600">Spatial</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">✓ Included</td>
                  <td className="py-2.5 px-3 text-slate-500">Captures hub-and-spoke congestion and runway bottlenecks.</td>
                </tr>
                <tr className="bg-red-50/50">
                  <td className="py-2.5 px-3 font-mono text-red-700 line-through">DepTime / TaxiOut</td>
                  <td className="py-2.5 px-3 text-slate-600">Post-Schedule</td>
                  <td className="py-2.5 px-3 text-red-700 font-bold">✗ Quarantined</td>
                  <td className="py-2.5 px-3 text-slate-500">Actual departure time contains the delay label itself (Fatal Leakage).</td>
                </tr>
                <tr className="bg-red-50/50">
                  <td className="py-2.5 px-3 font-mono text-red-700 line-through">ArrDelay / AirTime</td>
                  <td className="py-2.5 px-3 text-slate-600">Post-Schedule</td>
                  <td className="py-2.5 px-3 text-red-700 font-bold">✗ Quarantined</td>
                  <td className="py-2.5 px-3 text-slate-500">Arrival values occur hours after departure decision point.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dataset Scope & Geographic Authenticity */}
        <div className="bg-aviation-900 text-white rounded-3xl p-8 space-y-4">
          <div className="flex items-center space-x-2 text-aviation-300 text-xs font-bold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Dataset Grounding & Geographic Scope</span>
          </div>
          <h2 className="text-xl font-bold">U.S. Bureau of Transportation Statistics (BTS)</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            This study is strictly grounded in the official Airline On-Time Performance database maintained 
            by the U.S. Department of Transportation Bureau of Transportation Statistics. The models are trained 
            on domestic commercial flight segments operating across major U.S. hubs.
          </p>
          <div className="p-4 rounded-xl bg-aviation-800/80 border border-aviation-700 text-xs text-aviation-200">
            <strong>Geographic Authenticity Note:</strong> The platform does not claim Indian or international flight support, 
            as airport turnaround mechanics, slot rules, and ATC protocols vary substantially across national aviation authorities.
          </div>
        </div>

      </div>
    </div>
  );
}
