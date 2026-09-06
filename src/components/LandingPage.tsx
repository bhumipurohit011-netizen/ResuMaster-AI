import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Bot,
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  Search,
  Check,
  RefreshCw,
  Clock,
  Briefcase,
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../lib/sampleResumes';

interface LandingPageProps {
  onGetStarted: () => void;
  onTrySample: (sampleId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onTrySample }) => {
  return (
    <div className="w-full bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Messaging */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Career Intelligence Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Build a stronger resume.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Get hired faster.
                </span>
              </h1>

              <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                ResuMaster AI analyzes your resume, checks ATS compatibility, identifies skill gaps,
                matches your resume with job descriptions, and gives personalized career recommendations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-base transition-all hover:scale-[1.02]"
                >
                  <span>Analyze My Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-base transition-colors text-center"
                >
                  See How It Works
                </a>
              </div>

              {/* Quick Sample Selector for Instant Demo */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Quick test with sample resume:</span>
                {SAMPLE_RESUMES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onTrySample(sample.id)}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 font-medium transition-colors shadow-2xs"
                  >
                    {sample.role}
                  </button>
                ))}
              </div>

              {/* Trust badging */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>PDF, DOCX & TXT Supported</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>100% Private & Secure</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Dashboard Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-5 sm:p-6 backdrop-blur-sm">
                {/* Mock header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      R
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Hi Rakshit! 👋</p>
                      <p className="text-[10px] text-slate-400">Target Role: Data Analyst</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <Check className="w-3 h-3" /> Analysis Complete 🎯
                  </span>
                </div>

                {/* Main Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
                    <p className="text-[10px] font-bold text-blue-700 uppercase">ATS Score</p>
                    <p className="text-2xl font-black text-blue-900 mt-0.5">72<span className="text-xs font-semibold text-slate-400">/100</span></p>
                  </div>
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
                    <p className="text-[10px] font-bold text-indigo-700 uppercase">Potential</p>
                    <p className="text-2xl font-black text-indigo-900 mt-0.5">87<span className="text-xs font-semibold text-slate-400">/100</span></p>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase">Skill Match</p>
                    <p className="text-2xl font-black text-emerald-900 mt-0.5">78%</p>
                  </div>
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
                    <p className="text-[10px] font-bold text-amber-700 uppercase">Gain</p>
                    <p className="text-2xl font-black text-amber-900 mt-0.5">+15</p>
                  </div>
                </div>

                {/* Breakdown Progress Bars */}
                <div className="space-y-2 mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600 font-semibold mb-1">
                    <span>ATS Compatibility</span>
                    <span className="text-blue-600 font-bold">82%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 font-semibold pt-1 mb-1">
                    <span>Keywords & Domain Alignment</span>
                    <span className="text-indigo-600 font-bold">64%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>

                {/* Interactive recommendation teaser */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">1. Improve Professional Summary</p>
                      <p className="text-[10px] text-slate-500">+3 Potential ATS Points</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">High Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase">Simple 4-Step Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              How ResuMaster AI Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Transform your resume from an overlooked document into an interview-generating asset.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Upload Your Resume',
                desc: 'Upload your PDF, DOCX, or TXT resume (up to 10MB). Text is securely extracted in seconds.',
                icon: FileCheck2,
              },
              {
                step: '02',
                title: 'Select Target Role',
                desc: 'Choose your desired job role (Data Analyst, ML Engineer, Full Stack, etc.) to tailor the ATS scoring.',
                icon: Target,
              },
              {
                step: '03',
                title: 'AI Analysis & Score',
                desc: 'Gemini evaluates keywords, project framing, formatting, and generates an honest 0-100 ATS score.',
                icon: BarChart3,
              },
              {
                step: '04',
                title: 'Rewrites & AI Advisor',
                desc: 'Accept tailored AI rewrites, close critical skill gaps, and chat with your personalized career advisor.',
                icon: Bot,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
                  <div className="text-3xl font-black text-slate-200 mb-3">{item.step}</div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase">Built for Real Results</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Everything You Need to Get Hired
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: ATS Compatibility */}
            <div className="p-7 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-blue-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5">Comprehensive ATS Scoring</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Receive an objective score (0–100) decomposed into technical skills, keyword frequency, achievements, experience, and machine readability.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>8-dimension ATS score breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Potential score target calculator</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Skill Gap Detection */}
            <div className="p-7 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-indigo-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5">Skill Gap & Learning Paths</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Instantly identify high-demand skills missing from your resume for your target role, with recommended learning paths to master them.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Proficiency rating (Advanced to Beginner)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Role-specific missing skills matrix</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Job Matcher */}
            <div className="p-7 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center mb-5 shadow-sm shadow-blue-600/20">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5">Job Description Matcher</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Paste any live job posting to calculate match percentage, missing keywords, and legitimate optimization advice without deceptive claims.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Direct JD vs. Resume comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Strict ethical alignment rules</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI CAREER ADVISOR CHATBOT SPOTLIGHT */}
      <section id="ai-advisor" className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                <Bot className="w-3.5 h-3.5" />
                <span>Personalized Career Mentorship</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                An AI Career Advisor That Knows Your Real Resume
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Unlike generic chatbots, ResuMaster AI's career advisor is pre-briefed on your actual ATS score,
                target role, strengths, missing keywords, and project history.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  'Why is my ATS score low and how can I boost it?',
                  'What portfolio projects should I build for Data Analyst?',
                  'Rewrite my summary to emphasize SQL and Python metrics',
                  'Give me realistic technical interview practice questions',
                ].map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">Q</span>
                    <span>"{q}"</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Chat Window Mockup */}
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">ResuMaster AI Career Advisor</p>
                      <p className="text-[10px] text-emerald-400 font-medium">● Connected with your resume analysis</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4 bg-slate-50/50 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200 shadow-2xs max-w-md text-slate-700 space-y-1.5">
                      <p className="font-bold text-slate-900">Hi Rakshit! 👋</p>
                      <p>
                        I've analyzed your resume for the <strong>Data Analyst</strong> role. Your current ATS score is <strong>72/100</strong>.
                      </p>
                      <p className="text-slate-600">
                        You have strong foundations in SQL and Python. To reach an <strong>87/100</strong>, let's quantify your Power BI project impact and add A/B testing terminology.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-end gap-2.5">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-xs max-w-md">
                      How should I rewrite my project description to show measurable results?
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200 shadow-2xs max-w-md text-slate-700 space-y-2">
                      <p className="font-semibold text-slate-900">Here is an optimized XYZ format rewrite:</p>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 italic">
                        "Engineered interactive Power BI dashboards tracking omnichannel sales for 45 retail stores, cutting manual reporting by 92% (from 6 hrs to 25 mins weekly)."
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to make your resume truly job-ready?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
            Get your comprehensive ATS score, pinpoint high-impact skill gaps, and chat with your AI career advisor today.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-xl text-base transition-all hover:scale-105"
            >
              Analyze My Resume Now
            </button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="font-bold text-white text-sm">ResuMaster AI</span>
            <span className="text-slate-500 ml-2">© {new Date().getFullYear()} ResuMaster AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#ai-advisor" className="hover:text-white transition-colors">AI Advisor</a>
            <span className="text-slate-600">Privacy & Security First</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
