import React, { useState } from 'react';
import { User, Mail, Briefcase, Shield, CheckCircle2, Database, Key, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TargetRole } from '../types';

const ROLES: TargetRole[] = [
  'Data Analyst',
  'ML Engineer',
  'AI Engineer',
  'Data Scientist',
  'Software Developer',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'Business Analyst',
  'Cloud Engineer',
];

interface ProfileViewProps {
  onOpenDbModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenDbModal }) => {
  const { user, updateProfile, isSupabaseActive } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Data Analyst');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    const res = await updateProfile({
      full_name: fullName,
      target_role: targetRole,
    });

    if (res.success) {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Account & Preferences</span>
          <h3 className="text-xl font-black">User Profile & Career Role</h3>
          <p className="text-xs text-blue-100">
            Configure your target domain role so ResuMaster AI tailors your ATS recommendations accurately.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">{user?.full_name || 'Candidate'}</h4>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Active Role: {user?.target_role || 'Data Analyst'}
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Job Role (Career Focus)
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-semibold text-slate-800"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Updating your target role customizes future ATS analysis keywords, missing skills, and AI advisor context.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Database Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Database & Security Architecture
          </h3>

          {onOpenDbModal && (
            <button
              onClick={onOpenDbModal}
              className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              Inspect SQL Schema
            </button>
          )}
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Strict User Data Privacy</span>
          </div>
          <p className="leading-relaxed">
            Your uploaded documents, extracted text, ATS scores, and AI Career Advisor chat messages are tied exclusively to your account ID. Supabase Row Level Security ensures that other users cannot read or modify your career data.
          </p>
        </div>
      </div>
    </div>
  );
};
