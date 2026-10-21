import React from 'react';
import { AlertTriangle, CheckCircle2, Terminal, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModelStatusBanner({ modelStatus }) {
  if (modelStatus?.is_trained) {
    return (
      <aside aria-label="Model Operational Status" className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2.5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm text-emerald-900">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Model Active:</strong> {modelStatus.model_name || 'Validated Pipeline'} trained with {modelStatus.sampling_technique || 'class imbalance mitigation'}.
            </span>
          </div>
          <Link
            to="/model-comparison"
            className="inline-flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-400"
          >
            <span>View Validation Metrics</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="Model Pending Notice" className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
        <div className="flex items-start sm:items-center space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-bold text-amber-950">Inference Status: Model Training Required.</span> Predictions remain disabled until the ML pipeline trains on historical BTS data to eliminate fake outputs.
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono bg-white px-3 py-1 rounded-lg border border-amber-300 text-amber-900 self-start sm:self-auto shadow-2xs">
          <Terminal className="w-3.5 h-3.5 text-amber-700" />
          <span>python ml/src/train_models.py</span>
        </div>
      </div>
    </aside>
  );
}
