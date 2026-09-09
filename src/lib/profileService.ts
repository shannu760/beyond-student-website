import fs from "fs";
import path from "path";
import { supabase } from "./supabase";

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  githubUsername?: string;
  authProvider?: "github" | "google" | "custom";
  classLevel: string;
  targetExam: string;
  streakDays: number;
  starsBalance: number;
  totalFocusMins: number;
  explanationsSubmitted: number;
  lastActive: string;
  membershipTier?: "FREE" | "PREMIUM" | "GOLD";
  membershipExpiresAt?: string;
}

export interface TopicExplanation {
  id: string;
  studentId: string;
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
  isVerified: boolean;
  upvotes: number;
  createdAt: string;
}

export interface QuestionAttempt {
  id: string;
  studentId: string;
  subject: string;
  topic: string;
  isPYQ: boolean;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string;
}

export interface FocusSession {
  id: string;
  studentId: string;
  durationMinutes: number;
  goal: string;
  timestamp: string;
}

export interface DailyReport {
  id: string;
  studentId: string;
  date: string;
  totalMCQs: number;
  totalPYQs: number;
  totalQuestions: number;
  correctCount: number;
  accuracyPercentage: number;
  totalFocusMinutes: number;
  starsEarnedToday: number;
  masteredTopics: string[];
  reviewNeededTopics: string[];
  notificationRead: boolean;
  generatedAt: string;
}

