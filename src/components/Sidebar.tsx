import React from 'react';
import {
  LayoutDashboard,
  Award,
  Zap,
  Sparkles,
  Bot,
  Briefcase,
  History,
  User,
  LogOut,
  Database,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'score'
  | 'skills'
  | 'rewrites'
  | 'advisor'
  | 'job-matcher'
  | 'history'
  | 'profile';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenDbModal?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenDbModal,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, logout, isSupabaseActive } = useAuth();

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'score', label: 'ATS Score', icon: Award },
    { id: 'skills', label: 'Skill Analysis', icon: Zap },
    { id: 'rewrites', label: 'AI Rewriter', icon: Sparkles },
    { id: 'advisor', label: 'Career Advisor', icon: Bot, badge: 'AI' },
    { id: 'job-matcher', label: 'Job Matcher', icon: Briefcase },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-30 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            ResuMaster <span className="text-blue-600">AI</span>
          </h1>
        </div>

        {/* Target Role Pill */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
            <span>Target Role</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Active</span>
          </div>
          <div className="font-semibold text-xs text-slate-800 truncate flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="truncate">{user?.target_role || 'Data Analyst'}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-xs transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          {/* Database Setup button in sidebar */}
          {onOpenDbModal && (
            <button
              onClick={onOpenDbModal}
              className="w-full mt-4 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors border border-dashed border-slate-200"
            >
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Supabase / RLS</span>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  isSupabaseActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isSupabaseActive ? 'Cloud' : 'Local'}
              </span>
            </button>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
              {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.full_name || 'Candidate'}</p>
              <p className="text-[10px] text-slate-500 truncate">Pro Account</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
