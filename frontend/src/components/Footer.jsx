import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  ShieldCheck,
  Database,
  ExternalLink,
  GitBranch,
  FileText,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-slate-300 border-t border-navy-800">
      
      {/* Upper Pre-Footer Callout */}
      <div className="border-b border-navy-800/80 bg-navy-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Ready to evaluate flight delay risks?
              </h3>
              <p className="text-sm text-slate-400 max-w-xl">
                Experience empirical, leakage-free delay prediction powered by class imbalance-aware machine learning.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/predict"
                className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-bold text-primary bg-accent hover:bg-sky-400 transition-all shadow-md shadow-accent/20 hover:-translate-y-0.5"
              >
                <Plane className="w-4 h-4 mr-2 transform -rotate-45" />
                Predict Flight Delay
              </Link>
              <Link
                to="/model-comparison"
                className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-bold text-white bg-navy-800 hover:bg-navy-700 border border-slate-700 transition-all"
              >
                View Benchmarks
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Context */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Abstract (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-white shadow-md shadow-secondary/30">
                <Plane className="w-5 h-5 transform -rotate-45 text-primary" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                FlightDelay <span className="text-accent">AI</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An engineering machine learning research platform investigating class imbalance 
              in commercial flight delay prediction. Grounded strictly in U.S. Bureau of Transportation 
              Statistics (BTS) data with zero data leakage.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-navy-800/80 border border-navy-700 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-accent" />
                Zero-Leakage Policy
              </div>
              <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-navy-800/80 border border-navy-700 text-xs text-slate-300">
                <Database className="w-3.5 h-3.5 mr-1.5 text-accent" />
                U.S. BTS Historical Records
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform Pages
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-slate-500" /> Home Overview
                </Link>
              </li>
              <li>
                <Link to="/predict" className="hover:text-accent transition-colors flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-slate-500" /> Predict Delay
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-accent transition-colors flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-slate-500" /> Dataset Analytics
                </Link>
              </li>
              <li>
                <Link to="/model-comparison" className="hover:text-accent transition-colors flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-slate-500" /> Model Benchmarks
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors flex items-center">
                  <ArrowRight className="w-3 h-3 mr-1.5 text-slate-500" /> Research & Methods
                </Link>
              </li>
            </ul>
          </div>

          {/* ML Research & Methodologies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Research Focus
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start space-x-1.5">
                <span className="text-accent font-bold">•</span>
                <span>The Accuracy Paradox in Aviation</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-accent font-bold">•</span>
                <span>SMOTE & Synthetic Oversampling</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-accent font-bold">•</span>
                <span>Cost-Sensitive Class Weighting</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-accent font-bold">•</span>
                <span>Balanced Random Forest Ensemble</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-accent font-bold">•</span>
                <span>PR-AUC vs ROC-AUC Evaluation</span>
              </li>
            </ul>
          </div>

          {/* Dataset Scope & Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Dataset Scope
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Domestic U.S. commercial aviation under FAA reporting thresholds. Flights with departure delay 
              $\ge 15$ minutes represent the minority delayed class (~20%).
            </p>
            <div className="p-3 rounded-xl bg-navy-800/60 border border-navy-700/80 text-[11px] text-slate-300">
              <div className="font-semibold text-accent mb-0.5">Geographic Grounding:</div>
              Strictly U.S. domestic carriers (BTS). Does not claim international/Indian flight support.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FlightDelay AI. Engineering Machine Learning Research Project.</p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">FastAPI • React • Tailwind • Imbalanced-Learn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
