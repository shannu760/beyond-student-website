import { VIDEO_CURRICULUM, VideoCurriculumItem } from "@/data/videoCurriculum";

export type RecommendationTag = 
  | "Mastery Step-Up" 
  | "Active Task Match" 
  | "Diagnostic Remediation" 
  | "Syllabus Pace-Setter" 
  | "Foundation Booster";

export interface RecommendedVideo extends VideoCurriculumItem {
  aiRationale: string;
  recommendationTag: RecommendationTag;
  matchScore: number;
  triggerReason: string;
}

export interface StudentTaskSignal {
  id: string;
  topic: string;
  subject: string;
  subtopics?: string;
  status: "completed" | "in_progress" | "planned";
  priority?: "High" | "Medium" | "Revision";
}

export interface PerformanceSignal {
  accuracyPercentage: number;
  weakTopics: string[];
  masteredTopics: string[];
  targetExam?: string;
  recentAttemptTopic?: string;
}

export interface RecommendationContext {
  tasks: StudentTaskSignal[];
  performance: PerformanceSignal;
  preferredLanguage?: string;
}

export const DEFAULT_TASKS: StudentTaskSignal[] = [
  {
    id: "block-1",
    subject: "Physics",
    topic: "Rotational Dynamics",
    subtopics: "Moment of Inertia, Theorems of Parallel & Perpendicular Axes, 8 PYQs",
    status: "completed",
    priority: "High",
  },
  {
    id: "block-2",
    subject: "Mathematics",
    topic: "Definite Integrals",
    subtopics: "Properties of Definite Integrals, Leibniz Rule, 6 Practice Problems",
    status: "in_progress",
    priority: "High",
  },
  {
    id: "block-3",
    subject: "Chemistry",
    topic: "Coordination Compounds",
    subtopics: "Crystal Field Splitting Theory, Octahedral & Tetrahedral Complexes",
    status: "planned",
    priority: "Medium",
  },
  {
    id: "block-4",
    subject: "Diagnostic Quiz",
    topic: "Electrostatics Dipole Remediation",
    subtopics: "5 Concept Correction MCQs based on error analysis from Test #03",
    status: "planned",
    priority: "Revision",
  },
];

export const DEFAULT_PERFORMANCE: PerformanceSignal = {
  accuracyPercentage: 68,
  weakTopics: ["Electrostatics Dipole", "Rotational Dynamics Friction", "Complex Numbers"],
  masteredTopics: ["Work-Energy Theorem", "Calculus Limits", "Vectors & 3D Geometry"],
  targetExam: "JEE Main & Advanced 2027",
};

/**
 * Calculates topic similarity between a candidate text and search phrase
 */
function isTopicMatch(video: VideoCurriculumItem, topicQuery: string): boolean {
  const normQuery = topicQuery.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  const queryTokens = normQuery.split(/\s+/).filter((t) => t.length > 2);

  const videoText = [
    video.title,
    video.chapterName,
    video.unitName,
    video.subject,
    video.description,
    ...video.keyTopicsCovered,
  ]
    .join(" ")
    .toLowerCase();

  return queryTokens.some((token) => videoText.includes(token));
}

/**
 * Real-time Recommendation Algorithm:
 * Evaluates live task completions and performance metrics to produce
 * a prioritized, pedagogically sound playlist of recommended videos.
 */
