import {
  DiagnosticInput,
  DiagnosticOutput,
  QuizOutput,
  StudentChatMessage,
  StudentContext,
  StudentIdeaSubmission,
  IdeaFeasibilityAnalysis,
  ScholarshipMatchInput,
  ScholarshipMatchResult,
  StudyPlanItem
} from "./student-ai-types";

// Official knowledge reference database for accurate retrieval & grounding
export const OFFICIAL_KNOWLEDGE_SOURCES = [
  {
    name: "NTA JEE Main Official Bulletin",
    url: "https://jeemain.nta.nic.in/information-bulletin/",
    verifiedDate: "2026-08-01",
    category: "Exam Rules & Eligibility"
  },
  {
    name: "NTA NEET UG Portal",
    url: "https://neet.nta.nic.in/",
    verifiedDate: "2026-08-01",
    category: "Exam Rules & Eligibility"
  },
  {
    name: "National Scholarship Portal (NSP)",
    url: "https://scholarships.gov.in/",
    verifiedDate: "2026-08-15",
    category: "Scholarships & Schemes"
  },
  {
    name: "UGC Degree Specifications",
    url: "https://www.ugc.gov.in/",
    verifiedDate: "2026-07-20",
    category: "University Courses"
  }
];

export async function generatePathwayDiagnostic(
  input: DiagnosticInput
): Promise<DiagnosticOutput> {
  // Simulating structured AI output with deterministic fallback logic for high reliability
  const isEngineering =
    input.targetExam.includes("JEE") ||
    input.favoriteSubjects.some((s) => ["Math", "Physics", "Computer Science"].includes(s));

  return {
    alignmentStatus: isEngineering
      ? "Strong Alignment with Engineering & Technology Pathway"
      : "Strong Alignment with Medical & Biological Sciences Pathway",
    alignmentScore: isEngineering ? 88 : 84,
    coreAnalysis: `Based on your stated targets in ${input.classLevel} and strong preference for ${input.favoriteSubjects.join(", ")}, your current academic profile shows high potential for analytical problem solving. With ${input.dailyStudyHours} hours of dedicated daily study time, building concept clarity before speed practice will yield maximum score improvement.`,
    evidencePoints: [
      `High interest in ${input.favoriteSubjects.slice(0, 2).join(" & ")} correlates strongly with performance in ${input.targetExam}.`,
      `Dedication of ${input.dailyStudyHours} daily hours allows for a balanced 60/40 Split between concept learning and problem solving.`,
      `Targeting ${input.longTermGoal} provides a clear motivation anchor for 12-month consistency.`
    ],
    uncertainties: [
      "Time management under exam pressure needs diagnostic validation via chapter quizzes.",
      "Calculus & Organic Chemistry retention require weekly revision loops."
    ],
    next30DaysRoadmap: [
      {
        stepNumber: 1,
        title: "Foundation & Weak Topic Audit",
        duration: "Days 1–7",
        description: "Complete 3 diagnostic quizzes to pin-point specific micro-topic gaps.",
        keyMilestones: ["Complete Physics Diagnostic", "Complete Chemistry Diagnostic", "Log initial mastery matrix"],
        recommendedTopics: isEngineering ? ["Kinematics", "Basic Algebra"] : ["Cell Biology", "Atomic Structure"]
      },
      {
        stepNumber: 2,
        title: "Targeted Concept Remediation",
        duration: "Days 8–20",
        description: "Focus on 2 core weak topics using AI tutor interactive explanations.",
        keyMilestones: ["Solve 40 practice problems per topic", "Achieve >75% accuracy on Chapter Quizzes"],
        recommendedTopics: isEngineering ? ["Newton's Laws of Motion", "Calculus Limits"] : ["Genetics Basics", "Chemical Bonding"]
      },
      {
        stepNumber: 3,
        title: "Timed Speed & Accuracy Testing",
        duration: "Days 21–30",
        description: "Simulate test environment with full-length timed sectionals.",
        keyMilestones: ["Complete 2 Timed Chapter Mock Tests", "Review negative marking & error log"],
        recommendedTopics: ["Full Syllabus Sectional Review"]
      }
    ],
    recommendedFocusAreas: isEngineering
      ? ["Physics: Mechanics & Vectors", "Math: Functions & Calculus", "Chemistry: Physical Concepts"]
      : ["Biology: Plant & Human Physiology", "Chemistry: Organic Reactions", "Physics: Electrostatics"]
  };
}

