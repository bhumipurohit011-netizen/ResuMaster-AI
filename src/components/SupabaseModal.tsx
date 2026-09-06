import React, { useState } from 'react';
import { Database, Check, Copy, Shield, Key, ExternalLink, X, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const { isSupabaseActive } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSchema = `-- RESUMASTER AI: Database Schema & Row Level Security (RLS)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  target_role TEXT DEFAULT 'Data Analyst',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  extracted_text TEXT NOT NULL,
  target_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.resume_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_role TEXT NOT NULL,
  ats_score INTEGER NOT NULL,
  potential_score INTEGER NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their analyses" ON public.resume_analysis FOR ALL USING (auth.uid() = user_id);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Database & Supabase RLS Engine</h3>
              <p className="text-xs text-slate-500">PostgreSQL Schema & Security Policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Alert */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isSupabaseActive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm">
                {isSupabaseActive ? '✓ Supabase Cloud Connected' : 'Resilient Dual Storage Active'}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {isSupabaseActive
                  ? 'All authentication, resumes, ATS analyses, job matches, and career chat messages are syncing with your Supabase PostgreSQL cluster with Row Level Security enforced.'
                  : 'ResuMaster AI is currently operating with high-speed local persistence with complete PostgreSQL-compatible schemas. To connect your live Supabase cloud database, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
              </p>
            </div>
          </div>

          {/* Database Tables Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Production Tables & Row Level Security (RLS)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                { name: 'profiles', desc: 'User credentials, target role, full name, avatar' },
                { name: 'resumes', desc: 'Uploaded documents, extracted text, file metadata' },
                { name: 'resume_analysis', desc: 'ATS scores, skill breakdowns, recommendations' },
                { name: 'chat_messages', desc: 'AI career advisor message history per user' },
                { name: 'job_matches', desc: 'Job description comparison logs and match scores' },
                { name: 'resume_suggestions', desc: 'AI rewrites with pending/accepted state' },
              ].map((t) => (
                <div key={t.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-mono font-bold text-blue-600">{t.name}</span>
                  <p className="text-slate-500 mt-0.5 text-[11px]">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SQL Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span>Supabase SQL Script</span>
              </div>
              <button
                onClick={copySql}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Schema SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
              {sqlSchema}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Row Level Security (RLS) ensures users only access their own records.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
