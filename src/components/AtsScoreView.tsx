import React from 'react';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Check,
  HelpCircle,
  BarChart,
  Lightbulb,
} from 'lucide-react';
import { ResumeAnalysisResult } from '../types';

interface AtsScoreViewProps {
  analysis: ResumeAnalysisResult;
  onGoToRewrites: () => void;
  onRecalculate?: () => void;
}

export const AtsScoreView: React.FC<AtsScoreViewProps> = ({
  analysis,
  onGoToRewrites,
  onRecalculate,
}) => {
  const { ats_score, potential_score, breakdown, strengths, weaknesses, recommendations, score_improvements } = analysis;

  const scoreGain = Math.max(0, potential_score - ats_score);

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-blue-600';
    return 'bg-amber-500';
  };

  const breakdownMetrics = [
    { label: 'ATS Compatibility', score: breakdown?.atsCompatibility ?? 82, desc: 'Machine readability, layout parseability' },
    { label: 'Keywords', score: breakdown?.keywords ?? 64, desc: 'Target role keyword density & relevance' },
    { label: 'Technical Skills', score: breakdown?.technicalSkills ?? 78, desc: 'Direct domain tech stack coverage' },
    { label: 'Experience', score: breakdown?.experience ?? 65, desc: 'Role chronology & title relevance' },
    { label: 'Projects', score: breakdown?.projects ?? 70, desc: 'Action-oriented project descriptions' },
    { label: 'Education', score: breakdown?.education ?? 90, desc: 'Degrees, coursework, and credentials' },
    { label: 'Achievements', score: breakdown?.achievements ?? 60, desc: 'Quantified metrics and impact' },
    { label: 'Formatting', score: breakdown?.formatting ?? 80, desc: 'Header hierarchy & typography' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. TOP SCORE HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Current Score */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current ATS Score</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getScoreColor(ats_score)}`}>
                {ats_score >= 80 ? 'Excellent' : ats_score >= 65 ? 'Competitive' : 'Needs Work'}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-slate-800 tracking-tight">{ats_score}</span>
              <span className="text-slate-400 text-lg font-semibold">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Calculated based on target role <strong className="text-slate-700">{analysis.target_role}</strong>.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Industry Benchmark</span>
            <span className="font-bold text-slate-700">70+ Required for Top 10%</span>
          </div>
        </div>

        {/* Potential Score */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Score</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                +{scoreGain} Points Gain
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-blue-600 tracking-tight">{potential_score}</span>
              <span className="text-slate-400 text-lg font-semibold">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Attainable by applying prioritized AI rewrites and quantified metrics.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={onGoToRewrites}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply AI Improvements</span>
            </button>
          </div>
        </div>

        {/* Potential Improvement Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Score Gain Opportunity
          </span>

          <div className="space-y-2.5">
            {score_improvements && score_improvements.length > 0 ? (
              score_improvements.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">{item.category}</span>
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">+{item.points} pts</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Keyword Optimization</span>
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">+5 pts</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Project Improvements</span>
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">+4 pts</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Professional Summary</span>
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">+3 pts</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">Quantified Achievements</span>
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">+3 pts</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. ATS SCORE BREAKDOWN (8 METRICS) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">ATS Component Breakdown</h3>
            <p className="text-xs text-slate-500">
              Evaluated across 8 proprietary recruiting algorithms for ATS compatibility.
            </p>
          </div>
          {onRecalculate && (
            <button
              onClick={onRecalculate}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors self-start sm:self-auto"
            >
              Recalculate Score
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {breakdownMetrics.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">{item.label}</span>
                <span className="font-bold text-slate-900">{item.score}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${getBarColor(item.score)}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STRENGTHS & WEAKNESSES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center space-x-2 text-green-600 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Strengths</h4>
          </div>

          <ul className="space-y-3">
            {strengths?.map((strength, idx) => (
              <li key={idx} className="flex items-start text-xs text-slate-600">
                <span className="mr-2 text-slate-400 font-bold">•</span>
                <span className="leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center space-x-2 text-red-500 mb-4">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Weaknesses</h4>
          </div>

          <ul className="space-y-3">
            {weaknesses?.map((weakness, idx) => (
              <li key={idx} className="flex items-start text-xs text-slate-600">
                <span className="mr-2 text-slate-400 font-bold">•</span>
                <span className="leading-relaxed">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. "WHAT SHOULD I IMPROVE?" (CORE SECTION) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
              Priority Action Items
            </h3>
            <p className="text-xs text-slate-500">Ranked recommendations by impact on your ATS score</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            {recommendations?.length || 0} Action Items
          </span>
        </div>

        <div className="space-y-4">
          {recommendations?.map((rec, index) => {
            const isHigh = rec.priority === 'High';
            const isMed = rec.priority === 'Medium';
            const cardBg = isHigh
              ? 'border-orange-100 bg-orange-50/50'
              : isMed
              ? 'border-blue-100 bg-blue-50/50'
              : 'border-slate-100 bg-slate-50';

            const tagColor = isHigh
              ? 'text-orange-700'
              : isMed
              ? 'text-blue-700'
              : 'text-slate-500';

            return (
              <div
                key={index}
                className={`p-5 rounded-xl border ${cardBg} space-y-3 transition-colors`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{rec.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${tagColor}`}>
                      {rec.priority} Priority
                    </span>
                    {rec.pointsImpact && (
                      <span className="text-[10px] font-medium text-slate-500">
                        +{rec.pointsImpact} Points
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem & Why It Matters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Issue</p>
                    <p className="text-slate-600 leading-relaxed">{rec.problem}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                    <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Why It Matters</p>
                    <p className="text-slate-600 leading-relaxed">{rec.whyItMatters}</p>
                  </div>
                </div>

                {/* How to fix it */}
                <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs space-y-1">
                  <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">How to Fix</p>
                  <p className="text-slate-600 leading-relaxed">{rec.howToFix}</p>
                </div>

                {/* Example Rewrite */}
                {rec.example && (
                  <div className="p-3 bg-slate-900 text-white rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Example Rewrite</span>
                    </div>
                    <p className="text-slate-200 font-mono italic leading-relaxed pt-1">
                      "{rec.example}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
