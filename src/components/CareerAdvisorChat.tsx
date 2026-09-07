
import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  RotateCcw,
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, ResumeAnalysisResult } from '../types';
import {
  saveChatMessage,
  getUserChatMessages,
  clearUserChatMessages,
} from '../lib/storage';

interface CareerAdvisorChatProps {
  userId: string;
  userName: string;
  resumeId: string;
  analysis: ResumeAnalysisResult | null;
  targetRole: string;
  initialQuery?: string;
}

const QUICK_PROMPTS = [
  {
    label: '✨ Improve My Resume',
    prompt:
      'What are the top 3 high-impact bullet points I should rewrite to improve my resume right now?',
  },
  {
    label: '📈 Increase ATS Score',
    prompt:
      'Explain exactly why my ATS score is at its current level and give me a step-by-step checklist to raise it by 15 points.',
  },
  {
    label: '🎯 Find Skill Gaps',
    prompt:
      'Which high-demand technical skills am I missing for my target role, and what is the fastest way to learn them?',
  },
  {
    label: '🚀 Suggest Projects',
    prompt:
      'Suggest 2 impressive portfolio projects I can build to prove my skills to recruiters for this role.',
  },
  {
    label: '💼 Match Job Description',
    prompt:
      'How do recruiters and ATS algorithms evaluate job description keyword alignment?',
  },
  {
    label: '🎤 Interview Preparation',
    prompt:
      'Based on the experience listed on my resume, what are 3 tough technical interview questions I should prepare for?',
  },
];

