import React, { useState } from 'react';
import {
  Award,
  Zap,
  TrendingUp,
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  XCircle,
  Maximize2,
  UploadCloud,
  Send,
  Sparkles,
} from 'lucide-react';
import { ResumeAnalysisResult, UserProfile } from '../types';
import { ResumeUpload } from './ResumeUpload';
import { NavTab } from './Sidebar';

interface DashboardHomeProps {
  user: UserProfile;
  analysis: ResumeAnalysisResult | null;
  onAnalysisSuccess: (analysis: ResumeAnalysisResult, resumeMeta: any) => void;
  onNavigateTab: (tab: NavTab) => void;
  onAskAdvisor: (query: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  user,
  analysis,
  onAnalysisSuccess,
  onNavigateTab,
  onAskAdvisor,
}) => {
  const [showUploadForm, setShowUploadForm] = useState(!analysis);
  const [chatInput, setChatInput] = useState('');
  const [miniChatMessages, setMiniChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: analysis
        ? `Hi ${user.full_name}! I've analyzed your resume against the ${analysis.target_role} role. Your current score is ${analysis.ats_score}. Would you like me to rewrite your Professional Summary to improve it by +5 points?`
        : `Hi ${user.full_name}! Upload your resume below to evaluate your ATS score and get actionable career suggestions.`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const targetRole = analysis?.target_role || user.target_role || 'Data Analyst';
  const atsScore = analysis?.ats_score ?? 72;
  const potentialScore = analysis?.potential_score ?? 87;
  const scoreGain = Math.max(0, potentialScore - atsScore);
  const skillMatch = analysis?.breakdown?.technicalSkills ?? 78;

  const handleMiniChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userText = chatInput.trim();
    setMiniChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMiniChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Great question! For the ${targetRole} role, focusing on quantifying outcomes and including industry-standard tools will give you the highest immediate ATS score boost. You can also open the full Career Advisor for deep guidance.`,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Upload Toggle Drawer or Area */}
      {showUploadForm ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Resume Upload & ATS Assessment</h3>
              <p className="text-xs text-slate-500">
                Upload your resume (PDF, DOCX, TXT) or load an industry sample to calculate your score
              </p>
            </div>
            {analysis && (
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Close Uploader
              </button>
            )}
          </div>
          <ResumeUpload
            initialRole={targetRole}
            userName={user.full_name}
            onAnalysisStart={() => {}}
            onAnalysisSuccess={(result, resumeMeta) => {
              setShowUploadForm(false);
              onAnalysisSuccess(result, resumeMeta);
            }}
            onAnalysisError={(err) => alert(err)}
          />
        </div>
      ) : (
        /* Top Action Bar when analysis exists */
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">Active Resume Analysis</span>
              <p className="text-[11px] text-slate-500">
                Targeting <strong className="text-slate-700 font-semibold">{targetRole}</strong> • ATS Score{' '}
                <strong className="text-blue-600 font-bold">{atsScore}/100</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('score')}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Full Score Breakdown
            </button>
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload New Resume</span>
            </button>
          </div>
        </div>
      )}

      {/* TWO-COLUMN PROFESSIONAL POLISH GRID */}
      {analysis && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Card 1: ATS Analysis Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                ATS Analysis Overview
              </h3>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                {/* Circular Gauge */}
                <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      strokeDasharray="100, 100"
                      className="text-slate-100"
                      strokeWidth="3"
                      fill="none"
                      stroke="currentColor"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      strokeDasharray={`${atsScore}, 100`}
                      className="text-blue-600 transition-all duration-700"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      stroke="currentColor"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-slate-800">{atsScore}</span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                      ATS Score
                    </span>
                  </div>
                </div>

                {/* Metrics + AI Insight Box */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">Potential Score</span>
                      <span className="text-lg font-bold text-blue-600">{potentialScore}/100</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs text-slate-500">Skill Match</span>
                      <span className="text-lg font-bold text-green-600">{skillMatch}%</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-[11px] leading-relaxed text-blue-800">
                      <span className="font-bold">AI Insight:</span> Your score can increase by{' '}
                      <span className="font-bold">+{scoreGain} points</span> by adding missing keywords like{' '}
                      <span className="font-medium">
                        '{analysis.missing_skills?.[0]?.name || 'A/B Testing'}'
                      </span>{' '}
                      and{' '}
                      <span className="font-medium">
                        '{analysis.missing_skills?.[1]?.name || 'Tableau'}'
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Critical Improvements */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Critical Improvements
                </h3>
                <button
                  onClick={() => onNavigateTab('rewrites')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Open Rewriter</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                {/* 1. High Priority */}
                <div className="p-4 border border-orange-100 bg-orange-50/50 rounded-xl space-y-1 hover:border-orange-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-700 uppercase">High Priority</span>
                    <span className="text-[10px] text-orange-600 font-medium">+5 Points</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">Improve Professional Summary</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.recommendations?.[0]?.howToFix ||
                      'Your summary is too generic. Mention target role + strongest skills + quantified results.'}
                  </p>
                </div>

                {/* 2. Moderate Priority */}
                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl space-y-1 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase">Moderate</span>
                    <span className="text-[10px] text-blue-600 font-medium">+4 Points</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">Quantify Achievements</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.recommendations?.[1]?.howToFix ||
                      'Add numbers to your data projects (e.g., "Increased accuracy by 15%").'}
                  </p>
                </div>

                {/* 3. Formatting / Keywords */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-1 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Formatting</span>
                    <span className="text-[10px] text-slate-400 font-medium">+2 Points</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">Missing Job Keywords</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysis.missing_skills?.map((s) => s.name).slice(0, 3).join(', ') ||
                      'Tableau, Pandas, and Model Deployment'} are mentioned in target role postings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col space-y-6">
            {/* Card 3: Strengths & Weaknesses */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Strengths & Weaknesses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Strengths</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    {(analysis.strengths && analysis.strengths.length > 0
                      ? analysis.strengths.slice(0, 3)
                      : ['Strong technical foundation', 'ATS-friendly layout', 'Clean Education section']
                    ).map((st, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-slate-400">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-3 sm:border-l sm:border-slate-100 sm:pl-4">
                  <div className="flex items-center space-x-2 text-red-500">
                    <XCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Weaknesses</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    {(analysis.weaknesses && analysis.weaknesses.length > 0
                      ? analysis.weaknesses.slice(0, 3)
                      : ['Missing role-specific skills', 'Vague work experience', 'Low keyword density']
                    ).map((wk, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-slate-400">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 4: AI Career Advisor Widget */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[380px]">
              {/* Header */}
              <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">AI Career Advisor</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('advisor')}
                  title="Expand to Full Advisor"
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/30 max-h-[250px]">
                {miniChatMessages.map((msg, idx) => (
                  <React.Fragment key={idx}>
                    {msg.sender === 'ai' ? (
                      <div className="flex space-x-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
                          AI
                        </div>
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md max-w-[80%]">
                          <p className="text-[11px] leading-relaxed font-medium">{msg.text}</p>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {isTyping && (
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
                      AI
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                      <p className="text-[11px] text-slate-500 italic font-medium">
                        ResuMaster AI is thinking...
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="h-2 w-32 bg-slate-100 rounded animate-pulse" />
                        <div className="h-2 w-24 bg-slate-100 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 bg-white">
                <form
                  onSubmit={handleMiniChatSubmit}
                  className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1 pr-2"
                >
                  <input
                    type="text"
                    placeholder="Ask your career advisor..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-transparent border-none text-xs px-3 py-2 focus:ring-0 focus:outline-none placeholder-slate-400 text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isTyping}
                    className="p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
