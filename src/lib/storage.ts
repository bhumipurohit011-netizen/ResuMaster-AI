import {
  UserProfile,
  ResumeDocument,
  ResumeAnalysisResult,
  ChatMessage,
  JobMatchResult,
  RewriteSuggestion,
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  USERS: 'resumaster_users_v1',
  CURRENT_USER: 'resumaster_current_user_v1',
  RESUMES: 'resumaster_resumes_v1',
  ANALYSES: 'resumaster_analyses_v1',
  CHATS: 'resumaster_chats_v1',
  JOB_MATCHES: 'resumaster_job_matches_v1',
  SUGGESTIONS: 'resumaster_suggestions_v1',
};

// Safe JSON storage helpers
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// ----------------------------------------------------
// Resumes
// ----------------------------------------------------
export async function saveResume(resume: ResumeDocument): Promise<ResumeDocument> {
  // Local storage save
  const resumes = loadFromStorage<ResumeDocument[]>(STORAGE_KEYS.RESUMES, []);
  const index = resumes.findIndex((r) => r.id === resume.id);
  if (index >= 0) {
    resumes[index] = resume;
  } else {
    resumes.unshift(resume);
  }
  saveToStorage(STORAGE_KEYS.RESUMES, resumes);

  // Sync to Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('resumes').upsert({
        id: resume.id,
        user_id: resume.user_id,
        file_name: resume.file_name,
        file_type: resume.file_type,
        file_size: resume.file_size,
        file_url: resume.file_url,
        extracted_text: resume.extracted_text,
        target_role: resume.target_role,
      });
    } catch (err) {
      console.warn('Supabase sync warning for resume:', err);
    }
  }

  return resume;
}

export async function getUserResumes(userId: string): Promise<ResumeDocument[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ResumeDocument[];
      }
    } catch (err) {
      console.warn('Supabase fetch error for resumes:', err);
    }
  }

  const all = loadFromStorage<ResumeDocument[]>(STORAGE_KEYS.RESUMES, []);
  return all.filter((r) => r.user_id === userId);
}

// ----------------------------------------------------
// Resume Analysis
// ----------------------------------------------------
export async function saveResumeAnalysis(analysis: ResumeAnalysisResult): Promise<ResumeAnalysisResult> {
  const analyses = loadFromStorage<ResumeAnalysisResult[]>(STORAGE_KEYS.ANALYSES, []);
  const index = analyses.findIndex((a) => a.id === analysis.id);
  if (index >= 0) {
    analyses[index] = analysis;
  } else {
    analyses.unshift(analysis);
  }
  saveToStorage(STORAGE_KEYS.ANALYSES, analyses);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('resume_analysis').upsert({
        id: analysis.id,
        resume_id: analysis.resume_id,
        user_id: analysis.user_id,
        target_role: analysis.target_role,
        ats_score: analysis.ats_score,
        potential_score: analysis.potential_score,
        breakdown: analysis.breakdown,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        skills: analysis.skills,
        missing_skills: analysis.missing_skills,
        missing_keywords: analysis.missing_keywords,
        recommendations: analysis.recommendations,
        score_improvements: analysis.score_improvements,
        section_analysis: analysis.section_analysis,
        rewrite_suggestions: analysis.rewrite_suggestions,
      });
    } catch (err) {
      console.warn('Supabase sync warning for analysis:', err);
    }
  }

  return analysis;
}

export async function getUserAnalyses(userId: string): Promise<ResumeAnalysisResult[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('resume_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ResumeAnalysisResult[];
      }
    } catch (err) {
      console.warn('Supabase fetch error for analyses:', err);
    }
  }

  const all = loadFromStorage<ResumeAnalysisResult[]>(STORAGE_KEYS.ANALYSES, []);
  return all.filter((a) => a.user_id === userId);
}

// ----------------------------------------------------
// Chat Messages
// ----------------------------------------------------
export async function saveChatMessage(message: ChatMessage): Promise<void> {
  const messages = loadFromStorage<ChatMessage[]>(STORAGE_KEYS.CHATS, []);
  messages.push(message);
  saveToStorage(STORAGE_KEYS.CHATS, messages);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('chat_messages').insert({
        id: message.id,
        user_id: message.user_id,
        resume_id: message.resume_id,
        role: message.role,
        message: message.message,
      });
    } catch (err) {
      console.warn('Supabase sync warning for chat:', err);
    }
  }
}

export async function getUserChatMessages(userId: string): Promise<ChatMessage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as ChatMessage[];
      }
    } catch (err) {
      console.warn('Supabase fetch error for chat:', err);
    }
  }

  const all = loadFromStorage<ChatMessage[]>(STORAGE_KEYS.CHATS, []);
  return all.filter((m) => m.user_id === userId);
}

export function clearUserChatMessages(userId: string): void {
  const all = loadFromStorage<ChatMessage[]>(STORAGE_KEYS.CHATS, []);
  const remaining = all.filter((m) => m.user_id !== userId);
  saveToStorage(STORAGE_KEYS.CHATS, remaining);
}

// ----------------------------------------------------
// Job Matches
// ----------------------------------------------------
export async function saveJobMatch(match: JobMatchResult): Promise<JobMatchResult> {
  const matches = loadFromStorage<JobMatchResult[]>(STORAGE_KEYS.JOB_MATCHES, []);
  matches.unshift(match);
  saveToStorage(STORAGE_KEYS.JOB_MATCHES, matches);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('job_matches').insert({
        id: match.id,
        user_id: match.user_id,
        resume_id: match.resume_id,
        job_title: match.job_title,
        company: match.company,
        job_description: match.job_description,
        match_score: match.match_score,
        matched_keywords: match.matched_keywords,
        missing_keywords: match.missing_keywords,
        skill_gaps: match.skill_gaps,
        how_to_improve: match.how_to_improve,
      });
    } catch (err) {
      console.warn('Supabase sync warning for job match:', err);
    }
  }

  return match;
}

export async function getUserJobMatches(userId: string): Promise<JobMatchResult[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('job_matches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as JobMatchResult[];
      }
    } catch (err) {
      console.warn('Supabase fetch error for job matches:', err);
    }
  }

  const all = loadFromStorage<JobMatchResult[]>(STORAGE_KEYS.JOB_MATCHES, []);
  return all.filter((m) => m.user_id === userId);
}
