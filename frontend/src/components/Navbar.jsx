import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Compass,
  BarChart3,
  GitCompare,
  FileText
} from 'lucide-react';

export default function Navbar({ modelStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Predict Flight', path: '/predict', icon: Plane },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Model Comparison', path: '/model-comparison', icon: GitCompare },
    { name: 'About & Research', path: '/about', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3.5 group focus:outline-none focus:ring-2 focus:ring-secondary rounded-xl p-1">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-secondary/20 group-hover:scale-105 group-hover:shadow-secondary/30 transition-all">
              <Plane className="w-5 h-5 transform -rotate-45 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-primary leading-none">
                FlightDelay <span className="text-secondary font-black">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">
                Class Imbalance Research
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                    active
                      ? 'text-secondary bg-secondary-light/60 font-bold'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-secondary' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-secondary/10 rounded-xl -z-10 border border-secondary/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Model Status Pill & CTA */}
          <div className="hidden md:flex items-center space-x-3.5">
            {/* Live Model Status Pill */}
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                modelStatus?.is_trained
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
                  : 'bg-amber-50 text-amber-900 border-amber-200/90'
              }`}
              title={modelStatus?.status_message || 'Model Status'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  modelStatus?.is_trained
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />
              <span className="tracking-tight">
                {modelStatus?.is_trained ? 'Model Ready' : 'Training Pending'}
              </span>
            </div>

            {/* Primary Action Button */}
            <Link
              to="/predict"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-secondary hover:bg-secondary-hover shadow-aviation hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plane className="w-4 h-4 mr-2 transform -rotate-45 text-accent" />
              <span>Predict Flight</span>
            </Link>
          </div>

          {/* Mobile menu hamburger toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-primary hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Animated Drawer / Accordion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl overflow-hidden"
          >
            <div className="space-y-1.5 mb-4">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      active
                        ? 'text-secondary bg-secondary-light/70 font-bold border-l-4 border-secondary'
                        : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${active ? 'text-secondary' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Model Status & CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Inference Pipeline:
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    modelStatus?.is_trained
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${modelStatus?.is_trained ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {modelStatus?.is_trained ? 'Model Ready' : 'Training Pending'}
                </span>
              </div>

              <Link
                to="/predict"
                className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold text-white bg-secondary hover:bg-secondary-hover shadow-aviation transition-all"
              >
                <Plane className="w-4 h-4 mr-2 transform -rotate-45 text-accent" />
                Launch Flight Predictor
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
