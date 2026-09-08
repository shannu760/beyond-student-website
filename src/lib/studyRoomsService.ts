import fs from "fs";
import path from "path";

export interface StudyRoomTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface StudyRoom {
  id: string;
  title: string;
  topic: string;
  subject: string;
  exam: string;
  category: "JEE" | "NEET" | "SAT" | "GRE" | "FOUNDATION" | "SOLO";
  activeCount: number;
  maxCount: number;
  durationMinutes: number;
  goal: string;
  hostName: string;
  hostAvatar?: string;
  ambience: "silence" | "rain" | "binaural" | "lofi" | "cafe";
  theme: "forest" | "midnight" | "amber" | "indigo";
  isPrivate: boolean;
  tasks: StudyRoomTask[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ROOMS_FILE = path.join(DATA_DIR, "study_rooms.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export const DEFAULT_ROOMS: StudyRoom[] = [
  {
    id: "room-jee-phys-01",
    title: "⚡ JEE Physics Sprint #04",
    topic: "Kinematics, Projectile Motion & Constraint Relations",
    subject: "Physics",
    exam: "JEE Main 2027",
    category: "JEE",
    activeCount: 8,
    maxCount: 12,
    durationMinutes: 45,
    goal: "Solve 15 NTA Previous Year Questions with full working notes",
    hostName: "Rahul V.",
    hostAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    ambience: "silence",
    theme: "forest",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Solve 2024 Shift-1 Kinematics 5 PYQs", completed: true },
      { id: "t2", text: "Derive Relative Velocity in 2D formula", completed: false },
      { id: "t3", text: "Check mistake log for friction constraints", completed: false }
    ],
    notes: "Remember: Always resolve components along and perpendicular to the inclined plane!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-neet-chem-02",
    title: "🧪 Organic Chem Deep Work",
    topic: "Electrophilic Substitution & Reaction Mechanisms",
    subject: "Chemistry",
    exam: "JEE / NEET",
    category: "NEET",
    activeCount: 6,
    maxCount: 10,
    durationMinutes: 60,
    goal: "Complete Chapter 7 NCERT reaction flowchart & test-bank questions",
    hostName: "Priya Sharma",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    ambience: "rain",
    theme: "amber",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Draw Friedel-Crafts Alkylation intermediate", completed: true },
      { id: "t2", text: "Summarize Markovnikov vs Anti-Markovnikov rules", completed: true },
      { id: "t3", text: "Solve 10 NEET previous 5-year questions", completed: false }
    ],
    notes: "Stability order of carbocations: 3° > 2° > 1° with hyperconjugation and inductive effect.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-jee-calc-03",
    title: "📐 Calculus Limits Problem Pod",
    topic: "Limits, Continuity & L'Hôpital's Rule Forms",
    subject: "Mathematics",
    exam: "JEE Advanced",
    category: "JEE",
    activeCount: 5,
    maxCount: 8,
    durationMinutes: 30,
    goal: "Complete 8 indeterminate forms from Irodov & Advanced Papers",
    hostName: "Aman Kumar",
    hostAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    ambience: "binaural",
    theme: "midnight",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Expand 1^infinity standard limit proofs", completed: true },
      { id: "t2", text: "Taylor Series expansions up to x^4", completed: false }
    ],
    notes: "Check for differentiability at boundary points before applying L'Hôpital!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-sat-math-04",
    title: "🎯 SAT Digital Math Hard Module",
    topic: "Advanced Algebra, Non-Linear Functions & Circles",
    subject: "Quantitative",
    exam: "SAT Digital",
    category: "SAT",
    activeCount: 7,
    maxCount: 10,
    durationMinutes: 35,
    goal: "Drill 22 questions with Desmos graphing calculator optimization",
    hostName: "Sneha Patel",
    hostAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    ambience: "lofi",
    theme: "indigo",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Circle equation completing the square drills", completed: true },
      { id: "t2", text: "Quadratic vertex form & discriminant speed check", completed: false }
    ],
    notes: "Always enter equations into Desmos first to visually verify intercepts and intersections!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-neet-bio-05",
    title: "🧬 NEET Biology NCERT Mastery",
    topic: "Genetics, DNA Replication & Mendelian Ratios",
    subject: "Biology",
    exam: "NEET-UG 2027",
    category: "NEET",
    activeCount: 11,
    maxCount: 15,
    durationMinutes: 45,
    goal: "Review NCERT textbook line-by-line & highlight assertion-reason pairs",
    hostName: "Dr. Ananya Roy",
    hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    ambience: "cafe",
    theme: "forest",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Cross ratios: Dihybrid 9:3:3:1 vs Test Cross 1:1:1:1", completed: true },
      { id: "t2", text: "DNA polymerase directionality (5' to 3') diagram", completed: false }
    ],
    notes: "Pay close attention to exceptions to Mendelian inheritance: Incomplete dominance & Codominance.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-gre-quant-06",
    title: "🧮 GRE Quantitative Comparison Drill",
    topic: "Number Properties, Standard Deviation & Geometry",
    subject: "Quantitative",
    exam: "GRE General",
    category: "GRE",
    activeCount: 4,
    maxCount: 8,
    durationMinutes: 40,
    goal: "Master 15 QC questions focusing on edge cases (0, negatives, fractions)",
    hostName: "Vikram Mehta",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    ambience: "silence",
    theme: "midnight",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Test ZONE F values: Zero, One, Negative, Extreme, Fraction", completed: true },
      { id: "t2", text: "Normal distribution percentages memorization", completed: false }
    ],
    notes: "Never assume variables are integers unless explicitly stated in the prompt!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-sat-rw-07",
    title: "📚 SAT Reading & Rhetorical Synthesis",
    topic: "Transitions, Cross-Text Connections & Grammar",
    subject: "Reading & Writing",
    exam: "SAT Digital",
    category: "SAT",
    activeCount: 6,
    maxCount: 10,
    durationMinutes: 25,
    goal: "Speed drill 18 questions on semicolons, dashes, and logical transitions",
    hostName: "Rohan Gupta",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    ambience: "rain",
    theme: "amber",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Practice However vs Consequently transition questions", completed: true },
      { id: "t2", text: "Identify essential vs non-essential appositives", completed: false }
    ],
    notes: "A semicolon is grammatically identical to a period—both must connect two independent clauses.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-gre-verb-08",
    title: "📖 GRE Verbal High-Frequency Vocabulary",
    topic: "Text Completion & Sentence Equivalence Nuance",
    subject: "Verbal Reasoning",
    exam: "GRE General",
    category: "GRE",
    activeCount: 5,
    maxCount: 8,
    durationMinutes: 30,
    goal: "Memorize 50 tone-shifting words & practice double-blank sentence traps",
    hostName: "Aditi Joshi",
    hostAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    ambience: "binaural",
    theme: "indigo",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Review 30 secondary word definitions (e.g. qualify, plastic)", completed: true },
      { id: "t2", text: "Complete 10 Sentence Equivalence drills", completed: false }
    ],
    notes: "Look for the sentence pivot keywords: despite, ironically, notwithstanding, belie.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-fnd-math-09",
    title: "🌱 Class 11 Foundation Mastery",
    topic: "Trigonometric Equations, Identities & Inequalities",
    subject: "Mathematics",
    exam: "Foundation / Boards",
    category: "FOUNDATION",
    activeCount: 9,
    maxCount: 15,
    durationMinutes: 45,
    goal: "Build mathematical rigor across compound angle transformations",
    hostName: "Siddharth M.",
    hostAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    ambience: "lofi",
    theme: "forest",
    isPrivate: false,
    tasks: [
      { id: "t1", text: "Derive sin(A+B) and cos(A+B) geometrically", completed: true },
      { id: "t2", text: "Solve 10 board textbook exemplar questions", completed: false }
    ],
    notes: "Always double-check quadrant signs for sin, cos, tan when angles exceed pi/2.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "room-solo-deep-10",
    title: "☕ Solo Deep Focus Marathon",
    topic: "Uninterrupted Flow State & Problem Solving Block",
    subject: "Open Subject",
    exam: "Personal Goal",
    category: "SOLO",
    activeCount: 1,
    maxCount: 1,
    durationMinutes: 90,
    goal: "Complete uninterrupted 90-minute deep work block with zero distractions",
    hostName: "Krishna Addanki",
    hostAvatar: "https://avatars.githubusercontent.com/u/101566537?v=4",
    ambience: "rain",
    theme: "midnight",
    isPrivate: true,
    tasks: [
      { id: "t1", text: "Turn off notifications & full-screen study tab", completed: true },
      { id: "t2", text: "Complete planned revision milestone", completed: false }
    ],
    notes: "Flow state takes 15 minutes of uninterrupted focus to trigger. Maintain momentum!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getStudyRooms(): StudyRoom[] {
  ensureDataDir();
  if (!fs.existsSync(ROOMS_FILE)) {
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(DEFAULT_ROOMS, null, 2), "utf8");
    return DEFAULT_ROOMS;
  }

  try {
    const data = fs.readFileSync(ROOMS_FILE, "utf8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ROOMS;
  } catch {
    return DEFAULT_ROOMS;
  }
}

