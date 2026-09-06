import React from 'react';
import { Sparkles, FileText, User as UserIcon, LogOut, ArrowRight, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenDbModal?: () => void;
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenDbModal,
  currentView = 'landing',
  onNavigate,
}) => {
  const { user, logout, isSupabaseActive } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate && onNavigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">ResuMaster</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wider">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">AI Resume Analyzer & Career Guidance</p>
          </div>
        </button>

        {/* Center Links (Landing page only) */}
        {!user && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#ai-advisor" className="hover:text-blue-600 transition-colors">AI Advisor</a>
            <a href="#ats-score" className="hover:text-blue-600 transition-colors">ATS Scoring</a>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Pro Free in Beta
            </span>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Database Setup Pill / Status */}
          {onOpenDbModal && (
            <button
              onClick={onOpenDbModal}
              title="View Supabase PostgreSQL Schema & Status"
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                isSupabaseActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>{isSupabaseActive ? 'Supabase Connected' : 'DB / RLS Schema'}</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {currentView === 'landing' && (
                <button
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200/70">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-slate-800">{user.full_name}</span>
              </div>

              <button
                onClick={logout}
                title="Sign out"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