export async function generateStudentAIResponse(
  userQuery: string,
  context: StudentContext,
  conversationHistory: StudentChatMessage[]
): Promise<StudentChatMessage> {
  const queryLower = userQuery.toLowerCase();
  
  let responseContent = "";
  let citations: StudentChatMessage["citations"] = [];
  let suggestedActions: string[] = [];

  // Query BEYOND Intelligence Layer (Hybrid BM25 + Vector RRF + Provenance Audit)
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userQuery,
          studentContext: {
            student_id: context.studentId,
            class_level: context.classLevel,
            target_exam: context.targetExam,
            weak_topics: context.weakTopics.map(t => ({ topic: t, mastery: 0.5, source: "assessment" }))
          }
        })
      });
      if (res.ok) {
        const intelResult = await res.json();
        if (intelResult.success && intelResult.evidenceSufficient && intelResult.citations?.length > 0) {
          citations = intelResult.citations.map((c: any) => ({
            sourceName: `${c.organization || c.source_name || "Official Authority"} (${c.authority_tier === "AUTHORITATIVE" ? "Tier 1: Verified" : "Tier 2"})`,
            sourceUrl: c.url,
            snippet: c.section ? `Section: ${c.section}` : "Verified against official regulatory and educational knowledge records."
          }));
        }
      }
    }
  } catch (err) {
    console.warn("Intelligence Hub query error in student-engine:", err);
  }

  if (queryLower.includes("scholarship") || queryLower.includes("financial")) {
    responseContent = `Here are the official verified scholarship schemes matching your profile (${context.classLevel}, Target: ${context.targetExam}):

1. **Central Sector Scheme of Scholarships for College and University Students (NSP)**
   - **Provider**: Ministry of Education (Government of India)
   - **Eligibility**: Top 20th percentile in Class 12 Board Exams with family income < ₹4.5 Lakh/yr.
   - **Benefit**: ₹12,000/year for undergraduate studies.
   - **Official Portal**: https://scholarships.gov.in/

2. **PM-YASASVI Post-Matric Scholarship**
   - **Provider**: Ministry of Social Justice and Empowerment
   - **Eligibility**: OBC/EBC/DNT candidates studying in Class 11-12 or UG.
   - **Official Portal**: National Scholarship Portal (NSP)

> **Advice**: Make sure your Income Certificate and Domicile Certificate are renewed for AY 2026-27 before the deadline.`;

    if (!citations || citations.length === 0) {
      citations = [
        {
          sourceName: "National Scholarship Portal (NSP AY 2026-27) [Tier 1: Authoritative]",
          sourceUrl: "https://scholarships.gov.in/",
          snippet: "Official scholarship scheme applications and One-Time Registration (OTR) guide for AY 2026-27."
        }
      ];
    }

    suggestedActions = [
      "View Matched Scholarships in Radar",
      "Check Required Document Checklist",
      "Ask AI about Application Process"
    ];
  } else if (queryLower.includes("plan") || queryLower.includes("study today") || queryLower.includes("schedule")) {
    responseContent = `Based on your goal for **${context.targetExam}** and your target weak topics (${context.weakTopics.slice(0, 2).join(", ") || "Mechanics & Organic Chemistry"}), here is your optimized study plan for today:

- ⏱️ **Block 1 (45 mins)**: Concept Review — ${context.weakTopics[0] || "Physics: Rotational Motion"}
- ⏱️ **Block 2 (60 mins)**: High-Yield Problem Solving — 25 Questions on ${context.weakTopics[0] || "Physics"}
- ☕ **Break (15 mins)**: Rest & Hydration
- ⏱️ **Block 3 (45 mins)**: Chemistry Chapter Quiz & Error Analysis
- ⏱️ **Block 4 (30 mins)**: Peer Help / Review in Study Room

Would you like me to add these tasks directly to your **BEYOND Study Planner**?`;

    suggestedActions = [
      "Add to BEYOND Study Planner",
      "Join Active Study Room Now",
      "Start 15-Min Chapter Quiz"
    ];
  } else {
    responseContent = `I understand you're asking about "${userQuery}". As your BEYOND AI Growth Assistant, I'm here to help you turn questions into concrete progress. 

Whether you need a step-by-step explanation of a difficult concept in **${context.subjects.slice(0, 2).join(" or ")}**, a targeted diagnostic for **${context.targetExam}**, or guidance on what to focus on next, I'm tuned to your exact learning context.

What specific area would you like to solve together right now?`;

    suggestedActions = [
      "Diagnose My Preparation Alignment",
      "Explain a Physics/Math Concept",
      "Help Me Fix My Weakest Topic"
    ];
  }

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: responseContent,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    citations,
    suggestedActions
  };
}

