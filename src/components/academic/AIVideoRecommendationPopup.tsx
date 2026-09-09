"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  X, 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Bot, 
  BookOpen, 
  Search, 
  ArrowRight,
  Clock,
  ThumbsUp
} from "lucide-react";
import { VIDEO_CURRICULUM, VideoCurriculumItem } from "@/data/videoCurriculum";
import { useAIVideoRecommendations } from "@/hooks/useAIVideoRecommendations";

export function AIVideoRecommendationPopup() {
  const { topRecommendation, recommendations, lastEventMessage, completedCount } = useAIVideoRecommendations();
  const [showToast, setShowToast] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [recommendedVideo, setRecommendedVideo] = useState<VideoCurriculumItem>(
    topRecommendation || VIDEO_CURRICULUM[0]
  );
  const [aiRationale, setAiRationale] = useState<string>(
    topRecommendation?.aiRationale ||
      "Based on your recent practice in Mechanics & Work-Energy Theorem, this concept-heavy lecture by ABJ Sir will solidify your foundation before tomorrow's revision."
  );
  const [userQuery, setUserQuery] = useState("");
  const [searchMatches, setSearchMatches] = useState<VideoCurriculumItem[]>([]);
  const [searching, setSearching] = useState(false);

  // Sync with real-time engine when topRecommendation updates
  useEffect(() => {
    if (topRecommendation) {
      setRecommendedVideo(topRecommendation);
      if (topRecommendation.aiRationale) {
        setAiRationale(topRecommendation.aiRationale);
      }
    }
  }, [topRecommendation]);

  // Trigger popup after 4 seconds initially or when tasks are updated
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 4000);

    const handleOpenRecommender = () => {
      setModalOpen(true);
      setShowToast(false);
    };

    const handleTaskUpdated = () => {
      setShowToast(true);
    };

    window.addEventListener("beyond:open-ai-video-recommender", handleOpenRecommender);
    window.addEventListener("beyond:task-updated", handleTaskUpdated);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beyond:open-ai-video-recommender", handleOpenRecommender);
      window.removeEventListener("beyond:task-updated", handleTaskUpdated);
    };
  }, []);

  // Custom AI Query Matching
  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setSearching(true);
    setTimeout(() => {
      const q = userQuery.toLowerCase();
      const results = VIDEO_CURRICULUM.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.chapterName.toLowerCase().includes(q) ||
          v.unitName.toLowerCase().includes(q) ||
          v.keyTopicsCovered.some((t) => t.toLowerCase().includes(q)) ||
          v.subject.toLowerCase().includes(q)
      );

      setSearchMatches(results.length > 0 ? results : [VIDEO_CURRICULUM[0], VIDEO_CURRICULUM[1]]);
      setSearching(false);
    }, 400);
  };

  return (
    <>
      {/* Floating Bottom-Left Smart In-App Notification Toast */}
      {showToast && !modalOpen && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-[#FAF8F5] rounded-xl border-2 border-[#283826] p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#E1DDD2]">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#283826]">
              <Sparkles className="w-3.5 h-3.5 text-[#B07D4F]" />
              <span>AI Video Recommendation</span>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-[#6C7D64] hover:text-[#1A2219] p-0.5 rounded"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-[#556052] font-sans my-2 leading-relaxed">
            {aiRationale}
          </p>

          <div className="p-2.5 rounded-lg bg-white border border-[#E1DDD2] space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#283826] font-bold">{recommendedVideo.exam} • {recommendedVideo.subject}</span>
              <span className="text-[#B07D4F] font-semibold">{recommendedVideo.duration}</span>
            </div>

            <div className="font-serif font-bold text-xs text-[#1A2219] line-clamp-1">
              {recommendedVideo.title}
            </div>

            <div className="text-[11px] text-[#556052] truncate">
              Educator: <strong>{recommendedVideo.instructor}</strong> ({recommendedVideo.channelName})
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EFECE3]">
              <button
                type="button"
                onClick={() => {
                  setShowToast(false);
                  setModalOpen(true);
                }}
                className="text-[11px] font-semibold text-[#283826] hover:underline flex items-center gap-1"
              >
                <span>Find more matches</span>
              </button>

              <a
                href={recommendedVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Watch</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Full AI Recommendation & Video Matcher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2219]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl bg-[#FAF8F5] rounded-xl border border-[#D5CFBE] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#ECE7DC] border-b border-[#D5CFBE] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#283826] text-[#F7F5F0] flex items-center justify-center font-serif font-bold text-base shadow-2xs">
                  <Sparkles className="w-4 h-4 text-[#B07D4F]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1A2219]">
                    AI Video Matcher & Curriculum Navigator
                  </h3>
                  <p className="text-xs text-[#5E685B] font-sans">
                    Tell AI what concept or problem type you are struggling with
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#5E685B] hover:text-[#1A2219] hover:bg-[#DDD7C8] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              
              {/* Search Form */}
              <form onSubmit={handleAISearch} className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase text-[#556052]">
                  Ask AI to Recommend the Exact Video:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#6C7D64] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g., 'I want a basic lecture on Rotational Dynamics in Hindi' or 'Desmos hacks for SAT'"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg bg-white border border-[#D5CFBE] focus:border-[#283826] focus:outline-hidden text-[#1A2219]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={searching}
                    className="px-4 py-2.5 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold shrink-0 transition-colors"
                  >
                    {searching ? "Matching..." : "Find Matches"}
                  </button>
                </div>
              </form>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                <span className="text-[#6C7D64]">Quick Topics:</span>
                {[
                  "Work-Energy Theorem",
                  "Rotational Dynamics",
                  "Mendelian Dihybrid",
                  "SAT Parabolas",
                  "GRE Probability"
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setUserQuery(preset);
                      const q = preset.toLowerCase();
                      const results = VIDEO_CURRICULUM.filter(
                        (v) =>
                          v.chapterName.toLowerCase().includes(q) ||
                          v.title.toLowerCase().includes(q)
                      );
                      setSearchMatches(results);
                    }}
                    className="px-2 py-0.5 rounded bg-[#EFECE3] hover:bg-[#E5E0D2] text-[#283826] border border-[#D5CFBE] cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Matched Results List */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold uppercase text-[#556052] block">
                  Top Recommended Video Lectures ({searchMatches.length > 0 ? searchMatches.length : recommendations.length}):
                </span>

                {(searchMatches.length > 0 ? searchMatches : recommendations).map((vid) => (
                  <div
                    key={vid.id}
                    className="p-4 rounded-xl bg-white border border-[#D5CFBE] hover:border-[#283826] transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#283826] text-[#F7F5F0] font-bold">
                          {vid.language}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#B07D4F] text-white font-bold">
                          {vid.exam}
                        </span>
                        <span className="text-[#6C7D64]">
                          {vid.subject} • {vid.chapterName}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-[#1A2219] group-hover:text-[#283826] transition-colors">
                        {vid.title}
                      </h4>

                      <p className="text-xs text-[#556052] font-sans line-clamp-1">
                        {vid.description}
                      </p>

                      <div className="text-[11px] font-mono text-[#6C7D64]">
                        Educator: <strong>{vid.instructor}</strong> ({vid.channelName}) • Level: <strong>{vid.level}</strong>
                      </div>
                    </div>

                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3 h-3 ml-1 text-[#D5CFBE]" />
                    </a>
                  </div>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#ECE7DC] border-t border-[#D5CFBE] flex items-center justify-between text-xs">
              <span className="text-[#6C7D64] font-mono text-[11px]">
                Curated Free High-Yield Educational Resources
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 rounded bg-white hover:bg-neutral-100 text-[#1A2219] font-medium border border-[#D5CFBE] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