export interface StudentActivityState {
  attempts: QuestionAttempt[];
  focusSessions: FocusSession[];
  dailyReports: DailyReport[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const PROFILE_FILE = path.join(DATA_DIR, "student_profile.json");
const EXPLANATIONS_FILE = path.join(DATA_DIR, "topic_explanations.json");
const ACTIVITY_FILE = path.join(DATA_DIR, "student_activity.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const DEFAULT_PROFILE: StudentProfile = {
  id: "student-krishna-addanki-2026",
  fullName: "Krishna Addanki",
  email: "krishna.addanki633@gmail.com",
  avatarUrl: "/images/default-avatar.svg",
  githubUsername: "shannu760",
  authProvider: "github",
  classLevel: "Class 12",
  targetExam: "JEE Main & Advanced 2027",
  streakDays: 1,
  starsBalance: 642,
  totalFocusMins: 25,
  explanationsSubmitted: 0,
  lastActive: new Date().toISOString(),
  membershipTier: "GOLD",
};

const INITIAL_EXPLANATIONS: TopicExplanation[] = [
  {
    id: "exp-1",
    studentId: "student-arjun-kumar-2026",
    studentName: "Arjun Kumar",
    subject: "Physics",
    topicTitle: "Moment of Inertia of a Non-Uniform Rod",
    explanationText: "To find I about one end when linear density λ = k*x: integrate dI = dm * x^2 = (λ dx) * x^2 = k * x^3 dx from 0 to L. This yields I = (k * L^4) / 4. Since total mass M = ∫ λ dx = (k * L^2)/2, we get k = 2M / L^2. Substituting gives I = (1/2) * M * L^2.",
    fileAttachment: {
      name: "Non_Uniform_Rod_Integration_Proof.pdf",
      size: 1420000,
      url: "#",
      type: "application/pdf",
    },
    starsEarned: 75,
    isVerified: true,
    upvotes: 34,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "exp-2",
    studentId: "student-priya-sharma",
    studentName: "Priya Sharma",
    subject: "Mathematics",
    topicTitle: "Leibniz Rule for Differentiation Under Integral Sign",
    explanationText: "When differentiating I(x) = ∫_{u(x)}^{v(x)} f(x, t) dt with respect to x: dI/dx = f(x, v(x))*v'(x) - f(x, u(x))*u'(x) + ∫_{u(x)}^{v(x)} ∂f/∂x(x, t) dt. Always remember to multiply by the chain rule derivatives of the upper and lower limits!",
    fileAttachment: {
      name: "Leibniz_Integral_Rule_Handwritten_Derivation.png",
      size: 3200000,
      url: "#",
      type: "image/png",
    },
    starsEarned: 85,
    isVerified: true,
    upvotes: 52,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// Activity State Store
function getActivityState(): StudentActivityState {
  ensureDataDir();
  if (!fs.existsSync(ACTIVITY_FILE)) {
    const initialState: StudentActivityState = {
      attempts: [],
      focusSessions: [],
      dailyReports: []
    };
    fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(initialState, null, 2), "utf8");
    return initialState;
  }

  try {
    const data = fs.readFileSync(ACTIVITY_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return { attempts: [], focusSessions: [], dailyReports: [] };
  }
}

function saveActivityState(state: StudentActivityState) {
  ensureDataDir();
  fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(state, null, 2), "utf8");
}

export async function getPreservedProfile(): Promise<StudentProfile> {
  ensureDataDir();

  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", DEFAULT_PROFILE.email)
      .single();

    if (data && !error) {
      return {
        ...DEFAULT_PROFILE,
        fullName: data.full_name || DEFAULT_PROFILE.fullName,
        starsBalance: data.stars_balance ?? DEFAULT_PROFILE.starsBalance,
        streakDays: data.streak_days ?? DEFAULT_PROFILE.streakDays,
      };
    }
  } catch {
    // Fallback
  }

  if (!fs.existsSync(PROFILE_FILE)) {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(DEFAULT_PROFILE, null, 2), "utf8");
    return DEFAULT_PROFILE;
  }

  try {
    const fileData = fs.readFileSync(PROFILE_FILE, "utf8");
    return JSON.parse(fileData);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function updatePreservedProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
  ensureDataDir();
  const current = await getPreservedProfile();
  const updated: StudentProfile = {
    ...current,
    ...updates,
    lastActive: new Date().toISOString(),
  };

  fs.writeFileSync(PROFILE_FILE, JSON.stringify(updated, null, 2), "utf8");

  try {
    await supabase.from("profiles").upsert({
      email: updated.email,
      full_name: updated.fullName,
      class_level: updated.classLevel,
      target_exam: updated.targetExam,
      streak_days: updated.streakDays,
      stars_balance: updated.starsBalance,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // Fallback
  }

  return updated;
}

export async function getTopicExplanations(): Promise<TopicExplanation[]> {
  ensureDataDir();

  if (!fs.existsSync(EXPLANATIONS_FILE)) {
    fs.writeFileSync(EXPLANATIONS_FILE, JSON.stringify(INITIAL_EXPLANATIONS, null, 2), "utf8");
    return INITIAL_EXPLANATIONS;
  }

  try {
    const data = fs.readFileSync(EXPLANATIONS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return INITIAL_EXPLANATIONS;
  }
}

export async function submitTopicExplanation(
  data: Omit<TopicExplanation, "id" | "isVerified" | "upvotes" | "createdAt" | "starsEarned">
): Promise<{ explanation: TopicExplanation; updatedProfile: StudentProfile }> {
  ensureDataDir();

  let stars = 50;
  if (data.fileAttachment) stars += 25;
  if (data.explanationText.length > 250) stars += 25;

  const newExplanation: TopicExplanation = {
    ...data,
    id: "exp-" + Date.now(),
    starsEarned: stars,
    isVerified: true,
    upvotes: 1,
    createdAt: new Date().toISOString(),
  };

  const all = await getTopicExplanations();
  const updatedList = [newExplanation, ...all];
  fs.writeFileSync(EXPLANATIONS_FILE, JSON.stringify(updatedList, null, 2), "utf8");

  const profile = await getPreservedProfile();
  const updatedProfile = await updatePreservedProfile({
    starsBalance: profile.starsBalance + stars,
    explanationsSubmitted: profile.explanationsSubmitted + 1,
  });

  return { explanation: newExplanation, updatedProfile };
}

// ----------------------------------------------------------------------
// ZERO-BASE TRACKING: MCQs, PYQs, AND STAY-FOCUSED SESSIONS
// ----------------------------------------------------------------------

export async function recordQuestionAttempt(data: {
  subject: string;
  topic: string;
  isPYQ: boolean;
  isCorrect: boolean;
  timeSpentSeconds: number;
}): Promise<{ attempt: QuestionAttempt; starsEarned: number; updatedProfile: StudentProfile }> {
  const state = getActivityState();
  const profile = await getPreservedProfile();

  const starsEarned = data.isCorrect ? (data.isPYQ ? 20 : 10) : 2;

  const attempt: QuestionAttempt = {
    id: "att-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    studentId: profile.id,
    subject: data.subject,
    topic: data.topic,
    isPYQ: data.isPYQ,
    isCorrect: data.isCorrect,
    timeSpentSeconds: data.timeSpentSeconds,
    timestamp: new Date().toISOString(),
  };

  state.attempts.unshift(attempt);
  saveActivityState(state);

  const updatedProfile = await updatePreservedProfile({
    starsBalance: profile.starsBalance + starsEarned,
  });

  return { attempt, starsEarned, updatedProfile };
}

export async function recordFocusSession(data: {
  durationMinutes: number;
  goal: string;
}): Promise<{ session: FocusSession; starsEarned: number; updatedProfile: StudentProfile }> {
  const state = getActivityState();
  const profile = await getPreservedProfile();

  // 1 Star per minute focused, bonus 25 stars for 25+ min session
  const starsEarned = data.durationMinutes + (data.durationMinutes >= 25 ? 25 : 0);

  const session: FocusSession = {
    id: "foc-" + Date.now(),
    studentId: profile.id,
    durationMinutes: data.durationMinutes,
    goal: data.goal,
    timestamp: new Date().toISOString(),
  };

  state.focusSessions.unshift(session);
  saveActivityState(state);

  const updatedProfile = await updatePreservedProfile({
    starsBalance: profile.starsBalance + starsEarned,
    totalFocusMins: profile.totalFocusMins + data.durationMinutes,
  });

  return { session, starsEarned, updatedProfile };
}

export async function getTodayActivity(): Promise<{
  totalMCQs: number;
  totalPYQs: number;
  correctCount: number;
  accuracyPercentage: number;
  totalFocusMinutes: number;
  todayAttempts: QuestionAttempt[];
  todayFocusSessions: FocusSession[];
}> {
  const state = getActivityState();
  const todayStr = new Date().toISOString().slice(0, 10);

  const todayAttempts = state.attempts.filter((a) => a.timestamp.startsWith(todayStr));
  const todayFocusSessions = state.focusSessions.filter((s) => s.timestamp.startsWith(todayStr));

  const totalMCQs = todayAttempts.filter((a) => !a.isPYQ).length;
  const totalPYQs = todayAttempts.filter((a) => a.isPYQ).length;
  const correctCount = todayAttempts.filter((a) => a.isCorrect).length;
  const totalQuestions = todayAttempts.length;

  const accuracyPercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const totalFocusMinutes = todayFocusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return {
    totalMCQs,
    totalPYQs,
    correctCount,
    accuracyPercentage,
    totalFocusMinutes,
    todayAttempts,
    todayFocusSessions,
  };
}

// ----------------------------------------------------------------------
// END-OF-DAY REPORT AND NOTIFICATION ENGINE
// ----------------------------------------------------------------------

export async function generateDailyReport(): Promise<DailyReport> {
  const state = getActivityState();
  const profile = await getPreservedProfile();
  const todayActivity = await getTodayActivity();

  const todayStr = new Date().toISOString().slice(0, 10);

  // Derive mastered topics and review needed
  const correctTopics = new Set(
    todayActivity.todayAttempts.filter((a) => a.isCorrect).map((a) => a.topic)
  );
  const incorrectTopics = new Set(
    todayActivity.todayAttempts.filter((a) => !a.isCorrect).map((a) => a.topic)
  );

  const masteredTopics = Array.from(correctTopics).slice(0, 5);
  const reviewNeededTopics = Array.from(incorrectTopics).slice(0, 5);

  const starsEarnedToday =
    todayActivity.correctCount * 15 +
    (todayActivity.totalPYQs * 5) +
    todayActivity.totalFocusMinutes;

  const report: DailyReport = {
    id: "rep-" + todayStr,
    studentId: profile.id,
    date: todayStr,
    totalMCQs: todayActivity.totalMCQs,
    totalPYQs: todayActivity.totalPYQs,
    totalQuestions: todayActivity.totalMCQs + todayActivity.totalPYQs,
    correctCount: todayActivity.correctCount,
    accuracyPercentage: todayActivity.accuracyPercentage,
    totalFocusMinutes: todayActivity.totalFocusMinutes,
    starsEarnedToday,
    masteredTopics: masteredTopics.length > 0 ? masteredTopics : ["Work-Energy Theorem", "Calculus Limits"],
    reviewNeededTopics: reviewNeededTopics.length > 0 ? reviewNeededTopics : ["Rotational Dynamics Friction"],
    notificationRead: false,
    generatedAt: new Date().toISOString(),
  };

  // Upsert today's report
  state.dailyReports = [report, ...state.dailyReports.filter((r) => r.date !== todayStr)];
  saveActivityState(state);

  return report;
}

export async function getLatestDailyReport(): Promise<{ report: DailyReport | null; hasUnreadNotification: boolean }> {
  const state = getActivityState();
  const todayStr = new Date().toISOString().slice(0, 10);
  
  let report = state.dailyReports.find((r) => r.date === todayStr) || null;
  if (!report && (state.attempts.length > 0 || state.focusSessions.length > 0)) {
    report = await generateDailyReport();
  }

  const hasUnreadNotification = report ? !report.notificationRead : false;
  return { report, hasUnreadNotification };
}

export async function markDailyReportAsRead(): Promise<void> {
  const state = getActivityState();
  state.dailyReports.forEach((r) => (r.notificationRead = true));
  saveActivityState(state);
}

export async function resetStudentRecordsToZero(): Promise<StudentProfile> {
  ensureDataDir();
  const cleanState: StudentActivityState = {
    attempts: [],
    focusSessions: [],
    dailyReports: []
  };
  saveActivityState(cleanState);

  const cleanProfile = await updatePreservedProfile({
    streakDays: 1,
    starsBalance: 0,
    totalFocusMins: 0,
    explanationsSubmitted: 0,
  });

  return cleanProfile;
}
