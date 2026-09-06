import React from 'react';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Clock,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ResumeAnalysisResult } from '../types';

interface SkillsViewProps {
  analysis: ResumeAnalysisResult;
  onAskAdvisor?: (query: string) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ analysis, onAskAdvisor }) => {
  const { skills, missing_skills, target_role } = analysis;

  const getLevelBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'advanced':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Skill Intelligence</span>
            <h3 className="text-xl font-black">Skill Gap & Role Alignment: {target_role}</h3>
            <p className="text-xs text-blue-100 max-w-xl">
              Compare your current resume skill profile directly against industry expectations for {target_role}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-white/10 backdrop-blur-xs rounded-xl text-center">
              <p className="text-[10px] uppercase font-bold text-blue-200">Identified Skills</p>
              <p className="text-xl font-black">{skills?.length || 0}</p>
            </div>
            <div className="px-3.5 py-2 bg-white/10 backdrop-blur-xs rounded-xl text-center">
              <p className="text-[10px] uppercase font-bold text-blue-200">Missing Gaps</p>
              <p className="text-xl font-black text-amber-300">{missing_skills?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. DETECTED SKILLS MATRIX */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Detected Skills on Resume
        </h3>

        {skills && skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between transition-colors hover:border-slate-300"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{s.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.category || 'Technical Skill'}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadge(s.level)}`}>
                  {s.level}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No skills detected. Upload a resume to analyze skills.</p>
        )}
      </div>

      {/* 2. MISSING SKILLS & GAP DETECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Missing Skills for {target_role}
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
            High ATS Impact
          </span>
        </div>

        {missing_skills && missing_skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missing_skills.map((ms, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-orange-100 bg-orange-50/50 space-y-2 hover:border-orange-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{ms.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(ms.priority)}`}>
                    {ms.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ms.reason}</p>

                {onAskAdvisor && (
                  <button
                    onClick={() => onAskAdvisor(`How can I quickly learn and demonstrate ${ms.name} on my resume for ${target_role}?`)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 pt-1"
                  >
                    <span>Ask AI Advisor about {ms.name}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No missing skills detected for this role profile.</p>
        )}
      </div>

      {/* 3. RECOMMENDED LEARNING PATHS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Recommended Learning Paths
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              skill: target_role.includes('Analyst') ? 'Power BI / Tableau DAX' : target_role.includes('ML') ? 'PyTorch & Transformers' : 'Microservices & System Design',
              time: '2-3 Weeks',
              topics: ['Calculated Columns & Measures', 'Data Modeling (Star Schema)', 'Publishing Dashboards to Web'],
              resources: ['Microsoft Learn PL-300', 'Coursera BI Specialization', 'Portfolio Sales Dashboard'],
            },
            {
              skill: target_role.includes('Analyst') ? 'A/B Testing & Statistics' : target_role.includes('ML') ? 'MLOps & Docker Deployment' : 'PostgreSQL Optimization',
              time: '3-4 Weeks',
              topics: ['Hypothesis Testing & p-values', 'Confidence Intervals', 'Sample Size Determination'],
              resources: ['Khan Academy Statistics', 'Stanford Online', 'Kaggle A/B Testing Kernels'],
            },
            {
              skill: target_role.includes('Analyst') ? 'Advanced SQL & Window Functions' : target_role.includes('ML') ? 'Vector Databases & RAG' : 'Next.js & Server Components',
              time: '1-2 Weeks',
              topics: ['ROW_NUMBER & RANK', 'LEAD / LAG & Rolling Averages', 'Query Execution Plans & Indexing'],
              resources: ['LeetCode Database 50', 'PostgreSQL Tutorial', 'StrataScratch Practice'],
            },
          ].map((path, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                    Roadmap {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{path.time}</span>
                  </div>
                </div>

                <h5 className="text-sm font-bold text-slate-900 mb-2">{path.skill}</h5>

                <div className="space-y-1 text-xs text-slate-600 mb-3">
                  <p className="font-semibold text-[11px] text-slate-700">Key Focus Topics:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-500 text-[11px]">
                    {path.topics.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <p className="font-semibold text-[11px] text-slate-700">Recommended Resources:</p>
                  <ul className="space-y-1 text-slate-500 text-[11px]">
                    {path.resources.map((r, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {onAskAdvisor && (
                <button
                  onClick={() => onAskAdvisor(`Give me a detailed study guide and project idea to master ${path.skill}.`)}
                  className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Get Learning Plan</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
