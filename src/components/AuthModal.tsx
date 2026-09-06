import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, CheckCircle2, AlertCircle, X, ArrowRight, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TargetRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup' | 'forgot';
  onClose: () => void;
  onSuccess?: () => void;
}

const POPULAR_ROLES: TargetRole[] = [
  'Data Analyst',
  'Data Scientist',
  'ML Engineer',
  'AI Engineer',
  'Software Developer',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'Business Analyst',
  'Cloud Engineer',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { login, signup, resetPassword, isSupabaseActive } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetRole, setTargetRole] = useState<string>('Data Analyst');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setLoading(false);
          return;
        }

        const res = await signup(fullName, email, password, targetRole);
        if (res.success) {
          if (onSuccess) onSuccess();
          onClose();
        } else {
          setErrorMessage(res.error || 'Signup failed.');
        }
      } else if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          if (onSuccess) onSuccess();
          onClose();
        } else {
          setErrorMessage(res.error || 'Invalid email or password.');
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMessage(res.message || 'Password reset link sent to your email.');
        } else {
          setErrorMessage(res.error || 'Failed to send reset link.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-lg">ResuMaster AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mode === 'login' && 'Sign in to access your ATS scores, resume rewrites, and AI advisor.'}
              {mode === 'signup' && 'Join ResuMaster AI to build a stronger resume and get hired faster.'}
              {mode === 'forgot' && 'Enter your email and we will send you password recovery instructions.'}
            </p>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-sm text-rose-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-sm text-emerald-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rakshit Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Job Role
                </label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
                  >
                    {POPULAR_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Free Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setMode('signup');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  Sign Up Free
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setMode('login');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setMode('login');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
