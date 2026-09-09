"use client";

import React, { useState, useMemo } from "react";
import { 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Globe, 
  BookOpen, 
  Sparkles, 
  UserCheck, 
  Search,
  Filter,
  Tv,
  Layers,
  GraduationCap
} from "lucide-react";
import { VIDEO_CURRICULUM, VideoCurriculumItem } from "@/data/videoCurriculum";

export function CuratedVideosSection() {
  const [selectedLanguage, setSelectedLanguage] = useState<"ALL" | "English" | "Hindi" | "Telugu">("ALL");
  const [selectedExam, setSelectedExam] = useState<"ALL" | "JEE" | "NEET" | "SAT" | "GRE">("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = useMemo(() => {
    return VIDEO_CURRICULUM.filter((video) => {
      const matchLang = selectedLanguage === "ALL" || video.language === selectedLanguage;
      const matchExam = selectedExam === "ALL" || video.exam === selectedExam;
      const matchLevel = selectedLevel === "ALL" || video.level === selectedLevel;
      const matchSearch = 
        searchQuery.trim() === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channelName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchLang && matchExam && matchLevel && matchSearch;
    });
  }, [selectedLanguage, selectedExam, selectedLevel, searchQuery]);

  return (
    <section id="videos" className="py-10 md:py-14 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E1DDD2]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B07D4F]" />
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#B07D4F]">
                Curriculum Video Matrix • Basic to Advanced
              </span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1A2219] tracking-tight">
              Syllabus-Aligned Video Lectures & Open Courseware
            </h2>
            <p className="text-xs sm:text-sm text-[#556052] font-sans max-w-2xl leading-relaxed">
              Every chapter and unit across JEE Mains, NEET, Digital SAT, and GRE curated by mastery level—from First-Principles Foundation to Elite Advanced problem solving in English, Hindi, and Telugu.
            </p>
          </div>

          {/* AI Video Match Helper Button */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("beyond:open-ai-video-recommender"))}
            className="px-4 py-2.5 rounded-lg bg-[#283826] hover:bg-[#364A33] text-[#F7F5F0] text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B07D4F]" />
            <span>Find Perfect Video with AI</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D5CFBE] space-y-4">
          
          {/* Top Row: Exam Selector & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Exam Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono font-semibold text-[#556052] mr-1">Exam:</span>
              {(["ALL", "JEE", "NEET", "SAT", "GRE"] as const).map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setSelectedExam(ex)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    selectedExam === ex
                      ? "bg-[#283826] text-[#F7F5F0] shadow-xs"
                      : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2]"
                  }`}
                >
                  {ex === "ALL" ? "All Syllabi" : ex === "JEE" ? "JEE Mains" : ex}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#6C7D64] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chapter, unit, or educator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#FAF8F5] border border-[#D5CFBE] focus:border-[#283826] focus:outline-hidden text-[#1A2219]"
              />
            </div>
          </div>

          {/* Bottom Row: Level & Language Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#E1DDD2] text-xs font-mono">
            {/* Level Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#556052] font-semibold">Level:</span>
              {(["ALL", "Basic Foundation", "Intermediate Problem Solving", "Advanced Elite Mastery"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedLevel === lvl
                      ? "bg-[#B07D4F] text-white font-bold"
                      : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2]"
                  }`}
                >
                  {lvl === "ALL" ? "All Levels" : lvl.replace(" Problem Solving", "").replace(" Elite Mastery", "")}
                </button>
              ))}
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[#556052] font-semibold">Language:</span>
              {(["ALL", "English", "Hindi", "Telugu"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedLanguage === lang
                      ? "bg-[#283826] text-white font-bold"
                      : "bg-[#EFECE3] text-[#556052] hover:bg-[#E5E0D2]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Video Cards Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-reveal-stagger">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-[#FAF8F5] rounded-xl border border-[#E1DDD2] overflow-hidden hover:border-[#283826] transition-all shadow-2xs flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Header Area with Badges */}
                <div className="relative h-44 w-full bg-[#1A2219] overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/showcase-1.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Top Badges: Language, Exam & Resource Type */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#283826] text-[#F7F5F0] border border-[#364A33]">
                      {video.language}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#B07D4F] text-white">
                      {video.exam}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/90 text-[#283826]">
                      {video.resourceType}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{video.duration}</span>
                  </div>

                  {/* Play Button Overlay */}
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform"
                    aria-label={`Watch ${video.title} on YouTube`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/95 text-[#283826] flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <Play className="w-5 h-5 fill-[#283826] ml-0.5" />
                    </div>
                  </a>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3">
                  {/* Chapter & Unit Breadcrumb */}
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#6C7D64] truncate">
                      {video.subject} • {video.unitName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      video.level.includes("Basic") ? "bg-blue-100 text-blue-900" :
                      video.level.includes("Advanced") ? "bg-purple-100 text-purple-900" :
                      "bg-emerald-100 text-emerald-900"
                    }`}>
                      {video.level.replace(" Problem Solving", "").replace(" Elite Mastery", "")}
                    </span>
                  </div>

                  {/* Video Title */}
                  <h3 className="font-serif font-bold text-sm text-[#1A2219] group-hover:text-[#283826] transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#556052] font-sans line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  {/* Key Topics Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {video.keyTopicsCovered.slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E1DDD2] text-[#556052]">
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Instructor & Watch Link */}
              <div className="px-5 py-3 bg-[#FAF8F5] border-t border-[#E1DDD2] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#556052] font-medium truncate">
                  <UserCheck className="w-3.5 h-3.5 text-[#283826] shrink-0" />
                  <span className="truncate">{video.instructor} ({video.channelName})</span>
                </div>

                <a
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#283826] hover:text-[#B07D4F] flex items-center gap-1 transition-colors shrink-0 ml-2"
                >
                  <span>Open Video</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
