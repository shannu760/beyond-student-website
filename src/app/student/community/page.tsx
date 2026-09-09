"use client";

import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  HelpCircle,
  Plus,
  Star,
  Award,
  Send,
  Search,
  CheckCircle2,
  Flag,
  ShieldCheck
} from "lucide-react";

interface PeerQuestion {
  id: string;
  authorName: string;
  authorClass: string;
  subject: string;
  topic: string;
  questionText: string;
  timeAgo: string;
  helpfulVotes: number;
  answersCount: number;
  solved: boolean;
}

const INITIAL_POSTS: PeerQuestion[] = [
  {
    id: "post-1",
    authorName: "Rahul V.",
    authorClass: "Class 12 • JEE 2027",
    subject: "Physics",
    topic: "Electrostatics Dipole Torque",
    questionText: "How do you calculate potential energy when an electric dipole is rotated from 0° to 180° in a non-uniform field?",
    timeAgo: "2 hours ago",
    helpfulVotes: 14,
    answersCount: 3,
    solved: true
  },
  {
    id: "post-2",
    authorName: "Priya S.",
    authorClass: "Class 11 • NEET 2027",
    subject: "Chemistry",
    topic: "Organic Electrophilic Addition",
    questionText: "Why does Markovnikov addition happen faster in secondary carbocation intermediates compared to primary?",
    timeAgo: "4 hours ago",
    helpfulVotes: 8,
    answersCount: 2,
    solved: false
  },
  {
    id: "post-3",
    authorName: "Siddharth M.",
    authorClass: "Class 12 • JEE 2027",
    subject: "Mathematics",
    topic: "Limits L'Hôpital's Rule",
    questionText: "Is it mandatory to convert 0^0 indeterminate forms into exponential e^(lim g(x) ln f(x)) before taking derivatives?",
    timeAgo: "6 hours ago",
    helpfulVotes: 21,
    answersCount: 5,
    solved: true
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<PeerQuestion[]>(INITIAL_POSTS);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [showAskModal, setShowAskModal] = useState(false);
  const [reportedPosts, setReportedPosts] = useState<string[]>([]);
  const [reportNotification, setReportNotification] = useState<string | null>(null);

  const handleVote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, helpfulVotes: p.helpfulVotes + 1 } : p))
    );
  };

  const handleReport = (id: string) => {
    if (reportedPosts.includes(id)) return;
    setReportedPosts((prev) => [...prev, id]);
    setReportNotification("Question flagged for human moderator audit under the BEYOND Safety Charter.");
    setTimeout(() => {
      setReportNotification(null);
    }, 4000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newPost: PeerQuestion = {
      id: `post-${Date.now()}`,
      authorName: "Arjun K.",
      authorClass: "Class 12 • JEE 2027",
      subject: selectedSubject,
      topic: "General Help Request",
      questionText: newQuestionText,
      timeAgo: "Just now",
      helpfulVotes: 0,
      answersCount: 0,
      solved: false
    };

    setPosts([newPost, ...posts]);
    setNewQuestionText("");
    setShowAskModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#3D4425]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              Peer Learning & Community
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#E8DCC3] text-[#3D4425] px-2.5 py-0.5 rounded-full border border-[#3D4425]/20">
              Reputation Driven
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            Ask peer questions and explain concepts to earn +20 BEYOND Stars per helpful response.
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3D4425] text-[#F3EBDD] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#252B18] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C8A95B]" />
          <span>Ask Peer Help</span>
        </button>
      </div>

      {/* Minor Safety & Academic Integrity Charter Banner */}
      <div className="bg-[#283826] text-[#F7F5F0] rounded-2xl p-4 sm:p-5 border border-[#C8A95B]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C8A95B]/20 text-[#C8A95B] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-accent font-bold text-sm text-[#F7F5F0]">
                BEYOND Minor Safety & Academic Integrity Charter
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#C8A95B]/20 text-[#C8A95B] font-bold">
                Zero Tolerance
              </span>
            </div>
            <p className="text-xs text-[#F7F5F0]/80 leading-relaxed max-w-3xl">
              All peer interactions are strictly moderated for minor safety, conceptual rigor, and mutual respect. Exam paper leakages, homework cheating, toxic behavior, and harassment result in immediate permanent account suspension.
            </p>
          </div>
        </div>
      </div>

      {reportNotification && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3 text-xs flex items-center justify-between gap-2 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{reportNotification}</span>
          </div>
          <button
            onClick={() => setReportNotification(null)}
            className="text-[10px] font-bold underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Peer Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#F8F4EC] border border-[#3D4425]/20 hover:border-[#C8A95B] rounded-2xl p-5 sm:p-6 shadow-sm transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3D4425] text-[#F3EBDD] font-bold text-xs flex items-center justify-center border border-[#C8A95B]">
                  {post.authorName[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#252B18] flex items-center gap-2">
                    <span>{post.authorName}</span>
                    <span className="text-[10px] font-mono text-[#69704A]">{post.authorClass}</span>
                  </div>
                  <div className="text-[10px] text-[#69704A]">{post.timeAgo}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#252B18] text-[#C8A95B]">
                  {post.subject}
                </span>
                {post.solved && (
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Solved
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#252B18] font-medium leading-relaxed">
              {post.questionText}
            </p>

            <div className="pt-3 border-t border-[#3D4425]/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote(post.id)}
                  className="flex items-center gap-1.5 text-[#3D4425] font-bold hover:text-[#C8A95B] transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.helpfulVotes} Helpful Votes</span>
                </button>

                <span className="flex items-center gap-1 text-[#69704A]">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.answersCount} Explanations</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleReport(post.id)}
                  disabled={reportedPosts.includes(post.id)}
                  className={`flex items-center gap-1 text-[11px] transition-colors ${
                    reportedPosts.includes(post.id)
                      ? "text-emerald-700 font-bold"
                      : "text-[#69704A] hover:text-red-700"
                  }`}
                  title="Report question for safety or academic integrity violation"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{reportedPosts.includes(post.id) ? "Reported" : "Report"}</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-[#C8A95B] font-bold">
                +20 Stars for Helpful Answers
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-[#252B18]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F4EC] border border-[#3D4425]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-in">
            <h3 className="font-accent font-bold text-xl text-[#252B18]">Ask Peer Community</h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D4425] uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-[#E8DCC3] border border-[#3D4425]/20 rounded-xl px-3 py-2 text-xs text-[#252B18]"
                >
                  <option>Physics</option>
                  <option>Mathematics</option>
                  <option>Chemistry</option>
                  <option>General Biology</option>
                  <option>Scholarships & Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D4425] uppercase tracking-wider mb-1">
                  Your Question
                </label>
                <textarea
                  rows={4}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Explain what specific concept or problem step you need help with..."
                  className="w-full bg-[#E8DCC3] border border-[#3D4425]/20 rounded-xl px-3 py-2 text-xs text-[#252B18] placeholder-[#69704A]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#3D4425]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3D4425] text-[#F3EBDD] font-bold text-xs uppercase tracking-wider hover:bg-[#252B18]"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