export const CareerAdvisorChat: React.FC<CareerAdvisorChatProps> = ({
  userId,
  userName,
  resumeId,
  analysis,
  targetRole,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------
  // Load chat history or create greeting
  // ----------------------------------------------------
  useEffect(() => {
    async function loadHistory() {
      const existing = await getUserChatMessages(userId);

      if (existing.length > 0) {
        setMessages(existing);
      } else {
        const greetingText = `Hi **${userName}**! 👋

I'm your **ResuMaster AI Career Advisor**.

I analyzed your resume for the **${targetRole}** role.

${
  analysis
    ? `Your current ATS score is **${analysis.ats_score}/100** (with potential to reach **${analysis.potential_score}/100**).`
    : `Upload your resume to calculate your official ATS score and unlock deep personalized insights.`
}

How can I help you strengthen your resume and advance your career today?`;

        const initialMsg: ChatMessage = {
          id: `msg_welcome_${Date.now()}`,
          user_id: userId,
          resume_id: resumeId,
          role: 'assistant',
          message: greetingText,
          created_at: new Date().toISOString(),
        };

        setMessages([initialMsg]);
        await saveChatMessage(initialMsg);
      }
    }

    loadHistory();
  }, [userId, userName, resumeId, targetRole]);

  // ----------------------------------------------------
  // Handle external query trigger
  // ----------------------------------------------------
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  // ----------------------------------------------------
  // Scroll to bottom
  // ----------------------------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  // ----------------------------------------------------
  // Send Message
  // ----------------------------------------------------
  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      user_id: userId,
      resume_id: resumeId,
      role: 'user',
      message: textToSend.trim(),
      created_at: new Date().toISOString(),
    };

    // Create updated history immediately so current message
    // is also included in the API conversation.
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    await saveChatMessage(userMsg);

    try {
      const chatContext = {
        userName,
        targetRole,
        atsScore: analysis?.ats_score,
        potentialScore: analysis?.potential_score,
        strengths: analysis?.strengths || [],
        weaknesses: analysis?.weaknesses || [],
        missingSkills:
          analysis?.missing_skills?.map((s) => s.name) || [],
      };

      // Send latest 8 messages to backend.
      // Current user message is now included.
      const historyForApi = updatedMessages
        .slice(-8)
        .map((m) => ({
          role: m.role,
          message: m.message,
        }));

      const response = await fetch('/api/ai/career-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend.trim(),
          chatContext,
          history: historyForApi,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to generate response.'
        );
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        user_id: userId,
        resume_id: resumeId,
        role: 'assistant',
        message: data.reply,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);

      await saveChatMessage(botMsg);
    } catch (err: any) {
      console.error('Chat error:', err);

      const fallbackMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        user_id: userId,
        resume_id: resumeId,
        role: 'assistant',
        message:
          "I'm experiencing a temporary network issue. Please check your connection and try again.",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // ----------------------------------------------------
  // Clear Chat
  // ----------------------------------------------------
  const handleClearHistory = () => {
    if (
      confirm(
        'Are you sure you want to clear your chat conversation?'
      )
    ) {
      clearUserChatMessages(userId);
      setMessages([]);
    }
  };

  // ----------------------------------------------------
  // Render
  // ----------------------------------------------------
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">

      {/* ==================================================
          CHAT HEADER
      ================================================== */}
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

          <h3 className="text-xs font-bold uppercase tracking-widest">
            AI Career Advisor
          </h3>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            • Personalized for {userName} ({targetRole})
          </span>
        </div>

        <button
          onClick={handleClearHistory}
          title="Clear chat history"
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors flex items-center space-x-1 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />

          <span className="hidden sm:inline text-[11px]">
            Clear
          </span>
        </button>
      </div>

      {/* ==================================================
          MESSAGES AREA
      ================================================== */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">

        {messages.map((m) => {
          const isUser = m.role === 'user';

          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                isUser
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >

              {/* AI Avatar */}
              {!isUser && (
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-xs mt-1">
                  AI
                </div>
              )}

              {/* MESSAGE BUBBLE */}
              <div
                className={`max-w-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-md'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-none shadow-sm'
                }`}
              >

                {/* USER MESSAGE */}
                {isUser ? (
                  <p className="whitespace-pre-wrap font-medium">
                    {m.message}
                  </p>
                ) : (

                  /* ==================================================
                     AI MARKDOWN MESSAGE
                  ================================================== */
                  <div className="max-w-none text-xs text-slate-800 font-normal overflow-x-auto">

                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      components={{

                        /* -------------------------------
                           HEADINGS
                        -------------------------------- */
                        h1: ({ children }) => (
                          <h1 className="text-base font-bold text-slate-900 mt-3 mb-2">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="text-sm font-bold text-slate-900 mt-3 mb-2">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="text-xs font-bold text-slate-900 mt-3 mb-1.5">
                            {children}
                          </h3>
                        ),

                        /* -------------------------------
                           PARAGRAPH
                        -------------------------------- */
                        p: ({ children }) => (
                          <p className="mb-2 leading-6">
                            {children}
                          </p>
                        ),

                        /* -------------------------------
                           BOLD
                        -------------------------------- */
                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900">
                            {children}
                          </strong>
                        ),

                        /* -------------------------------
                           ITALIC
                        -------------------------------- */
                        em: ({ children }) => (
                          <em className="italic">
                            {children}
                          </em>
                        ),

                        /* -------------------------------
                           LISTS
                        -------------------------------- */
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 mb-3 space-y-1">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5 mb-3 space-y-1">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li className="leading-5 pl-1">
                            {children}
                          </li>
                        ),

                        /* -------------------------------
                           LINKS
                        -------------------------------- */
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline"
                          >
                            {children}
                          </a>
                        ),

                        /* -------------------------------
                           INLINE CODE
                        -------------------------------- */
                        code: ({ children, className }) => {
                          const isBlock =
                            className?.includes('language-');

                          return isBlock ? (
                            <code className="block">
                              {children}
                            </code>
                          ) : (
                            <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-[11px] font-mono">
                              {children}
                            </code>
                          );
                        },

                        /* -------------------------------
                           CODE BLOCK
                        -------------------------------- */
                        pre: ({ children }) => (
                          <pre className="my-3 p-3 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-[11px] leading-5">
                            {children}
                          </pre>
                        ),

                        /* -------------------------------
                           BLOCKQUOTE
                        -------------------------------- */
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-300 bg-blue-50 px-3 py-2 my-3 italic text-slate-600">
                            {children}
                          </blockquote>
                        ),

                        /* -------------------------------
                           HORIZONTAL RULE
                        -------------------------------- */
                        hr: () => (
                          <hr className="my-3 border-slate-200" />
                        ),

                        /* ==================================================
                           TABLE
                        ================================================== */
                        table: ({ children }) => (
                          <div className="my-4 w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                            <table className="w-full min-w-[550px] border-collapse text-xs bg-white">
                              {children}
                            </table>
                          </div>
                        ),

                        thead: ({ children }) => (
                          <thead className="bg-slate-100">
                            {children}
                          </thead>
                        ),

                        tbody: ({ children }) => (
                          <tbody className="divide-y divide-slate-100">
                            {children}
                          </tbody>
                        ),

                        tr: ({ children }) => (
                          <tr className="even:bg-slate-50 hover:bg-blue-50/40 transition-colors">
                            {children}
                          </tr>
                        ),

                        th: ({ children }) => (
                          <th className="border-b border-slate-200 px-3 py-2.5 text-left font-bold text-slate-700 whitespace-nowrap">
                            {children}
                          </th>
                        ),

                        td: ({ children }) => (
                          <td className="border-b border-slate-100 px-3 py-2.5 text-slate-700 align-top leading-5">
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {m.message}
                    </Markdown>

                  </div>
                )}
              </div>

              {/* USER AVATAR */}
              {isUser && (
                <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-1">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

            </div>
          );
        })}

        {/* ==================================================
            TYPING INDICATOR
        ================================================== */}
        {isTyping && (
          <div className="flex items-start gap-2.5 justify-start">

            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 shadow-xs mt-1">
              AI
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5">

              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />

              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />

              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />

            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ==================================================
          QUICK ACTION PROMPTS
      ================================================== */}
      <div className="px-5 py-2.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">

        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
          Suggestions:
        </span>

        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(qp.prompt)}
            disabled={isTyping}
            className="flex-shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* ==================================================
          CHAT INPUT
      ================================================== */}
      <div className="p-3 bg-white border-t border-slate-200">

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1 pr-2"
        >

          <input
            type="text"
            placeholder={`Ask your career advisor anything about your ${targetRole} resume...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-transparent border-none text-xs px-3 py-2 focus:ring-0 focus:outline-none placeholder-slate-400 text-slate-800 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </button>

        </form>
      </div>

    </div>
  );
};