export function saveStudyRooms(rooms: StudyRoom[]): void {
  ensureDataDir();
  fs.writeFileSync(ROOMS_FILE, JSON.stringify(rooms, null, 2), "utf8");
}

export function getStudyRoomById(id: string): StudyRoom | undefined {
  const rooms = getStudyRooms();
  return rooms.find((r) => r.id === id);
}

export function createStudyRoom(data: Partial<StudyRoom>): StudyRoom {
  const rooms = getStudyRooms();
  const newRoom: StudyRoom = {
    id: "room-" + Date.now(),
    title: data.title || "🎯 Custom Focused Pod",
    topic: data.topic || "Subject Problem Solving",
    subject: data.subject || "General Study",
    exam: data.exam || "JEE Main",
    category: (data.category as any) || "JEE",
    activeCount: 1,
    maxCount: data.maxCount || 10,
    durationMinutes: data.durationMinutes || 25,
    goal: data.goal || "Complete today's planned study milestone",
    hostName: data.hostName || "Krishna Addanki",
    hostAvatar: data.hostAvatar || "https://avatars.githubusercontent.com/u/101566537?v=4",
    ambience: data.ambience || "silence",
    theme: data.theme || "forest",
    isPrivate: Boolean(data.isPrivate),
    tasks: data.tasks || [
      { id: "task-1", text: "Review core formulas & theorem statements", completed: false },
      { id: "task-2", text: "Solve 10 practice problems without looking at solutions", completed: false }
    ],
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedRooms = [newRoom, ...rooms];
  saveStudyRooms(updatedRooms);
  return newRoom;
}

export function updateStudyRoom(id: string, updates: Partial<StudyRoom>): StudyRoom | null {
  const rooms = getStudyRooms();
  const index = rooms.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = rooms[index];
  const updated: StudyRoom = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  rooms[index] = updated;
  saveStudyRooms(rooms);
  return updated;
}

export function deleteStudyRoom(id: string): boolean {
  const rooms = getStudyRooms();
  const filtered = rooms.filter((r) => r.id !== id);
  if (filtered.length === rooms.length) return false;
  saveStudyRooms(filtered);
  return true;
}