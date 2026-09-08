import React from "react";
import { AcademicHeader } from "@/components/academic/AcademicHeader";
import { MonographHero } from "@/components/academic/MonographHero";
import { SyllabusAndNTATracker } from "@/components/academic/SyllabusAndNTATracker";
import { CuratedVideosSection } from "@/components/academic/CuratedVideosSection";
import { PYQGatewayCard } from "@/components/academic/PYQGatewayCard";
import { DailyFocusSchedule } from "@/components/academic/DailyFocusSchedule";
import { QuietStudyHallCard } from "@/components/academic/QuietStudyHallCard";
import { TopicMasteryLedger } from "@/components/academic/TopicMasteryLedger";
import { TopicExplanationUpload } from "@/components/academic/TopicExplanationUpload";
import { StudentAmenitiesSection } from "@/components/academic/StudentAmenitiesSection";
import { DiagnosticPathwaySimulator } from "@/components/academic/DiagnosticPathwaySimulator";
import { ScholarshipOpportunityRadar } from "@/components/academic/ScholarshipOpportunityRadar";
import { MembershipPlansSection } from "@/components/academic/MembershipPlansSection";
import { AIVideoRecommendationPopup } from "@/components/academic/AIVideoRecommendationPopup";
import { AcademicFooter } from "@/components/academic/AcademicFooter";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#F7F5F0] paper-texture text-[#1A2219] overflow-x-hidden selection:bg-[#283826] selection:text-[#F7F5F0]">
      {/* Top Editorial Monograph Navigation with Google Auth & Daily Report Notification Bell */}
      <AcademicHeader />

      {/* Main Academic Growth Network Experience with Silky Smooth Scroll Reveals */}
      <main className="relative z-10 space-y-2">
        <MonographHero />
        
        {/* Real-Time NTA Tracking & SAT/GRE Syllabus Matrix */}
        <div className="scroll-reveal">
          <SyllabusAndNTATracker />
        </div>

        {/* Dedicated PYQ Archive & Nemotron Ultra Solver Gateway */}
        <div className="scroll-reveal-scale">
          <PYQGatewayCard />
        </div>

        {/* Multilingual Curated Videos (English, Hindi, Telugu) */}
        <div className="scroll-reveal">
          <CuratedVideosSection />
        </div>

        {/* Daily Focus Schedule Planner */}
        <div className="scroll-reveal">
          <DailyFocusSchedule />
        </div>

        {/* Comprehensive Student Amenities & Problem Solving Hub */}
        <div className="scroll-reveal">
          <StudentAmenitiesSection />
        </div>

        {/* Quiet Study Rooms with Live Stay-Focused Pomodoro Ledger */}
        <div className="scroll-reveal-scale">
          <QuietStudyHallCard />
        </div>

        {/* Topic Mastery Ledger */}
        <div className="scroll-reveal">
          <TopicMasteryLedger />
        </div>

        {/* Explain a Topic & Earn Stars (10 MB upload + Supabase preservation) */}
        <div className="scroll-reveal">
          <TopicExplanationUpload />
        </div>

        {/* Diagnostic Pathway Engine */}
        <div className="scroll-reveal-scale">
          <DiagnosticPathwaySimulator />
        </div>

        {/* Official Scholarships Radar */}
        <div className="scroll-reveal">
          <ScholarshipOpportunityRadar />
        </div>

        {/* Official BEYOND Guild Membership Plans (Premium ₹499 / Gold ₹699 for 3 months) */}
        <div id="memberships" className="scroll-reveal">
          <MembershipPlansSection />
        </div>
      </main>

      {/* Intelligent AI Video Recommendation In-App Popup */}
      <AIVideoRecommendationPopup />

      {/* Academic Citations & Official Sources Footer */}
      <AcademicFooter />
    </div>
  );
}
