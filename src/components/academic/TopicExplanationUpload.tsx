"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Star, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ThumbsUp, 
  Award, 
  Sparkles, 
  BookOpen, 
  X,
  Clock,
  Download,
  Share2
} from "lucide-react";

interface Explanation {
  id: string;
  studentName: string;
  subject: string;
  topicTitle: string;
  explanationText: string;
  fileAttachment?: {
    name: string;
    size: number;
    url: string;
    type: string;
  };
  starsEarned: number;
  upvotes: number;
  createdAt: string;
}

const SYLLABUS_TOPICS = [
  { subject: "Physics", topic: "Moment of Inertia of Rigid Bodies (Integration Method)" },
  { subject: "Physics", topic: "Work-Energy Theorem with Variable Forces" },
  { subject: "Physics", topic: "Faraday's Law & Lenz's Law Induced EMF" },
  { subject: "Physics", topic: "Carnot Cycle & Second Law Thermodynamics" },
  { subject: "Mathematics", topic: "Leibniz Rule for Differentiation Under Integral Sign" },
  { subject: "Mathematics", topic: "Bayes' Theorem & Total Probability Law" },
  { subject: "Mathematics", topic: "Indeterminate Limits via L'Hôpital & Series Expansion" },
  { subject: "Mathematics", topic: "Vector Cross-Product & Shortest Distance Between Skew Lines" },
  { subject: "Chemistry", topic: "Crystal Field Theory (CFT) in Octahedral Complexes" },
  { subject: "Chemistry", topic: "SN1 vs SN2 Nucleophilic Substitution Mechanisms" },
  { subject: "Chemistry", topic: "Nernst Equation & Electrochemical Cell Potential" },
  { subject: "Biology", topic: "Hardy-Weinberg Equilibrium & Gene Frequencies" },
  { subject: "Biology", topic: "Electron Transport System (ETS) & Chemiosmosis" }
];

