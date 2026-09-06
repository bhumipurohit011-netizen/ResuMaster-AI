-- RESUMASTER AI: Database Schema & Row Level Security (RLS)
-- Run this in your Supabase SQL Editor to set up tables and security policies.

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  target_role TEXT DEFAULT 'Data Analyst',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  file_url TEXT,
  extracted_text TEXT NOT NULL,
  target_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Resume Analysis Table
CREATE TABLE IF NOT EXISTS public.resume_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_role TEXT NOT NULL,
  ats_score INTEGER NOT NULL,
  potential_score INTEGER NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  score_improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
  section_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  rewrite_suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resume analysis"
  ON public.resume_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume analysis"
  ON public.resume_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume analysis"
  ON public.resume_analysis FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume analysis"
  ON public.resume_analysis FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages"
  ON public.chat_messages FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Job Matches Table
CREATE TABLE IF NOT EXISTS public.job_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT,
  company TEXT,
  job_description TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  matched_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  skill_gaps JSONB NOT NULL DEFAULT '[]'::jsonb,
  how_to_improve JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own job matches"
  ON public.job_matches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job matches"
  ON public.job_matches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job matches"
  ON public.job_matches FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Resume Suggestions Table
CREATE TABLE IF NOT EXISTS public.resume_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  section TEXT NOT NULL,
  original_text TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resume_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resume suggestions"
  ON public.resume_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume suggestions"
  ON public.resume_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume suggestions"
  ON public.resume_suggestions FOR UPDATE
  USING (auth.uid() = user_id);