export async function generateChapterQuiz(
  subject: string,
  topic: string
): Promise<QuizOutput> {
  return {
    title: `${subject}: ${topic} Quick Diagnostic`,
    subject,
    topic,
    timeLimitMinutes: 15,
    questions: [
      {
        id: "q1",
        question: `In uniform circular motion of a particle, what is the direction of centripetal acceleration?`,
        options: [
          "Tangential to the circular path",
          "Radially inward towards the center",
          "Radially outward away from the center",
          "Zero vector"
        ],
        correctOptionIndex: 1,
        explanation: "Centripetal acceleration always points radially inward towards the center of curvature to constantly change the velocity direction.",
        subject,
        topic,
        difficulty: "Easy"
      },
      {
        id: "q2",
        question: "What is the dimensional formula of torque?",
        options: ["[M L T^-2]", "[M L^2 T^-2]", "[M^2 L T^-1]", "[M L^2 T^-1]"],
        correctOptionIndex: 1,
        explanation: "Torque = Force × perpendicular distance = [M L T^-2] × [L] = [M L^2 T^-2], which has the same dimensions as work/energy.",
        subject,
        topic,
        difficulty: "Medium"
      },
      {
        id: "q3",
        question: "A body of mass 2 kg moves along a straight line with velocity v = (3t^2 + 2) m/s. What is the net force acting on the body at t = 2 s?",
        options: ["12 N", "24 N", "14 N", "36 N"],
        correctOptionIndex: 1,
        explanation: "a = dv/dt = 6t. At t = 2s, a = 12 m/s^2. Net Force F = m × a = 2 kg × 12 m/s^2 = 24 N.",
        subject,
        topic,
        difficulty: "Hard"
      }
    ]
  };
}

export async function evaluateStudentIdea(
  submission: StudentIdeaSubmission
): Promise<IdeaFeasibilityAnalysis> {
  return {
    feasibilityScore: 86,
    clarifiedConcept: `"${submission.title}" addresses a clear student problem: ${submission.problemStatement}. The solution introduces a structured workflow targeting ${submission.targetUsers}.`,
    keyStrengths: [
      "High direct utility for peer learning & student productivity.",
      "Clear problem-solution fit identified in student community.",
      "Low initial build cost — suitable for MVP prototype."
    ],
    potentialChallenges: [
      "User adoption requires initial seed active student engagement.",
      "Moderation controls needed to maintain educational content quality."
    ],
    prototypePlan: [
      "Step 1: Create interactive wireframe UI prototype.",
      "Step 2: Test with 10 peer students for usability feedback.",
      "Step 3: Build simple Next.js frontend component.",
      "Step 4: Publish project page to your BEYOND Portfolio."
    ],
    nextExperiment: "Conduct a 5-question feedback survey with 10 classmates to validate problem urgency."
  };
}
