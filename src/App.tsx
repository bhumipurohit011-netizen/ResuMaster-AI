import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardHome } from './components/DashboardHome';
import { AtsScoreView } from './components/AtsScoreView';
import { SkillsView } from './components/SkillsView';
import { RewritesView } from './components/RewritesView';
import { JobMatcherView } from './components/JobMatcherView';
import { CareerAdvisorChat } from './components/CareerAdvisorChat';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { SupabaseModal } from './components/SupabaseModal';
import { ResumeAnalysisResult, ResumeDocument } from './types';
import { saveResume, saveResumeAnalysis, getUserAnalyses } from './lib/storage';
import { SAMPLE_RESUMES } from './lib/sampleResumes';
import { Menu, X } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [dbModalOpen, setDbModalOpen] = useState(false);

  // Active Resume & Analysis Data
  const [currentResume, setCurrentResume] = useState<ResumeDocument | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [advisorInitialQuery, setAdvisorInitialQuery] = useState<string>('');

  // Switch to dashboard when user logs in if on landing
  useEffect(() => {
    if (user && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [user]);

  // Load user's latest analysis on login
  useEffect(() => {
    async function loadLatest() {
      if (user) {
        const analyses = await getUserAnalyses(user.id);
        if (analyses && analyses.length > 0) {
          setCurrentAnalysis(analyses[0]);
        }
      }
    }
    loadLatest();
  }, [user]);

  // Handle analysis completion
  const handleAnalysisSuccess = async (analysisResult: any, resumeMeta: any) => {
    const userId = user?.id || 'guest_user';
    const resumeId = `resume_${Date.now()}`;

    const resumeDoc: ResumeDocument = {
      id: resumeId,
      user_id: userId,
      file_name: resumeMeta.file_name,
      file_type: resumeMeta.file_type,
      file_size: resumeMeta.file_size,
      extracted_text: resumeMeta.extracted_text,
      target_role: resumeMeta.target_role,
      created_at: new Date().toISOString(),
    };

    const fullAnalysis: ResumeAnalysisResult = {
      id: `analysis_${Date.now()}`,
      resume_id: resumeId,
      user_id: userId,
      target_role: resumeMeta.target_role,
      ats_score: analysisResult.atsScore || 72,
      potential_score: analysisResult.potentialScore || 87,
      breakdown: analysisResult.breakdown || {
        atsCompatibility: 82,
        keywords: 64,
        technicalSkills: 78,
        experience: 65,
        projects: 70,
        education: 90,
        achievements: 60,
        formatting: 80,
      },
      strengths: analysisResult.strengths || [],
      weaknesses: analysisResult.weaknesses || [],
      skills: analysisResult.skills || [],
      missing_skills: analysisResult.missingSkills || [],
      missing_keywords: analysisResult.missingKeywords || [],
      recommendations: analysisResult.recommendations || [],
      score_improvements: analysisResult.scoreImprovements || [],
      section_analysis: analysisResult.sectionAnalysis || {},
      rewrite_suggestions: (analysisResult.rewriteSuggestions || []).map((s: any, idx: number) => ({
        id: `sugg_${Date.now()}_${idx}`,
        section_name: s.sectionName || 'Work Experience',
        original_text: s.originalText || '',
        improved_text: s.improvedText || '',
        reason: s.reason || '',
        status: 'pending',
      })),
      created_at: new Date().toISOString(),
    };

    await saveResume(resumeDoc);
    await saveResumeAnalysis(fullAnalysis);

    setCurrentResume(resumeDoc);
    setCurrentAnalysis(fullAnalysis);
    setCurrentTab('score'); // automatically navigate to ATS Score breakdown view
  };

  // Quick sample test from Landing or Dashboard
  const handleTrySample = async (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId) || SAMPLE_RESUMES[0];
    if (!user) {
      setAuthMode('signup');
      setAuthModalOpen(true);
      return;
    }
    setCurrentView('dashboard');
    setCurrentTab('dashboard');
  };

  // Cross-component advisor query
  const handleAskAdvisor = (query: string) => {
    setAdvisorInitialQuery(query);
    setCurrentTab('advisor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenDbModal={() => setDbModalOpen(true)}
      />

      {/* Main View Router */}
      {currentView === 'landing' && !user ? (
        <main className="flex-1">
          <LandingPage
            onGetStarted={() => {
              setAuthMode('signup');
              setAuthModalOpen(true);
            }}
            onTrySample={handleTrySample}
          />
        </main>
      ) : (
        /* Authenticated Dashboard Shell */
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            onOpenDbModal={() => setDbModalOpen(true)}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Dashboard Content Area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
            {/* Professional Polish Header Bar */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-20">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Mobile Sidebar Toggle */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  Hi {user?.full_name ? user.full_name.split(' ')[0] : 'there'}! 👋
                </h2>
                <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                  Targeting:{' '}
                  <span className="font-semibold text-slate-800">
                    {currentAnalysis?.target_role || user?.target_role || 'Data Analyst'}
                  </span>
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Upload New Resume
                </button>
              </div>
            </header>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {/* Sub-Views */}
              {currentTab === 'dashboard' && (
                <DashboardHome
                  user={user || {
                    id: 'guest',
                    full_name: 'Alex Rivera',
                    email: 'alex@example.com',
                    target_role: 'Data Analyst',
                    created_at: new Date().toISOString(),
                  }}
                  analysis={currentAnalysis}
                  onAnalysisSuccess={handleAnalysisSuccess}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onAskAdvisor={handleAskAdvisor}
                />
              )}

              {currentTab === 'score' && (
                currentAnalysis ? (
                  <AtsScoreView
                    analysis={currentAnalysis}
                    onGoToRewrites={() => setCurrentTab('rewrites')}
                    onRecalculate={() => setCurrentTab('dashboard')}
                  />
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                    <p className="text-base font-bold text-slate-800">No Resume Analyzed Yet</p>
                    <p className="text-xs text-slate-500">
                      Upload your resume in the Dashboard tab to calculate your official ATS score.
                    </p>
                    <button
                      onClick={() => setCurrentTab('dashboard')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Go to Resume Upload
                    </button>
                  </div>
                )
              )}

              {currentTab === 'skills' && (
                currentAnalysis ? (
                  <SkillsView analysis={currentAnalysis} onAskAdvisor={handleAskAdvisor} />
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                    <p className="text-base font-bold text-slate-800">No Skill Matrix Available</p>
                    <p className="text-xs text-slate-500">
                      Upload your resume to identify detected strengths and role-specific missing skill gaps.
                    </p>
                    <button
                      onClick={() => setCurrentTab('dashboard')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Upload Resume
                    </button>
                  </div>
                )
              )}

              {currentTab === 'rewrites' && (
                currentAnalysis ? (
                  <RewritesView
                    analysis={currentAnalysis}
                    resumeText={currentResume?.extracted_text || ''}
                  />
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                    <p className="text-base font-bold text-slate-800">No Resume Content to Rewrite</p>
                    <p className="text-xs text-slate-500">
                      Run an ATS analysis to receive action-oriented before-and-after suggestions.
                    </p>
                    <button
                      onClick={() => setCurrentTab('dashboard')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Upload Resume
                    </button>
                  </div>
                )
              )}

              {currentTab === 'job-matcher' && (
                <JobMatcherView
                  userId={user?.id || 'guest'}
                  resumeId={currentResume?.id || 'resume_default'}
                  resumeText={currentResume?.extracted_text || SAMPLE_RESUMES[0].text}
                  targetRole={currentAnalysis?.target_role || user?.target_role || 'Data Analyst'}
                />
              )}

              {currentTab === 'advisor' && (
                <CareerAdvisorChat
                  userId={user?.id || 'guest'}
                  userName={user?.full_name || 'Candidate'}
                  resumeId={currentResume?.id || 'resume_default'}
                  analysis={currentAnalysis}
                  targetRole={currentAnalysis?.target_role || user?.target_role || 'Data Analyst'}
                  initialQuery={advisorInitialQuery}
                />
              )}

              {currentTab === 'history' && (
                <HistoryView
                  userId={user?.id || 'guest'}
                  onSelectAnalysis={(selected) => {
                    setCurrentAnalysis(selected);
                    setCurrentTab('score');
                  }}
                />
              )}

              {currentTab === 'profile' && (
                <ProfileView onOpenDbModal={() => setDbModalOpen(true)} />
              )}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Auth Modal (Login / Signup / Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentView('dashboard');
          setCurrentTab('dashboard');
        }}
      />

      {/* Database Setup & Supabase RLS Schema Modal */}
      <SupabaseModal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
