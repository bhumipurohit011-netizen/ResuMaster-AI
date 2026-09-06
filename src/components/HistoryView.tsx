import React, { useEffect, useState } from 'react';
import { History, FileText, ArrowRight, Award, Calendar, Briefcase } from 'lucide-react';
import { ResumeAnalysisResult, JobMatchResult } from '../types';
import { getUserAnalyses, getUserJobMatches } from '../lib/storage';

interface HistoryViewProps {
  userId: string;
  onSelectAnalysis: (analysis: ResumeAnalysisResult) => void;
  onSelectJobMatch?: (match: JobMatchResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  userId,
  onSelectAnalysis,
  onSelectJobMatch,
}) => {
  const [analyses, setAnalyses] = useState<ResumeAnalysisResult[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [aList, jList] = await Promise.all([
          getUserAnalyses(userId),
          getUserJobMatches(userId),
        ]);
        setAnalyses(aList);
        setJobMatches(jList);
      } catch (e) {
        console.error('History load error:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Reports & Logs</span>
          <h3 className="text-xl font-black">Analysis & Job Match History</h3>
          <p className="text-xs text-blue-100 max-w-xl">
            Review your previously generated ATS score reports and job matching assessments.
          </p>
        </div>
      </div>

      {/* 1. PAST ATS ANALYSES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Resume ATS Reports
        </h3>

        {analyses.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {analyses.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Target Role: {item.target_role}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{item.strengths?.length || 0} Strengths Identified</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xl font-bold text-blue-600">{item.ats_score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                    <p className="text-[10px] text-green-600 font-bold">Max: {item.potential_score}</p>
                  </div>

                  <button
                    onClick={() => onSelectAnalysis(item)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No resume analysis reports found. Upload a resume to create your first report!
          </div>
        )}
      </div>

      {/* 2. PAST JOB MATCHES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          Job Description Matches
        </h3>

        {jobMatches.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {jobMatches.map((jm) => (
              <div
                key={jm.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 px-3 rounded-xl transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{jm.job_title}</p>
                  <p className="text-xs text-slate-500">
                    {jm.company} • {new Date(jm.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-600">{jm.match_score}%</span>
                    <p className="text-[10px] text-slate-400">Match Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No job matches saved yet. Test a job description in the Job Matcher tab!
          </div>
        )}
      </div>
    </div>
  );
};
