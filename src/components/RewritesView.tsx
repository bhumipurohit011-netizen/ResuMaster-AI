import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  Copy,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { ResumeAnalysisResult, RewriteSuggestion } from '../types';

interface RewritesViewProps {
  analysis: ResumeAnalysisResult;
  resumeText: string;
}

export const RewritesView: React.FC<RewritesViewProps> = ({ analysis, resumeText }) => {
  const [suggestions, setSuggestions] = useState<RewriteSuggestion[]>(
    analysis.rewrite_suggestions || []
  );

  const [customSection, setCustomSection] = useState('Work Experience');
  const [customOriginal, setCustomOriginal] = useState('');
  const [customInstruction, setCustomInstruction] = useState('Use Google XYZ format and quantify metrics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: 'accepted' | 'rejected' | 'pending') => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCustomRewrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOriginal.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/rewrite-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: customSection,
          originalText: customOriginal,
          targetRole: analysis.target_role,
          specificInstruction: customInstruction,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to rewrite section.');
      }

      const newSuggestion: RewriteSuggestion = {
        id: `rewrite_${Date.now()}`,
        section_name: customSection,
        original_text: customOriginal,
        improved_text: data.improvedText,
        reason: data.reason || 'Quantified action verb phrasing aligned with target role expectations.',
        status: 'pending',
      };

      setSuggestions((prev) => [newSuggestion, ...prev]);
      setCustomOriginal('');
    } catch (err: any) {
      console.error('Custom rewrite error:', err);
      alert(err.message || 'Unable to generate rewrite.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">AI Content Optimizer</span>
            <h3 className="text-xl font-black">Before & After Resume Rewriter</h3>
            <p className="text-xs text-blue-100 max-w-xl">
              Transform passive descriptions into high-impact bullet points powered by the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-xs">
            <span>Accepted: {suggestions.filter((s) => s.status === 'accepted').length}</span>
            <span>•</span>
            <span>Total: {suggestions.length}</span>
          </div>
        </div>
      </div>

      {/* 1. CUSTOM AI REWRITER PROMPT BOX */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Custom Section Rewriter
        </h3>

        <form onSubmit={handleCustomRewrite} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Type
              </label>
              <select
                value={customSection}
                onChange={(e) => setCustomSection(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Professional Summary">Professional Summary</option>
                <option value="Work Experience">Work Experience Bullet</option>
                <option value="Projects">Project Description</option>
                <option value="Technical Skills">Technical Skills Section</option>
                <option value="Achievements">Achievements & Awards</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optimization Style
              </label>
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="e.g. Emphasize SQL window functions and measurable percent gains"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Current Text (Before)
            </label>
            <textarea
              rows={3}
              required
              value={customOriginal}
              onChange={(e) => setCustomOriginal(e.target.value)}
              placeholder="e.g. Worked on dashboards and helped the sales team with reporting..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !customOriginal.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating AI Rewrite...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate High-Impact Rewrite</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. BEFORE & AFTER REWRITE CARDS */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Recommended Resume Rewrites
        </h3>

        {suggestions.length > 0 ? (
          suggestions.map((item) => {
            const isAccepted = item.status === 'accepted';
            const isRejected = item.status === 'rejected';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 shadow-sm ${
                  isAccepted
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                    : isRejected
                    ? 'border-slate-200 opacity-60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {item.section_name || item.section || 'Work Experience'}
                    </span>
                    {isAccepted && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Accepted
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Rejected
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(item.improved_text || item.suggestedText || '', item.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Copy improved text"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleStatusChange(item.id, 'accepted')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isAccepted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(item.id, 'rejected')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isRejected
                          ? 'bg-slate-300 text-slate-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Before & After comparison grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Before (Original Resume)</span>
                    </div>
                    <p className="text-xs text-slate-700 font-mono leading-relaxed line-through opacity-85">
                      {item.original_text || item.originalText}
                    </p>
                  </div>

                  {/* After */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>After (AI Optimized)</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 lowercase bg-emerald-100/70 px-2 py-0.5 rounded">
                        Action-driven
                      </span>
                    </div>
                    <p className="text-xs text-slate-900 font-mono font-medium leading-relaxed">
                      {item.improved_text || item.suggestedText}
                    </p>
                  </div>
                </div>

                {/* Why it is better */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong className="text-slate-800">Why this improves your score: </strong>
                  <span>{item.reason}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No rewrite suggestions available. Please run an ATS analysis to generate suggestions.
          </div>
        )}
      </div>
    </div>
  );
};