export function computeRealtimeRecommendations(context: RecommendationContext): RecommendedVideo[] {
  const { tasks, performance } = context;
  const results: RecommendedVideo[] = [];
  const visitedVideoIds = new Set<string>();

  // Determine active exam code (default to JEE)
  let targetExamCode: "JEE" | "NEET" | "SAT" | "GRE" = "JEE";
  if (performance.targetExam) {
    const lowerExam = performance.targetExam.toLowerCase();
    if (lowerExam.includes("neet")) targetExamCode = "NEET";
    else if (lowerExam.includes("sat")) targetExamCode = "SAT";
    else if (lowerExam.includes("gre")) targetExamCode = "GRE";
  }

  // 1. SIGNAL: Recently Completed Task -> Trigger Mastery Step-Up
  // When a student completes a foundation task, recommend an Advanced Elite Problem-Solving lecture
  const completedTask = tasks.find((t) => t.status === "completed");
  if (completedTask) {
    const match = VIDEO_CURRICULUM.find(
      (v) =>
        !visitedVideoIds.has(v.id) &&
        isTopicMatch(v, completedTask.topic) &&
        (v.level === "Advanced Elite Mastery" || v.resourceType === "Advanced Illustration")
    ) || VIDEO_CURRICULUM.find(
      (v) => !visitedVideoIds.has(v.id) && isTopicMatch(v, completedTask.topic)
    );

    if (match) {
      visitedVideoIds.add(match.id);
      results.push({
        ...match,
        recommendationTag: "Mastery Step-Up",
        matchScore: 98,
        triggerReason: `Completed schedule block: "${completedTask.topic}"`,
        aiRationale: `⚡ You completed your foundation block for ${completedTask.topic}. AI has elevated your curriculum to Elite Problem Solving with ${match.instructor}'s advanced illustrations on ${match.chapterName}.`,
      });
    }
  }

  // 2. SIGNAL: In-Progress or Highest Planned Study Task -> Active Task Match
  const activeTask = tasks.find((t) => t.status === "in_progress") || tasks.find((t) => t.status === "planned" && t.priority === "High");
  if (activeTask) {
    const match = VIDEO_CURRICULUM.find(
      (v) =>
        !visitedVideoIds.has(v.id) &&
        isTopicMatch(v, activeTask.topic) &&
        (v.resourceType === "One-Shot Revision" || v.level === "Intermediate Problem Solving")
    ) || VIDEO_CURRICULUM.find(
      (v) => !visitedVideoIds.has(v.id) && isTopicMatch(v, activeTask.topic)
    );

    if (match) {
      visitedVideoIds.add(match.id);
      results.push({
        ...match,
        recommendationTag: "Active Task Match",
        matchScore: 95,
        triggerReason: `In-progress study task: "${activeTask.topic}"`,
        aiRationale: `🎯 Synchronized to your live planner for ${activeTask.topic}. Watch this focused ${match.duration} lecture by ${match.instructor} to master critical theorem properties and shortcuts.`,
      });
    }
  }

  // 3. SIGNAL: Diagnostic Weakness or Review-Needed Topic -> Diagnostic Remediation
  // When diagnostic errors are detected (e.g. accuracy < 60%), surface first-principles lectures
  const weakTopic = performance.weakTopics[0] || "Electrostatics";
  if (weakTopic) {
    const match = VIDEO_CURRICULUM.find(
      (v) =>
        !visitedVideoIds.has(v.id) &&
        isTopicMatch(v, weakTopic) &&
        (v.level === "Basic Foundation" || v.resourceType === "Open Courseware")
    ) || VIDEO_CURRICULUM.find(
      (v) => !visitedVideoIds.has(v.id) && isTopicMatch(v, weakTopic)
    );

    if (match) {
      visitedVideoIds.add(match.id);
      results.push({
        ...match,
        recommendationTag: "Diagnostic Remediation",
        matchScore: 92,
        triggerReason: `Diagnostic error flag: "${weakTopic}"`,
        aiRationale: `⚠️ Diagnostic Error Remediation: Recent error patterns indicate need for deeper conceptual grounding in ${weakTopic}. This ${match.resourceType} will solidify your fundamentals before tomorrow's quiz.`,
      });
    }
  }

  // 4. SIGNAL: Secondary Planned Task or Next Syllabus Unit -> Syllabus Pace-Setter
  const secondaryTask = tasks.find(
    (t) => t.status === "planned" && !visitedVideoIds.has(t.id) && t.topic !== activeTask?.topic
  );
  if (secondaryTask) {
    const match = VIDEO_CURRICULUM.find(
      (v) => !visitedVideoIds.has(v.id) && isTopicMatch(v, secondaryTask.topic)
    );

    if (match) {
      visitedVideoIds.add(match.id);
      results.push({
        ...match,
        recommendationTag: "Syllabus Pace-Setter",
        matchScore: 88,
        triggerReason: `Next queued schedule block: "${secondaryTask.topic}"`,
        aiRationale: `📅 Queued for your upcoming study block in ${secondaryTask.subject}: ${match.title} will prepare you ahead of problem drills.`,
      });
    }
  }

  // 5. Fallback Fillers to guarantee at least 3 high-yield recommendations
  if (results.length < 3) {
    const examVideos = VIDEO_CURRICULUM.filter(
      (v) => !visitedVideoIds.has(v.id) && v.exam === targetExamCode
    );

    for (const video of examVideos) {
      if (results.length >= 3) break;
      visitedVideoIds.add(video.id);
      results.push({
        ...video,
        recommendationTag: "Foundation Booster",
        matchScore: 84,
        triggerReason: `High-yield syllabus topic for ${targetExamCode}`,
        aiRationale: `⭐ Curated high-yield lecture for your target syllabus (${targetExamCode} ${video.subject}). Recommended to reinforce your speed and conceptual retention.`,
      });
    }
  }

  return results;
}
