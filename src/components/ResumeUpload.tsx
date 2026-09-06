import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Briefcase,
  FileCheck,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';
import { TargetRole } from '../types';
import { SAMPLE_RESUMES } from '../lib/sampleResumes';

interface ResumeUploadProps {
  onAnalysisStart: () => void;
  onAnalysisSuccess: (analysis: any, extractedResume: any) => void;
  onAnalysisError: (error: string) => void;
  initialRole?: string;
  userName?: string;
}

const TARGET_ROLES: { role: TargetRole; desc: string }[] = [
  { role: 'Data Analyst', desc: 'SQL, Python, Excel, Power BI, Tableau, Statistics, Data Cleaning' },
  { role: 'ML Engineer', desc: 'Python, Machine Learning, TensorFlow, PyTorch, Scikit-learn, MLOps' },
  { role: 'AI Engineer', desc: 'LLMs, Prompt Engineering, RAG, PyTorch, LangChain, Vector DBs' },
  { role: 'Data Scientist', desc: 'Statistics, Machine Learning, Python, R, Hypothesis Testing, SQL' },
  { role: 'Full Stack Developer', desc: 'React, Node.js, TypeScript, PostgreSQL, REST APIs, Git' },
  { role: 'Backend Developer', desc: 'Node.js/Python/Go, Microservices, Databases, Docker, APIs' },
  { role: 'Frontend Developer', desc: 'React, TypeScript, CSS/Tailwind, Performance, State Management' },
  { role: 'Software Developer', desc: 'Algorithms, Data Structures, OOP, System Design, Testing' },
  { role: 'Business Analyst', desc: 'Requirements, Data Modeling, Process Optimization, SQL, Agile' },
  { role: 'Cloud Engineer', desc: 'AWS/GCP/Azure, Terraform, Kubernetes, CI/CD, Networking' },
  { role: 'Other', desc: 'Custom tailored analysis based on resume contents' },
];

const ANALYSIS_STEPS = [
  'Extracting resume text',
  'Reading resume sections',
  'Analyzing skills',
  'Checking ATS compatibility',
  'Checking keywords',
  'Evaluating projects',
  'Evaluating experience',
  'Comparing target role',
  'Generating recommendations',
];

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onAnalysisStart,
  onAnalysisSuccess,
  onAnalysisError,
  initialRole = 'Data Analyst',
  userName = 'Candidate',
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);

  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Upload and extract text via server API
  const processFile = async (uploadedFile: File) => {
    setError('');
    // Validate file extension
    const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext || '')) {
      setError('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    // Validate size (10 MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10 MB maximum limit.');
      return;
    }

    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    setFileType(ext?.toUpperCase() || 'FILE');
    setFileSize(uploadedFile.size);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', uploadedFile);

      const response = await fetch('/api/resume/upload-and-extract', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from document.');
      }

      setExtractedText(data.extractedText);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setError(err.message || 'Unable to read resume text. Please check the file formatting.');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Load sample resume for instant demonstration
  const handleLoadSample = (sampleId: string) => {
    setError('');
    const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId) || SAMPLE_RESUMES[0];
    setFileName(sample.fileName);
    setFileType(sample.fileName.split('.').pop()?.toUpperCase() || 'PDF');
    setFileSize(sample.fileSize);
    setExtractedText(sample.text);
    setSelectedRole(sample.role);
    setFile(new File([sample.text], sample.fileName, { type: 'text/plain' }));
  };

  // Trigger Gemini Analysis
  const handleStartAnalysis = async () => {
    if (!extractedText) {
      setError('Please upload a resume before starting analysis.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    onAnalysisStart();

    // Step animation interval
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: extractedText,
          targetRole: selectedRole,
          userName: userName,
        }),
      });

      const analysisData = await response.json();

      if (!response.ok) {
        throw new Error(analysisData.error || 'Failed to analyze resume.');
      }

      clearInterval(interval);
      setCurrentStepIndex(ANALYSIS_STEPS.length);

      const resumeMeta = {
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        extracted_text: extractedText,
        target_role: selectedRole,
      };

      // Slight pause to show "Analysis Complete 🎯"
      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisSuccess(analysisData, resumeMeta);
      }, 700);
    } catch (err: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      console.error('Analysis execution error:', err);
      const errMsg = err.message || 'Unable to analyze your resume right now. Please try again.';
      setError(errMsg);
      onAnalysisError(errMsg);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
      {/* 1. Target Role Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Target Job Role</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium">Influences ATS scoring & keyword checks</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {TARGET_ROLES.slice(0, 8).map((item) => {
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => setSelectedRole(item.role)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                }`}
              >
                <p className="text-xs font-bold">{item.role}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.desc.split(',')[0]} & more</p>
              </button>
            );
          })}
        </div>

        {/* Dropdown for remaining roles */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-xs text-slate-500">More roles:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TARGET_ROLES.map((item) => (
              <option key={item.role} value={item.role}>
                {item.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
            : 'border-slate-200 hover:border-blue-400 bg-slate-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        {!file && !extractedText ? (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">Upload your resume</p>
              <p className="text-xs text-slate-500 mt-1">
                Drag and drop your file here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  browse files
                </button>
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              Supports PDF, DOCX, TXT • Maximum size 10 MB
            </p>

            {/* Quick Sample Selector */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Or test with a sample:</span>
              {SAMPLE_RESUMES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleLoadSample(sample.id)}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-xs font-medium rounded-lg transition-colors shadow-2xs"
                >
                  {sample.name.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* File Loaded / Extraction View */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {fileType}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 truncate max-w-xs">{fileName}</p>
                  <p className="text-xs text-slate-500">
                    {(fileSize / 1024).toFixed(1)} KB • {fileType} Document
                  </p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Text Extracted ({extractedText.split(/\s+/).filter(Boolean).length} words)</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setExtractedText('');
                    setFileName('');
                  }}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 hover:underline"
                >
                  Upload Different File
                </button>
              </div>
            </div>

            {/* Snippet Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Extracted Resume Content (Preview):
              </p>
              <p className="text-xs text-slate-700 line-clamp-3 font-mono leading-relaxed">
                {extractedText.slice(0, 300)}...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-700">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
          {extractedText && !isAnalyzing && (
            <button
              type="button"
              onClick={handleStartAnalysis}
              className="flex-shrink-0 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors text-xs"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* 3. Analysis Progress or Trigger Button */}
      <div className="mt-6">
        {isAnalyzing ? (
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">AI ATS Analysis In Progress</h4>
                  <p className="text-xs text-slate-400">Evaluating against {selectedRole} requirements...</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-400 font-mono">
                Step {Math.min(currentStepIndex + 1, ANALYSIS_STEPS.length)} of {ANALYSIS_STEPS.length}
              </span>
            </div>

            {/* Steps Animation */}
            <div className="space-y-2 pt-2 text-xs">
              {ANALYSIS_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2.5 transition-all ${
                      isPassed
                        ? 'text-emerald-400 font-medium'
                        : isCurrent
                        ? 'text-white font-bold translate-x-1'
                        : 'text-slate-500 opacity-50'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}

              {currentStepIndex >= ANALYSIS_STEPS.length && (
                <div className="pt-2 text-center text-sm font-extrabold text-emerald-400 animate-bounce">
                  Analysis Complete 🎯
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              <span>Ready to evaluate ATS score, keyword coverage, and skill alignment for </span>
              <strong className="text-slate-800">{selectedRole}</strong>.
            </div>

            <button
              type="button"
              disabled={!extractedText || isUploading}
              onClick={handleStartAnalysis}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
