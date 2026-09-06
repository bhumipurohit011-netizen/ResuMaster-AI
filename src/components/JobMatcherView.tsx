import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  RefreshCw,
} from 'lucide-react';
import { JobMatchResult } from '../types';
import { saveJobMatch } from '../lib/storage';

interface JobMatcherViewProps {
  userId: string;
  resumeId: string;
  resumeText: string;
  targetRole: string;
  onMatchComplete?: (result: JobMatchResult) => void;
}

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Senior Data Analyst',
    company: 'Fintech Cloud Corp',
    description: `We are looking for a Data Analyst to join our Growth Analytics team. 
Responsibilities:
- Build, optimize, and maintain executive Tableau & Power BI business intelligence dashboards.
- Write complex SQL queries with CTEs, window functions, and indexing on PostgreSQL and Snowflake data warehouses.
- Conduct regular A/B test experiments, sample size calculations, hypothesis testing, and statistical analysis.
- Collaborate with product managers and engineers to identify funnel churn bottlenecks.
Requirements:
- 3+ years experience with SQL, Python (Pandas, NumPy), and BI reporting tools.
- Strong understanding of statistical modeling, cohort retention, and ETL pipelines.
- Bachelor's degree in Computer Science, Business Analytics, or related quantitative field.`,
  },
  {
    title: 'Machine Learning Engineer',
    company: 'DeepScale AI',
    description: `DeepScale is hiring an ML Engineer to deploy deep learning models to production.
Responsibilities:
- Train and fine-tune transformer models for NLP classification and information retrieval.
- Build low-latency model inference microservices using FastAPI, Docker, and Kubernetes.
- Implement Retrieval-Augmented Generation (RAG) pipelines with Pinecone and HuggingFace.
- Monitor model performance and data drift with MLflow and CI/CD pipelines on AWS.
Requirements:
- 2+ years experience in PyTorch, Python, Scikit-learn, and ONNX runtime.
- Hands-on experience with vector embeddings, semantic search, and prompt engineering.
- Solid background in containerization (Docker) and AWS cloud infrastructure.`,
  },
  {
    title: 'Full Stack Software Engineer',
    company: 'Apex SaaS Labs',
    description: `Seeking a Full Stack Engineer to lead frontend architecture and backend API scaling.
Responsibilities:
- Build responsive, accessible client interfaces using React 18, TypeScript, and Tailwind CSS.
- Develop scalable REST and GraphQL microservices using Node.js, Express, and PostgreSQL.
- Architect clean database schemas, migration scripts, and Redis caching layers.
- Write automated unit and integration tests in Jest and Cypress.
Requirements:
- 3+ years of professional full-stack development experience.
- Strong proficiency in modern React, state management, and TypeScript.
- Deep familiarity with relational databases (PostgreSQL) and CI/CD deployment pipelines.`,
  },
];

export const JobMatcherView: React.FC<JobMatcherViewProps> = ({
  userId,
  resumeId,
  resumeText,
  targetRole,
  onMatchComplete,
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState('');

  const handleSelectSample = (sample: typeof SAMPLE_JOB_DESCRIPTIONS[0]) => {
    setJobTitle(sample.title);
    setCompany(sample.company);
    setJobDescription(sample.description);
  };

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }
    if (!resumeText.trim()) {
      setError('No resume text available. Please upload your resume first.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/match-job-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          targetRole: jobTitle || targetRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze job match.');
      }

      const result: JobMatchResult = {
        id: `match_${Date.now()}`,
        user_id: userId,
        resume_id: resumeId,
        job_title: jobTitle || targetRole,
        company: company || 'Prospective Employer',
        job_description: jobDescription,
        match_score: data.matchScore,
        matched_keywords: data.matchedKeywords || [],
        missing_keywords: data.missingKeywords || [],
        skill_gaps: data.skillGaps || [],
        how_to_improve: data.howToImprove || [],
        created_at: new Date().toISOString(),
      };

      await saveJobMatch(result);
      setMatchResult(result);
      if (onMatchComplete) onMatchComplete(result);
    } catch (err: any) {
      console.error('Job match error:', err);
      setError(err.message || 'Error processing job description comparison.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Target Job Matcher</span>
          <h3 className="text-xl font-black">Job Description Match & Keyword Optimizer</h3>
          <p className="text-xs text-blue-100 max-w-xl">
            Compare your resume directly against any real job description to discover matched keywords, critical gaps, and tailored alignment guidance.
          </p>
        </div>
      </div>

      {/* 1. INPUT FORM */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Enter Job Details</h3>
            <p className="text-xs text-slate-500">Paste the text of a posting you want to target</p>
          </div>

          {/* Quick samples */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Quick sample:</span>
            {SAMPLE_JOB_DESCRIPTIONS.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => handleSelectSample(s)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg font-semibold text-[11px] transition-colors"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleMatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title (Optional)
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Senior Data Analyst"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Spotify, Meta, Stripe"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description
            </label>
            <textarea
              rows={5}
              required
              placeholder="Paste the complete job description here, including responsibilities and requirements..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !jobDescription.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Comparing Resume with Job Posting...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Calculate Job Match Score</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. MATCH RESULTS VIEW */}
      {matchResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Match Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Target Role Match Analysis
              </span>
              <h4 className="text-lg font-bold text-slate-900">
                {matchResult.job_title} at {matchResult.company}
              </h4>
              <p className="text-xs text-slate-500">
                Direct cross-examination of requirements against your resume text.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center sm:text-right">
                <span className="text-4xl font-extrabold text-blue-600 tracking-tight">{matchResult.match_score}%</span>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Match Score</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 text-xs">
                {matchResult.match_score >= 75 ? 'Strong' : matchResult.match_score >= 50 ? 'Moderate' : 'Low'}
              </div>
            </div>
          </div>

          {/* Keywords Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center space-x-2 text-green-600 mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <h5 className="text-xs font-bold uppercase tracking-wider">Matched Keywords</h5>
              </div>

              <div className="flex flex-wrap gap-2">
                {matchResult.matched_keywords?.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-800 border border-green-200 text-xs font-semibold"
                  >
                    <span>✓</span>
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center space-x-2 text-red-500 mb-4">
                <AlertCircle className="w-4 h-4" />
                <h5 className="text-xs font-bold uppercase tracking-wider">Missing Job Keywords</h5>
              </div>

              <div className="flex flex-wrap gap-2">
                {matchResult.missing_keywords?.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-800 border border-red-200 text-xs font-semibold"
                  >
                    <span>✕</span>
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Ethical Improvement Advice */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-4">
            <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              How to Improve Your Match Rate
            </h5>

            <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 leading-relaxed font-medium">
              💡 <strong>Integrity Rule:</strong> Only incorporate missing keywords and technologies if you genuinely possess practical experience with them. Do not fabricate experience to beat the ATS — interviewers will probe these during technical rounds!
            </div>

            <ul className="space-y-2.5 pt-1">
              {matchResult.how_to_improve?.map((advice, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