export function TopicExplanationUpload() {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [explanationText, setExplanationText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [starsBalance, setStarsBalance] = useState(1450);
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [activeTab, setActiveTab] = useState<"submit" | "feed">("submit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  // Load preserved profile and explanations on mount
  useEffect(() => {
    async function loadData() {
      try {
        const resProfile = await fetch("/api/profile");
        const jsonProfile = await resProfile.json();
        if (jsonProfile.profile?.starsBalance) {
          setStarsBalance(jsonProfile.profile.starsBalance);
        }

        const resExp = await fetch("/api/explanations");
        const jsonExp = await resExp.json();
        if (jsonExp.explanations) {
          setExplanations(jsonExp.explanations);
        }
      } catch (err) {
        console.error("Error loading initial explanation data:", err);
      }
    }
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate 10 MB Limit
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(2);
      setFileError(`File size (${sizeMb} MB) exceeds maximum upload limit of 10 MB. Please compress or choose a smaller file.`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanationText.trim()) return;

    setIsUploading(true);
    setFileError(null);
    setSuccessMessage(null);

    try {
      let fileAttachmentData = undefined;

      // 1. Upload File if present (with 10 MB check)
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.error || "File upload failed.");
        }
        fileAttachmentData = uploadJson.file;
      }

      // 2. Submit Explanation to Backend
      const currentTopic = SYLLABUS_TOPICS[selectedTopicIndex];
      const res = await fetch("/api/explanations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: "Arjun Kumar",
          subject: currentTopic.subject,
          topicTitle: currentTopic.topic,
          explanationText,
          fileAttachment: fileAttachmentData
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit explanation.");
      }

      // 3. Update stars balance in UI and append explanation to feed
      setStarsBalance(json.newStarsBalance);
      setSuccessMessage(`Outstanding! Your explanation was verified. +${json.starsAwarded} Stars have been deposited to your student profile.`);
      setExplanations((prev) => [json.explanation, ...prev]);

      // Reset form
      setExplanationText("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setFileError(err.message || "An error occurred while submitting.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="explain-and-earn" className="py-16 md:py-24 border-b border-[#E1DDD2] bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Section Header with Real-Time Profile Stars Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E1DDD2]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B07D4F]" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#B07D4F]">
                Feynman Technique • Peer Explanation & Star Rewards
              </span>
            </div>

            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1A2219] tracking-tight leading-tight">
              Explain a Concept. <span className="italic font-normal text-[#283826]">Earn Academic Stars.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#556052] leading-relaxed max-w-2xl font-sans">
              Teaching a topic is the highest form of mastery. Write a conceptual derivation or attach your handwritten solution (up to 10 MB). Verified explanations reward you with +50 to +100 Stars preserved in your student profile.
            </p>
          </div>

          {/* Preserved Profile Stars Counter */}
          <div className="bg-[#283826] text-[#F7F5F0] rounded p-4 border border-[#364A33] shrink-0 min-w-[200px] flex items-center justify-between shadow-xs">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#F0EDE4]/80 tracking-wider">
                Preserved Balance
              </div>
              <div className="font-serif font-bold text-2xl text-[#F7F5F0] flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{starsBalance.toLocaleString()}</span>
                <span className="text-xs font-sans font-normal text-[#F0EDE4]/80">Stars</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#364A33] text-amber-300 border border-amber-500/30">
              Rank #4
            </span>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-3 border-b border-[#E1DDD2] pb-2">
          <button
            onClick={() => setActiveTab("submit")}
            className={`
              pb-2 px-3 text-xs font-mono font-bold transition-all border-b-2
              ${
                activeTab === "submit"
                  ? "border-[#283826] text-[#283826]"
                  : "border-transparent text-[#556052] hover:text-[#1A2219]"
              }
            `}
          >
            Submit Topic Explanation (+75 Stars)
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={`
              pb-2 px-3 text-xs font-mono font-bold transition-all border-b-2 flex items-center gap-2
              ${
                activeTab === "feed"
                  ? "border-[#283826] text-[#283826]"
                  : "border-transparent text-[#556052] hover:text-[#1A2219]"
              }
            `}
          >
            <span>Peer Explanations Feed</span>
            <span className="text-[10px] bg-[#F0EDE4] text-[#283826] px-1.5 py-0.2 rounded font-mono">
              {explanations.length}
            </span>
          </button>
        </div>

        {/* TAB 1: SUBMISSION FORM */}
        {activeTab === "submit" && (
          <div className="bg-[#F7F5F0] rounded border border-[#E1DDD2] p-6 sm:p-8 space-y-6 shadow-xs">
            {successMessage && (
              <div className="p-4 rounded bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span className="font-medium">{successMessage}</span>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-emerald-700 hover:text-emerald-950 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {fileError && (
              <div className="p-4 rounded bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <span className="font-medium">{fileError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Topic Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-[#1A2219] flex items-center justify-between">
                  <span>1. Select Curriculum Syllabus Topic</span>
                  <span className="text-[10px] text-[#6C7D64] font-normal">Official NCERT / JEE / NEET</span>
                </label>
                <select
                  value={selectedTopicIndex}
                  onChange={(e) => setSelectedTopicIndex(Number(e.target.value))}
                  className="w-full bg-white border border-[#E1DDD2] rounded p-3 text-xs font-sans text-[#1A2219] focus:outline-none focus:border-[#283826] shadow-2xs"
                >
                  {SYLLABUS_TOPICS.map((item, idx) => (
                    <option key={idx} value={idx}>
                      [{item.subject}] {item.topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Written Explanation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase font-bold text-[#1A2219]">
                    2. Write Conceptual Explanation / Step-by-Step Proof
                  </label>
                  <span className="text-[10px] text-[#556052] font-mono">
                    {explanationText.length} characters (min 40)
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={explanationText}
                  onChange={(e) => setExplanationText(e.target.value)}
                  placeholder="Explain the intuition, state the governing theorem, write the derivation steps, or point out common traps students fall into during exams..."
                  className="w-full bg-white border border-[#E1DDD2] rounded p-3 text-xs font-sans text-[#1A2219] placeholder:text-[#556052]/60 focus:outline-none focus:border-[#283826] shadow-2xs leading-relaxed"
                  required
                />
              </div>

              {/* 10 MB File Attachment Uploader */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase font-bold text-[#1A2219] flex items-center gap-1.5">
                    <span>3. Attach Handwritten Notes / Solution Diagram</span>
                    <span className="text-[10px] font-mono font-bold text-[#B07D4F] bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Up to 10 MB Limit
                    </span>
                  </label>
                  <span className="text-[10px] text-[#6C7D64] font-mono">
                    +25 Bonus Stars
                  </span>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E1DDD2] hover:border-[#283826] rounded-lg p-6 text-center cursor-pointer bg-white transition-colors space-y-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.webm,.mp4"
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-[#6C7D64] mx-auto" />
                  
                  {file ? (
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#283826] font-mono">
                        {file.name}
                      </div>
                      <div className="text-[11px] text-[#556052] font-mono">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB of 10 MB max limit
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[#1A2219]">
                        Click or drag handwritten solution sheet / diagram / PDF here
                      </p>
                      <p className="text-[11px] text-[#556052]">
                        Accepted: PDF, PNG, JPG, WEBP, WebM • Strict maximum file limit: <strong>10 MB</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-[#556052] flex items-center gap-1.5 font-mono">
                  <Award className="w-4 h-4 text-[#B07D4F]" />
                  <span>Base Reward: <strong>+50 Stars</strong> • With Attachment: <strong>+75 Stars</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={isUploading || explanationText.trim().length < 40}
                  className="px-6 py-3 rounded bg-[#283826] text-[#F7F5F0] text-xs font-bold uppercase tracking-wider hover:bg-[#364A33] disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  {isUploading ? (
                    <span>Verifying & Uploading...</span>
                  ) : (
                    <>
                      <span>Submit & Earn Stars</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: PEER EXPLANATIONS FEED */}
        {activeTab === "feed" && (
          <div className="space-y-4">
            {explanations.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded bg-white border border-[#E1DDD2] space-y-3 shadow-2xs hover:border-[#283826] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E1DDD2]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F0EDE4] text-[#283826] border border-[#E1DDD2]">
                      {item.subject}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#1A2219]">
                      {item.topicTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-[#B07D4F] flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-[#B07D4F]" />
                      <span>+{item.starsEarned} Stars</span>
                    </span>
                    <span className="text-[10px] text-[#556052] font-mono">
                      By {item.studentName}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#556052] leading-relaxed font-sans">
                  {item.explanationText}
                </p>

                {item.fileAttachment && (
                  <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#E1DDD2] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#283826] font-mono">
                      <FileText className="w-4 h-4 text-[#6C7D64]" />
                      <span>{item.fileAttachment.name}</span>
                      <span className="text-[10px] text-[#556052]">
                        ({(item.fileAttachment.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>

                    <a
                      href={item.fileAttachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#283826] hover:text-[#364A33] font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View Solution</span>
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px] text-[#556052] font-mono">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Verified Concept Integrity</span>
                  </span>

                  <button className="flex items-center gap-1 hover:text-[#283826] transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({item.upvotes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
