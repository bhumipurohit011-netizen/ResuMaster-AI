export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  target_role?: string;
  created_at: string;
  updated_at?: string;
}

export interface ResumeDocument {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url?: string;
  extracted_text: string;
  target_role: string;
  created_at: string;
}

export interface ScoreBreakdown {
  atsCompatibility: number;
  keywords: number;
  technicalSkills: number;
  experience: number;
  projects: number;
  education: number;
  achievements: number;
  formatting: number;
}

export interface SkillItem {
  name: string;
  level: 'Advanced' | 'Intermediate' | 'Beginner';
  category?: 'Languages' | 'Frameworks' | 'Tools & DB' | 'Methodologies' | 'Soft Skills' | 'General';
}

export interface MissingSkillItem {
  name: string;
  importance?: 'High' | 'Medium' | 'Low' | string;
  priority?: 'High' | 'Medium' | 'Low' | string;
  reason?: string;
  learningPath?: string;
  recommendedResources?: string[];
}

export interface RecommendationItem {
  id?: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  title: string;
  problem: string;
  whyItMatters: string;
  howToFix: string;
  example: string;
  pointsImpact?: number;
}

export interface ScoreImprovementItem {
  category: string;
  points: number;
  description?: string;
}

export interface SectionFeedback {
  status: 'good' | 'warning' | 'needs_work';
  feedback: string;
}

export interface SectionAnalysis {
  summary?: SectionFeedback;
  experience?: SectionFeedback;
  projects?: SectionFeedback;
  skills?: SectionFeedback;
  education?: SectionFeedback;
  formatting?: SectionFeedback;
}

export interface RewriteSuggestion {
  id: string;
  section?: 'Professional Summary' | 'Work Experience' | 'Projects' | 'Skills' | 'Achievements' | string;
  section_name?: string;
  originalText?: string;
  original_text?: string;
  suggestedText?: string;
  improved_text?: string;
  reason?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ResumeAnalysisResult {
  id: string;
  resume_id: string;
  user_id: string;
  target_role: string;
  ats_score: number;
  potential_score: number;
  breakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  skills: SkillItem[];
  missing_skills: MissingSkillItem[];
  missing_keywords: string[];
  recommendations: RecommendationItem[];
  score_improvements: ScoreImprovementItem[];
  section_analysis: SectionAnalysis;
  rewrite_suggestions: RewriteSuggestion[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  resume_id?: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface JobMatchResult {
  id: string;
  user_id: string;
  resume_id: string;
  job_title?: string;
  company?: string;
  job_description: string;
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  skill_gaps: string[];
  how_to_improve: string[];
  created_at: string;
}

export type TargetRole =
  | 'Data Analyst'
  | 'Data Scientist'
  | 'ML Engineer'
  | 'AI Engineer'
  | 'Software Developer'
  | 'Full Stack Developer'
  | 'Backend Developer'
  | 'Frontend Developer'
  | 'Business Analyst'
  | 'Cloud Engineer'
  | 'DevOps Engineer'
  | 'Product Manager'
  | 'Cybersecurity Analyst'
  | 'Other';
