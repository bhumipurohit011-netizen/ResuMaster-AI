
🤖 ResuMaster AI

ResuMaster AI is an AI-powered career assistant that helps users analyze resumes, improve ATS performance, match jobs, rewrite resume content, and get personalized career guidance through an interactive AI chatbot.

It combines Resume Intelligence + AI + Career Assistance into one platform designed for students, freshers, and job seekers.
_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

🚀 Features
📄 AI Resume Analysis — Generate ATS scores, strengths, weaknesses, and improvement suggestions.
🎯 Job Matching — Compare resumes with job descriptions and identify skill gaps.
✍️ AI Resume Rewriting — Generate professional and ATS-friendly resume content.
🤖 Career AI Chatbot — Get career, interview, skill, project, and job-search guidance using Groq AI.
🔐 Authentication — Secure user authentication using Supabase.

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
🧩 Architecture User
                ┌──────────────┐
│     USER     │
└──────┬───────┘
       ↓
┌──────────────────┐
│  REACT FRONTEND  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ NODE.JS + EXPRESS│
└──────┬─────┬─────┘
       ↓     ↓
┌──────────┐ ┌──────────┐
│ GEMINI AI│ │  GROQ AI │
└──────────┘ └──────────┘
       │     │
       └──┬──┘
          ↓
┌──────────────────┐
│     SUPABASE     │
└──────────────────┘
_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
🔄 Application Workflow

                 ┌──────────────────┐
                 │      START       │
                 └────────┬─────────┘
                          ↓
              ┌──────────────────────┐
              │  Login / Register    │
              └──────────┬───────────┘
                         ↓
                   ◇ Authentication ◇
                    /            \
                  No              Yes
                  ↓                ↓
               Login        ┌─────────────┐
                            │  Dashboard  │
                            └──────┬──────┘
                                   ↓
              ┌────────────────────┼────────────────────┐
              ↓                    ↓                    ↓
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │Upload Resume│      │Job Description│      │  Rewriting  │
       └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
              ↓                    ↓                    ↓
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │AI Analysis  │      │Job Matching  │      │AI Suggestions│
       └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
              ↓                    ↓                    ↓
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │ ATS Score   │      │Skill Gaps   │      │Improved CV  │
       └─────────────┘      └─────────────┘      └─────────────┘

                              +
                     ┌─────────────────┐
                     │ Career Chatbot  │
                     └────────┬────────┘
                              ↓
                     ┌─────────────────┐
                     │    Groq AI      │
                     └────────┬────────┘
                              ↓
                     ┌─────────────────┐
                     │Career Guidance  │
                     └─────────────────┘

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

📂 Project Structure
   ResuMaster-AI/
│
├── src/
│   ├── components/     
│   ├── pages/          
│   ├── services/       
│   └── ...
│
├── server.ts          
├── package.json        
├── tsconfig.json       
├── vite.config.ts    
├── index.html          
├── .env                
├── .gitignore         
└── README.md           

⚙️ Installation
Clone Repository
git clone https://github.com/bhumipurohit011-netizen/ResuMaster-AI.git
cd ResuMaster-AI
Install Dependencies
npm install
Configure Environment Variables

Create a .env file in the project root:

GROQ_API_KEY=your_groq_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Run Locally
npm run dev

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

🛠️ Technologies Used
1.Frontend :-
React, TypeScript, Vite, CSS
2.Backend
Node.js, Express.js
3.AI
Groq AI
4.Database
Supabase PostgreSQ
5.File Processing
PDF & DOCX

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

🎯 Use Cases
Resume improvement
ATS optimization
Job matching
Career planning
Interview preparation
Skill-gap identification
AI-powered career assistance

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________


🔮 Future Improvements
🎤 AI mock interviews
🗣️ Voice-based career assistant
💼 Automated job recommendations
📚 Personalized learning paths
🔗 LinkedIn profile optimization
📊 Career analytics dashboard

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

🌐 Deployment

The application can be deployed on Render or other Node.js-compatible hosting platforms.

GitHub
   │
   ▼
Render
   │
   ▼
ResuMaster AI
   │
   ├──► Groq AI
   └──► Supabase

   _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________



