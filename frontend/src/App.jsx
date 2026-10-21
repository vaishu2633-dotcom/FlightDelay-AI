import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ModelStatusBanner from './components/ModelStatusBanner';
import Home from './pages/Home';
import PredictFlight from './pages/PredictFlight';
import PredictionResults from './pages/PredictionResults';
import Analytics from './pages/Analytics';
import ModelComparison from './pages/ModelComparison';
import About from './pages/About';
import { fetchModelStatus } from './services/api';

export default function App() {
  const [modelStatus, setModelStatus] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);

  const checkStatus = async () => {
    try {
      const status = await fetchModelStatus();
      setModelStatus(status);
    } catch (err) {
      console.error('Error fetching initial model status:', err);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
        <Navbar modelStatus={modelStatus} />
        <ModelStatusBanner modelStatus={modelStatus} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home modelStatus={modelStatus} />} />
            <Route
              path="/predict"
              element={
                <PredictFlight
                  modelStatus={modelStatus}
                  onPredictionComplete={(pred) => setLastPrediction(pred)}
                />
              }
            />
            <Route path="/results" element={<PredictionResults />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/model-comparison" element={<ModelComparison />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
