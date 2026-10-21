import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  GitCompare,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  Terminal,
  RefreshCw,
  Info,
  CheckCircle2,
  Table
} from 'lucide-react';
import { fetchModelComparison } from '../services/api';

export default function ModelComparison() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModelId, setSelectedModelId] = useState(null);

  const loadComparison = async () => {
    setLoading(true);
    try {
      const res = await fetchModelComparison();
      setData(res);
      if (res.models && res.models.length > 0) {
        setSelectedModelId(res.best_model_id || res.models[0].model_id);
      }
    } catch (err) {
      console.error('Error fetching model comparisons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-aviation-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading empirical model evaluation benchmarks...</p>
        </div>
      </div>
    );
  }

  const hasExperiments = data?.experiments_available && data?.models?.length > 0;
  const selectedModel = data?.models?.find((m) => m.model_id === selectedModelId) || data?.models?.[0];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-aviation-100 text-aviation-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Comparative ML Evaluation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Class Imbalance Mitigation Benchmarks
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Rigorous comparative study across baseline classifiers and resampling strategies on commercial flight delay prediction.
            </p>
          </div>

          <button
            onClick={loadComparison}
            className="self-start md:self-auto inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Benchmarks</span>
          </button>
        </div>

        {/* State 1: Experiments Not Run Yet */}
        {!hasExperiments && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <GitCompare className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Awaiting Empirical Benchmark Execution
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {data?.message || 'No benchmark results have been recorded yet.'} In adherence to strict scientific rigor, benchmark tables and confusion matrices are generated only after running empirical experiments.
              </p>

              <div className="bg-slate-900 rounded-xl p-4 text-left font-mono text-xs text-slate-200 mb-6 space-y-2">
                <div className="text-slate-400"># Run the full comparative ML evaluation suite:</div>
                <div className="text-emerald-400 select-all font-bold">python ml/src/evaluate_models.py</div>
              </div>

              <p className="text-xs text-slate-500">
                Evaluation protocol: Chronological train/test split, with resampling restricted strictly within training folds.
              </p>
            </div>

            {/* Research Framework & Hypotheses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center">
                <Award className="w-5 h-5 text-aviation-600 mr-2" />
                Experimental Design & Methodology Matrix
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Resampling & Weighting Strategies</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Baseline:</strong> Unadjusted Logistic Regression & Random Forest.</li>
                    <li><strong>Random Undersampling (RUS):</strong> Subsamples majority on-time flights to equalize class frequency.</li>
                    <li><strong>Random Oversampling (ROS):</strong> Duplicates minority delayed flights.</li>
                    <li><strong>SMOTE:</strong> Synthesizes new minority instances using k-nearest neighbors in feature space.</li>
                    <li><strong>Cost-Sensitive Class Weighting:</strong> Computes inverse-frequency loss penalties.</li>
                    <li><strong>Balanced Random Forest:</strong> Downsamples majority class bootstrap replicates in each tree.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Key Evaluation Metrics</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Recall (Sensitivity):</strong> Proportion of actual delays successfully identified. Crucial for operational readiness.</li>
                    <li><strong>Precision:</strong> Proportion of predicted delays that were genuine.</li>
                    <li><strong>F1-Score:</strong> Harmonic mean balancing precision and recall.</li>
                    <li><strong>PR-AUC:</strong> Area under Precision-Recall curve—the gold standard metric under class imbalance.</li>
                    <li><strong>ROC-AUC:</strong> Discriminative power across classification thresholds.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Experiments Available */}
        {hasExperiments && (
          <div className="space-y-8">
            
            {/* Benchmark Comparison Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Comprehensive Mitigation Benchmark Table
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated on BTS test fold with identical pre-departure feature sets.
                  </p>
                </div>
                {data.best_model_id && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    <Award className="w-3.5 h-3.5 mr-1" />
                    Best Model: {data.best_model_id}
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Model & Strategy</th>
                      <th className="py-3 px-4">Resampling Technique</th>
                      <th className="py-3 px-4 text-right">Accuracy</th>
                      <th className="py-3 px-4 text-right">Precision</th>
                      <th className="py-3 px-4 text-right">Recall (Delay)</th>
                      <th className="py-3 px-4 text-right">F1-Score</th>
                      <th className="py-3 px-4 text-right">ROC-AUC</th>
                      <th className="py-3 px-4 text-right">PR-AUC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.models.map((model) => {
                      const isSelected = model.model_id === selectedModelId;
                      const isBest = model.model_id === data.best_model_id;
                      return (
                        <tr
                          key={model.model_id}
                          onClick={() => setSelectedModelId(model.model_id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-aviation-50/70 font-semibold text-aviation-950' : 'hover:bg-slate-50/80 text-slate-700'
                          }`}
                        >
                          <td className="py-3.5 px-4 flex items-center space-x-2">
                            {isBest && <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                            <span>{model.model_name}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {model.resampling_method}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono">{(model.accuracy * 100).toFixed(2)}%</td>
                          <td className="py-3.5 px-4 text-right font-mono">{(model.precision * 100).toFixed(2)}%</td>
                          <td className="py-3.5 px-4 text-right font-mono text-aviation-700 font-bold">
                            {(model.recall * 100).toFixed(2)}%
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono">{(model.f1_score * 100).toFixed(2)}%</td>
                          <td className="py-3.5 px-4 text-right font-mono">{(model.roc_auc * 100).toFixed(2)}%</td>
                          <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">
                            {(model.pr_auc * 100).toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Charts: Recall & PR-AUC Comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Bar Chart: Recall Comparison (Minority Class Detection) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Recall Comparison (Minority Class Sensitivity)
                  </h3>
                  <span className="text-xs text-slate-500">Higher is Better</span>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.models.map((m) => ({ name: m.model_id, Recall: Math.round(m.recall * 100) }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(val) => [`${val}%`, 'Recall']} />
                      <Bar dataKey="Recall" fill="#0284c7" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-slate-500 text-center mt-2">
                  Notice how unmitigated baseline models yield extremely low recall, whereas SMOTE and balanced ensembles substantially elevate minority detection.
                </p>
              </div>

              {/* Confusion Matrix Visualizer for Selected Model */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Confusion Matrix: {selectedModel?.model_name || 'Selected Model'}
                    </h3>
                    <span className="text-xs font-mono text-slate-500">Test Fold</span>
                  </div>

                  {selectedModel?.confusion_matrix ? (
                    <div className="max-w-xs mx-auto my-4 border border-slate-200 rounded-xl overflow-hidden text-center text-xs">
                      <div className="grid grid-cols-3 bg-slate-100 font-bold py-2 border-b border-slate-200">
                        <span>Actual \ Pred</span>
                        <span>Pred: On-Time</span>
                        <span>Pred: Delayed</span>
                      </div>
                      
                      {/* Row 1: Actual On-Time */}
                      <div className="grid grid-cols-3 border-b border-slate-100 py-3 items-center">
                        <span className="font-semibold text-slate-600">Actual: On-Time</span>
                        <span className="font-mono bg-emerald-50 text-emerald-800 font-bold py-1">
                          TN: {selectedModel.confusion_matrix[0][0].toLocaleString()}
                        </span>
                        <span className="font-mono bg-amber-50 text-amber-800 py-1">
                          FP: {selectedModel.confusion_matrix[0][1].toLocaleString()}
                        </span>
                      </div>

                      {/* Row 2: Actual Delayed */}
                      <div className="grid grid-cols-3 py-3 items-center">
                        <span className="font-semibold text-slate-600">Actual: Delayed</span>
                        <span className="font-mono bg-red-50 text-red-800 py-1">
                          FN: {selectedModel.confusion_matrix[1][0].toLocaleString()}
                        </span>
                        <span className="font-mono bg-emerald-50 text-emerald-800 font-bold py-1">
                          TP: {selectedModel.confusion_matrix[1][1].toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-400">
                      Confusion matrix data not available for this model.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Sensitivity (Recall): {Math.round((selectedModel?.recall || 0) * 100)}%</span>
                  <span>Precision: {Math.round((selectedModel?.precision || 0) * 100)}%</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
