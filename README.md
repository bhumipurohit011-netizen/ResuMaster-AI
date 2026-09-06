
🤖 ResuMaster AI

ResuMaster AI is an AI-powered career assistant that helps users analyze resumes, improve ATS performance, match jobs, rewrite resume content, and get personalized career guidance through an interactive AI chatbot.

It combines Resume Intelligence + AI + Career Assistance into one platform designed for students, freshers, and job seekers.
_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

🚀 Features

## 🚀 Features

- 📄 **AI Resume Analysis** — Generate ATS scores, strengths, weaknesses, and improvement suggestions.
- 🎯 **Job Matching** — Compare resumes with job descriptions and identify skill gaps.
- ✍️ **AI Resume Rewriting** — Generate professional and ATS-friendly resume content.
- 🤖 **Career AI Chatbot** — Get career, interview, skill, project, and job-search guidance using Groq AI.
- 🔐 **Authentication** — Secure user authentication using Supabase.

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
🧩 Architecture User
  
  ## 🧩 System Architecture

```text
┌──────────────┐
│     USER     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  REACT FRONTEND  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ NODE.JS + EXPRESS│
└──────┬─────┬─────┘
       │     │
       ▼     ▼
┌──────────┐ ┌──────────┐
│ GEMINI AI│ │  GROQ AI │
└─────┬────┘ └────┬─────┘
      │            │
      └──────┬─────┘
             ▼
      ┌──────────────┐
      │   SUPABASE   │
      └──────────────┘
```
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
_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
⚙️ Installation

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/bhumipurohit011-netizen/ResuMaster-AI.git
cd ResuMaster-AI
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

🛠️ Technologies Used

## 🛠️ Technologies Used

### 1. Frontend
- React
- TypeScript
- Vite
- CSS

### 2. Backend
- Node.js
- Express.js

### 3. AI
- Gemini AI
- Groq AI

### 4. Database
- Supabase
- PostgreSQL

### 5. File Processing
- PDF
- DOCX

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

🎯 Use Cases
## 🎯 Use Cases

- Resume Improvement
- ATS Optimization
- Job Matching
- Career Planning
- Interview Preparation
- Skill-Gap Identification
- AI-Powered Career Assistance

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________


🔮 Future Improvements
## 🔮 Future Improvements

- 🎤 **AI Mock Interviews**
- 🗣️ **Voice-Based Career Assistant**
- 💼 **Automated Job Recommendations**
- 📚 **Personalized Learning Paths**
- 🔗 **LinkedIn Profile Optimization**
- 📊 **Career Analytics Dashboard**

_____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

🌐 Deployment

## 🌐 Deployment

The application is deployed on **Render**.

### Deployment Flow

```text
┌──────────────────┐
│      GitHub      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│      Render      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  ResuMaster AI   │
└───────┬────┬─────┘
        │    │
        ▼    ▼
┌──────────┐ ┌──────────┐
│ Gemini AI│ │  Groq AI │
└──────────┘ └────┬─────┘
                  │
                  ▼
           ┌──────────────┐
           │   Supabase   │
           └──────────────┘
```

   _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________



