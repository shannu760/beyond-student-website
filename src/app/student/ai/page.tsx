"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  Target,
  ExternalLink,
  Bot,
  User,
  ShieldCheck,
  RotateCcw,
  Compass,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { StudentChatMessage } from "@/lib/ai/student-ai-types";
import { generateStudentAIResponse } from "@/lib/ai/student-engine";

const INITIAL_MESSAGES: StudentChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: `Hello Arjun! I'm your **BEYOND AI Student Assistant & Growth Guide**.

I'm loaded with your current student context:
- 🎓 **Class**: Class 12 (AY 2026–27)
- 🎯 **Target**: JEE Main 2027
- 🔬 **Current Focus Weak Topic**: Electrostatics & Organic Chemistry Reaction Mechanisms

How can I help you make meaningful academic progress right now?`,
    timestamp: "10:30 AM",
    suggestedActions: [
      "Diagnose My Pathway Alignment",
      "Explain Electrostatics Dipole Concept",
      "Generate 15-Min Chapter Quiz",
      "Find Matched Scholarships (NSP)"
    ]
  }
];

export default function AIAssistantPage() {
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<StudentChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile) {
          setProfile(data.profile);
          const fName = data.profile.fullName ? data.profile.fullName.trim().split(" ")[0] : "Krishna";
          setMessages([
            {
              id: "msg-1",
              role: "assistant",
              content: `Hello ${fName}! I'm your **BEYOND AI Student Assistant & Growth Guide**.

I'm loaded with your current student context:
- 🎓 **Class**: ${data.profile.classLevel || "Class 12"} (AY 2026–27)
- 🎯 **Target**: ${data.profile.targetExam || "JEE Main 2027"}
- 🔬 **Current Focus Weak Topic**: Electrostatics & Organic Chemistry Reaction Mechanisms

How can I help you make meaningful academic progress right now?`,
              timestamp: "10:30 AM",
              suggestedActions: [
                "Diagnose My Pathway Alignment",
                "Explain Work-Energy Theorem",
                "Create Today's Pomodoro Study Blocks",
                "Check Reliance Scholarship Checklist",
              ],
            },
          ]);
        }
      })
      .catch((err) => console.error("Error loading profile for AI chat:", err));
  }, []);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: StudentChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    try {
      const response = await generateStudentAIResponse(
        query,
        {
          studentId: profile?.id || "student-krishna-addanki-2026",
          name: profile?.fullName || "Krishna Addanki",
          classLevel: profile?.classLevel || "Class 12",
          targetExam: profile?.targetExam || "JEE Main",
          subjects: ["Physics", "Mathematics", "Chemistry"],
          interests: ["Engineering", "Computer Science"],
          weakTopics: ["Electrostatics", "Organic Mechanisms"],
          strongTopics: ["Kinematics", "Vectors"],
          starsBalance: profile?.starsBalance ?? 642,
          streakDays: profile?.streakDays ?? 1
        },
        messages
      );

      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C8A95B]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              BEYOND AI Student Assistant
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#252B18] text-[#C8A95B] px-2.5 py-0.5 rounded-full border border-[#C8A95B]/40">
              Context-Aware Tutor
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            Grounded in official NTA bulletins & National Scholarship Portal sources. Never exposing API keys to the browser.
          </p>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="p-2 text-xs font-medium text-[#3D4425] hover:text-[#C8A95B] flex items-center gap-1 rounded-lg border border-[#3D4425]/20 hover:bg-[#E8DCC3] transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-[#F8F4EC] border border-[#3D4425]/20 rounded-3xl shadow-lg flex flex-col overflow-hidden relative">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 max-w-3xl ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#3D4425] text-[#F3EBDD] border border-[#C8A95B]"
                    : "bg-[#252B18] text-[#C8A95B] border border-[#C8A95B]/40"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-2 max-w-2xl">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#3D4425] text-[#F3EBDD] rounded-tr-none"
                      : "bg-[#252B18] text-[#F3EBDD] border border-[#69704A]/30 rounded-tl-none"
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {/* Grounding Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#69704A]/30 space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#C8A95B] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Source Attribution</span>
                      </div>
                      {msg.citations.map((cit, idx) => (
                        <a
                          key={idx}
                          href={cit.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block bg-[#3D4425]/60 hover:bg-[#3D4425] p-2.5 rounded-lg border border-[#69704A]/30 transition-colors group"
                        >
                          <div className="flex items-center justify-between font-bold text-xs text-[#C8A95B] mb-0.5">
                            <span>{cit.sourceName}</span>
                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <div className="text-[11px] text-[#E8DCC3]/80">{cit.snippet}</div>
                        </a>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[9px] font-mono mt-2 text-right ${
                      msg.role === "user" ? "text-[#E8DCC3]/60" : "text-[#D9CAA8]/60"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(act)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#E8DCC3] hover:bg-[#3D4425] text-[#252B18] hover:text-[#F3EBDD] border border-[#3D4425]/20 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-3 h-3 text-[#C8A95B]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-9 h-9 rounded-full bg-[#252B18] text-[#C8A95B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C8A95B]/40">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#252B18] text-[#F3EBDD] p-3.5 rounded-2xl rounded-tl-none border border-[#69704A]/30 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#C8A95B] animate-ping" />
                <span className="text-[#D9CAA8]">Analyzing student context & retrieving official references...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#252B18] border-t border-[#69704A]/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything: concept explanation, study plan, scholarship criteria..."
              className="flex-1 bg-[#3D4425]/60 border border-[#69704A]/40 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F3EBDD] placeholder-[#D9CAA8]/50 focus:outline-none focus:border-[#C8A95B] transition-colors"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-3 rounded-xl bg-[#C8A95B] hover:bg-[#d4b566] disabled:opacity-50 text-[#252B18] font-bold transition-all shadow-md shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
