# BEYOND — Complete Product, Design & Architecture Specification for Manus
### Version 2.0 • Turnkey Production Specification • September 2026

> **Purpose of this Document**: This comprehensive specification contains the entire product blueprint, visual design system, page-by-page copy, component hierarchy, database schema, and exact execution prompt so that **Manus** (or any autonomous coding agent) can build and deploy the complete **BEYOND** website from scratch with zero ambiguity.

---

## ⚡ Quick Copy-Paste Prompt for Manus

If you are feeding this into Manus as a prompt, copy and paste the box below:

```text
You are an expert full-stack developer and UI/UX designer. Build a complete, production-ready website for "BEYOND" — an Academic Growth Network and Student Operating Workspace for Class 11–12 and JEE/NEET aspirants.

CRITICAL DESIGN & AESTHETIC RULES:
1. Color Palette: Deep Forest Olive (#283826), Warm Parchment Beige (#F7F5F0), Soft Linen (#F0EDE4), Muted Sage Lichen (#6C7D64), Burnished Ochre (#B07D4F), and 1px Archival Hairlines (#E1DDD2).
2. Typography: Source Serif 4 for authoritative, literary headlines paired with Plus Jakarta Sans for crisp, clean interface body and label-caps.
3. ANTI-AI POLICY: DO NOT use AI cliches. No sparkle icons (✨), no glowing cyber/neon purple or cyan gradients, no floating robot widgets, and no buzzwords like "AI-powered magic". The site must feel like an elegant university research journal, physical monograph, and high-prestige quiet study hall.
4. Core Purpose: Answer the recurring student question: "What should I do next?"

TECH STACK:
- Next.js (App Router) + TypeScript + React
- Tailwind CSS with customized Monograph color tokens
- Lucide React icons (academic/study-focused icons: BookOpen, Compass, Users, Target, ShieldCheck, Clock)
- PostgreSQL with Prisma ORM
- Responsive for Mobile, Tablet, and Desktop

PAGES & MODULES TO BUILD:
1. Master Homepage (/):
   - Editorial Top Header with logo and navigation links.
   - Monograph Hero Spread: "Build the discipline to know where you stand, and exactly what to study next."
   - Daily Focus & Syllabus Schedule: Interactive ledger tracking study blocks (Rotational Dynamics, Integral Calculus, Coordination Chemistry).
   - Quiet Study Hall Card: Pomodoro timer (25:00 / 45:00), roster of 8 real peers with specific study goals, ambient sound selector, and "Finish Session & Take Topic Quiz" action.
   - Topic Mastery Ledger: Clean table across Physics, Chemistry, and Math with mastery statuses (Proficient, Developing, Needs Support).
   - Diagnostic Pathway Simulator: Side-by-side comparative cards (JEE Main -> B.Tech CSE vs NEET -> MBBS vs Pure Sciences B.Sc Physics) with 30-day recommended trial roadmap.
   - National Scholarship Radar: Verified AY 2026-27 schemes (Central Sector, INSPIRE SHE) with required document checklists.
   - Authoritative Footer: Official links to NTA, NSP, UGC, and minor safety policies.

2. Student Hub (/student/dashboard):
   - Left Navigation Rail (Growth Hub, Study Planner, Quiet Rooms, Diagnostic Exams, Course Explorer, Opportunities, Idea Lab, Profile).
   - Welcome Banner with current alignment (88% Strong).
   - "What Should You Study Next?" 3 recommendation cards.
   - Diagnostic alignment breakdown and subject mastery grid.

3. Quiet Study Room (/student/study/rooms):
   - Interactive Pomodoro timer with start/pause/reset.
   - Synchronous peer accountability list with individual student study goals.
   - Ambient soundscape toggles (Library Silence, Gentle Rain, Forest Breeze).
   - Distraction-free session notes scratchpad.

Refer to the full specification below for exact copy, schema, and layout details.
```

---

# 1. Executive Summary & Product Thesis

### The Product
**BEYOND** is an **Academic Growth Network and Decision Operating System**, not another generic chatbot wrapper.

### The Problem It Solves
High school and competitive exam students (especially Class 11–12 JEE & NEET aspirants) have infinite content but zero system. They constantly struggle with:
- *"Should I choose JEE, NEET, or Pure Sciences?"*
- *"What topic should I study today?"*
- *"Why am I scoring poorly, and which concept errors should I fix first?"*
- *"What does this degree actually teach?"*
- *"Which scholarships can I apply for right now?"*
- *"Who can explain this problem to me without distractions?"*
- **"What should I do next?"**

### The Solution
BEYOND bridges these questions into a single, cohesive academic workspace:
1. **Academic Guidance & Diagnostic Engine**: Evaluates aptitude, highlights evidence, and produces actionable 30-day trial roadmaps rather than rigid verdicts.
2. **Quiet Study Rooms**: Virtual silent study halls with Pomodoro timers, peer accountability goals, and immediate quiz conversion.
3. **Topic-Level Mastery Ledger**: Objective, non-gamified concept tracking that pinpoints exact weaknesses for targeted remediation.
4. **Verified Opportunity Radar**: Direct discovery of official government scholarships (National Scholarship Portal AY 2026–27) with document checklists.
5. **BEYOND Idea Lab**: Enables students to submit ideas, receive structured feedback, and build real-world portfolios.

---

# 2. Visual Design System: "BEYOND Monograph"

The aesthetic is built on **Warm Editorial Minimalism with Tactile Structured Surfaces**, drawing inspiration from antique botanical monographs, physical academic journals, and university reading rooms.

### Color Palette Tokens

| Token Name | Hex Code | Purpose & Usage |
|---|---|---|
| **Canvas Base** | `#F7F5F0` | Unbleached warm parchment paper. Eliminates eye strain during prolonged night study. |
| **Surface Container** | `#F0EDE4` | Soft linen ecru for cards, grouped ledger tables, and inset panels. |
| **Primary Ink** | `#283826` | Deep Forest Olive. Used for authoritative serif headlines, primary buttons, and navigation. |
| **Secondary Accent** | `#6C7D64` | Muted Sage & Lichen. Used for chapter tags, progress rings, and syllabus ticks. |
| **Tertiary Accent** | `#B07D4F` | Burnished Ochre / Amber. Used for milestone achievements, scholarship deadlines, and certificate seals. |
| **Hairline Dividers** | `#E1DDD2` | 1px archival rules providing crisp, subtle containment without visual noise. |
| **High-Contrast Text** | `#1A2219` | Near-black botanical ink for maximum reading legibility. |
| **Muted Body Text** | `#556052` | Soft charcoal-sage for descriptions, timestamps, and secondary metadata. |

### Strict Anti-AI Styling Directives
- **NO AI Buzzwords**: Never use "AI-Powered", "Autonomous Agent Ecosystem", "Magic AI Tutor", or "Next-Gen Chatbot".
- **NO Sparkle Clichés**: Absolutely no sparkle icons (`✨`), glowing magic wands, or robot avatars.
- **NO Neon/Cyber Gradients**: No purple, magenta, or cyan neon gradients; no blurry drop-shadows or translucent frosted glass.
- **Physical Paper Metaphors**: Visuals should feel like ink printed on acid-free archival paper, framed with fine 1px borders.

### Typography Hierarchy
- **Display & Headings**: **Source Serif 4** (Weights: 600, 700). Tighter optical tracking (`-0.015em`) to evoke traditional letterpress printing.
- **Body & Interfaces**: **Plus Jakarta Sans** (Weights: 400, 500, 600). Clean, humanistic, and readable across dense syllabi.
- **Labels & Badges**: Uppercase letterspaced Plus Jakarta Sans (`font-mono text-[10px] tracking-widest font-bold`).

---

# 3. Complete Page-by-Page Specifications & Content

---

## Page 1: Flagship Homepage (`/`)

### 1.1 Header Navigation (`AcademicHeader`)
- **Left**: BEYOND brand emblem (Square `#283826` badge with white letter 'B') + "BEYOND — Student Growth Network".
- **Center Nav**:
  - `Study Planner` (scrolls to `#schedule`)
  - `Diagnostic Engine` (scrolls to `#diagnostic`)
  - `Quiet Study Rooms` (scrolls to `#study-hall`)
  - `Topic Mastery` (scrolls to `#mastery`)
  - `Scholarships` with badge `NSP 2026-27` (scrolls to `#scholarships`)
  - `Student Hub` (links to `/student/dashboard`)
- **Right Action Buttons**:
  - Secondary: `Enter Study Hall` (bg: `#F0EDE4`, border: `#E1DDD2`)
  - Primary: `Open Workspace` (bg: `#283826`, text: `#F7F5F0`)

### 1.2 Hero Section (`MonographHero`)
- **Metadata Stamp**: `ACADEMIC GROWTH NETWORK • CLASS 11–12 & COMPETITIVE EXAMS` | `Official Source Synchronized • AY 2026–27`
- **Serif Headline**:
  > *"Build the discipline to know where you stand, and exactly what to study next."*
- **Subheadline**:
  > *"BEYOND replaces generic chatbots and exam noise with a structured academic operating workspace. Connect your daily syllabus planning, topic-level diagnostics, quiet study rooms, and verified scholarship pathways in one focused environment."*
- **Action Buttons**:
  - Primary: `Explore Diagnostic Roadmap` (solid deep forest olive `#283826`, arrow icon)
  - Secondary: `Enter Quiet Study Hall` (parchment outline `#E1DDD2`, users icon)
- **Four Pillar Cards Grid**:
  1. *01. Guidance*: JEE vs NEET vs Degree diagnostics with 30-day trial roadmaps.
  2. *02. Quiet Rooms*: Silent focus sessions with Pomodoro cycles and peer accountability.
  3. *03. Mastery*: Granular topic-level accuracy tracking and targeted remediation.
  4. *04. Opportunities*: Verified NSP AY 2026–27 schemes with eligibility checklists.

### 1.3 Daily Focus & Syllabus Schedule (`DailyFocusSchedule`)
- **Header**: `Syllabus & Focus Ledger` — *"Today's Academic Study Schedule"*
- **Progress Counter**: `140 / 170 Mins Completed` • `12-Day Streak`
- **Interactive Ledger Table Columns**:
  - `Status`: Interactive circular checkbox.
  - `Subject & Topic`: E.g., Physics — Rotational Dynamics.
  - `Curriculum Subtopics`: E.g., Moment of Inertia, Parallel & Perpendicular Axes Theorems, 8 PYQs.
  - `Time Allocation`: E.g., 45m / 45m.
  - `Priority`: High (`#283826`), Medium (`#6C7D64`), Revision (`#B07D4F`).
- **Initial Study Blocks Data**:
  - Block 1: Physics • Rotational Dynamics • 45 Mins • Completed
  - Block 2: Mathematics • Definite Integrals (Leibniz Rule) • 60 Mins (35m logged) • In Progress
  - Block 3: Chemistry • Coordination Compounds (CFT Theory) • 45 Mins • Planned
  - Block 4: Diagnostic Quiz • Electrostatics Dipole Remediation • 20 Mins • Revision

### 1.4 Quiet Study Hall Card (`QuietStudyHallCard`)
- **Header Badge**: `Live Focus Sync • 128 Others Studying Globally`
- **Title**: `Quiet Study Room #04 — Physics Mechanics Sprint`
- **Left Column: Focus Timer**:
  - Toggle buttons for `25:00` and `45:00`.
  - Circular digital display showing countdown timer (`25:00`).
  - Controls: `Start Focus` (Play icon) / `Pause Session` + `Reset` button.
  - Ambient Sound Selector: `Library Silence`, `Gentle Rain`, `Forest Breeze`, `Mute`.
  - Action Button: `Finish Session & Take Topic Quiz` (Burnished Ochre `#B07D4F`).
- **Right Column: Synchronous Peer Roster & Notes**:
  - Roster of 8 real peers with specific goals:
    1. *Aarav S.* — Solving 10 Rotational Dynamics PYQs (38m in room)
    2. *Priya K.* — Revising Newton Laws of Motion & Friction (44m in room)
    3. *Ishaan M.* — Free Body Diagram Concept Mastery (22m in room)
    4. *Ananya R.* — Projectile Motion Edge-Case Problems (50m in room)
    5. *Rahul V.* — Circular Motion & Banked Curves Review (19m in room)
    6. *Meera G.* — Work-Energy Theorem & Variable Forces (31m in room)
    7. *Karan P.* — Collision Physics & Restitution (45m in room)
    8. *Sana J.* — Moment of Inertia Standard Integrals (14m in room)
  - Distraction-Free Notes Scratchpad with auto-save indicator.

### 1.5 Topic-Level Mastery Ledger (`TopicMasteryLedger`)
- **Header**: `Performance & Diagnostics` — *"Topic-Level Academic Mastery"*
- **Tabs**: `All`, `Physics`, `Mathematics`, `Chemistry`.
- **Ledger Columns**: Subject, Topic Area, Questions Tested / Accuracy %, Mastery State Pill, Recommended Action.
- **Sample Data**:
  - Physics: Kinematics (92% Accuracy • Proficient • Mentor Eligible)
  - Physics: Newton Laws of Motion (85% Accuracy • Proficient • Revision in 7 days)
  - Physics: Rotational Dynamics (62% Accuracy • Developing • Practice 5 PYQs)
  - Physics: Electrostatics Dipole (48% Accuracy • Needs Support • Take Concept Diagnostic)
  - Math: Vectors & 3D Geometry (90% Accuracy • Proficient • Maintain Accuracy)
  - Math: Limits & Continuity (74% Accuracy • Developing • Solve L'Hopital Drills)
  - Math: Complex Numbers (45% Accuracy • Needs Support • Remediation Quiz)
  - Chemistry: Atomic Structure (88% Accuracy • Proficient • Mastered)
  - Chemistry: Chemical Bonding (78% Accuracy • Developing • Hybridization Drills)
  - Chemistry: Hydrocarbon Mechanisms (52% Accuracy • Needs Support • Electrophilic Addition)
- **Pedagogical Alert**: *"Weak-topic remediation is designed for focused practice without public ranking or shame."*

### 1.6 Diagnostic Guidance & Pathway Simulator (`DiagnosticPathwaySimulator`)
- **Header**: `Decision Support Engine` — *"Academic Diagnostic & Pathway Simulator"*
- **Current Alignment Card**: `88% Engineering Alignment (JEE Main 2027)`
  - Demonstrated Evidence: Mechanics accuracy, problem-solving endurance (4.5 hrs/day).
  - Key Uncertainties: Chemistry speed pressure, theoretical abstraction vs coding.
- **Comparative Pathway Cards**:
  1. *Engineering (B.Tech CSE/ECE)*: JEE Main/Advanced • 4 Years • Discrete Math, Data Structures, Computer Architecture.
  2. *Medical Sciences (MBBS)*: NEET UG • 5.5 Years • Human Anatomy, Physiology, Clinical Rounds.
  3. *Pure Sciences (BS-MS Physics)*: IISER IAT / NEST • 5 Years • Quantum Mechanics, Electrodynamics, Research.
- **Recommended 30-Day Roadmap Timeline**:
  - Week 1: Mechanics Simulation Project
  - Week 2: Timed Chemistry Sectional Test
  - Week 3: Calculus Application & Graphing
  - Week 4: Comprehensive Milestone Re-assessment

### 1.7 National Scholarship Radar (`ScholarshipOpportunityRadar`)
- **Header**: `Verified Opportunity Radar` — *"National Scholarship Scheme Discovery"*
- **Authority Badge**: `NSP AY 2026-27 Active`
- **Schemes**:
  1. *Central Sector Scheme of Scholarship (CSSS)*: Ministry of Education • ₹12,000/yr • >80th percentile in Board exams, family income < ₹4.5L.
  2. *INSPIRE Scholarship for Higher Education (SHE)*: DST Govt. of India • ₹80,000/yr • Top 1% in Class 12 entering Basic/Natural Sciences.
  3. *AICTE Pragati Scholarship for Girls*: AICTE • ₹50,000/yr • Female technical degree students.
- **Document Checklist Panel**: Aadhaar, Class 12 Marksheet, Income Certificate, College Admission Bonafide, Bank Passbook.
- **Authenticity Disclaimer**: *"BEYOND acts strictly as a discovery radar. Never charges fees. Applications must be completed on scholarships.gov.in."*

### 1.8 Footer (`AcademicFooter`)
- Monograph Emblem + Mission Quote.
- Four link columns: Academic Modules, Student Workspaces, Official Anchors (NTA JEE, NTA NEET, NSP, UGC), Minor Safety & Privacy.
- Copyright & Standards Stamp.

---

## Page 2: Student Growth Hub (`/student/dashboard`)

- **Top Monograph Bar**: Room to switch between Study Planner, Streaks (12 Days), Stars balance (1,450 Stars), and Profile Avatar.
- **Left Sidebar**:
  - Growth Hub (`/student/dashboard`)
  - Study Planner (`/student/study/planner`)
  - Quiet Study Rooms (`/student/study/rooms`)
  - Diagnostic Exams (`/student/exams`)
  - Course Explorer (`/student/guidance/courses`)
  - Project Builder (`/student/projects`)
  - Skill Assessments (`/student/skills`)
  - Community & Peer Help (`/student/community`)
  - Idea Lab (`/student/ideas`)
  - Opportunities Radar (`/student/opportunities`)
  - Financial Literacy (`/student/financial-literacy`)
  - Academic Guidance (`/student/ai`)
  - BEYOND Student ID (`/student/profile`)
- **Hero Greeting**: *"Welcome back, Arjun."* (Class 12 • JEE Main 2027 • 88% Alignment).
- **"What Should You Study Next?" Strip**: 3 high-yield recommendation cards (Electrostatics Quiz, Calculus Derivation, Peer Problem Sprint).
- **Subject Mastery Matrix Overview & Diagnostic Breakdown**.

---

# 4. Technical Architecture: TypeScript-First Full-Stack

```text
                 BEYOND
                   │
        ┌──────────┴──────────┐
        │                     │
    FRONTEND                BACKEND
        │                     │
 TypeScript              TypeScript
 React                   Node.js
 Next.js (App Router)    Next.js API & Server Actions
 Tailwind CSS                 │
 shadcn/ui                    │
        │                     │
        └──────────┬──────────┘
                   │
              PostgreSQL
                   │
              Prisma ORM
                   │
       ┌───────────┼───────────┐
       │           │           │
     Redis      Storage       AI Provider Adapter
   (Caching)  (R2/Supabase)  (TypeScript -> Gemini/OpenAI)
```

### Key Technical Decisions
1. **Frontend**: Next.js 14 App Router with TypeScript. Server Components for marketing and data views, Client Components (`"use client"`) for interactive timers and quiz state.
2. **Styling**: Tailwind CSS with custom `monograph` color tokens and Google Fonts (`Source_Serif_4` and `Plus_Jakarta_Sans`).
3. **Database**: PostgreSQL with Prisma ORM. Models for Users, Profiles, Subjects, Topics, Mastery, Assessments, Quizzes, Study Rooms, and an immutable Stars Ledger.
4. **AI Layer**: Server-side `AIProvider` interface calling Gemini/OpenAI with strict JSON schemas. No client-side API keys.
5. **Realtime**: WebSockets or Supabase Realtime for live quiet study room participant synchronization.

---

# 5. Complete Prisma Database Schema

Save the following schema to `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  MENTOR
  ADMIN
}

enum ExamTarget {
  JEE_MAIN
  JEE_ADVANCED
  NEET_UG
  CUET
  BOARDS_ONLY
  FOUNDATION
}

enum MasteryLevel {
  NEEDS_SUPPORT
  DEVELOPING
  PROFICIENT
  STRONG
  MENTOR_ELIGIBLE
}

enum Priority {
  HIGH
  MEDIUM
  REVISION
}

enum BlockStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String
  name          String
  avatarUrl     String?
  role          Role           @default(STUDENT)
  beyondId      String         @unique // e.g. "BYND-2026-8891"
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  profile       Profile?
  studyPlans    StudyPlan[]
  attempts      AssessmentAttempt[]
  roomMembers   RoomMember[]
  starsLedger   StarsLedger[]
  ideas         Idea[]
  helpRequests  HelpRequest[]
  helpAnswers   HelpAnswer[]
}

model Profile {
  id               String      @id @default(uuid())
  userId           String      @unique
  user             User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  classGrade       Int         @default(12) // 11, 12, Dropper
  targetExam       ExamTarget  @default(JEE_MAIN)
  targetYear       Int         @default(2027)
  streakDays       Int         @default(0)
  totalFocusMins   Int         @default(0)
  stateRegion      String?
  diagnosticScore  Int         @default(0) // 0-100
  interests        String[]    @default([])
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

model Subject {
  id          String       @id @default(uuid())
  name        String       @unique // Physics, Chemistry, Mathematics, Biology
  chapters    Chapter[]
  createdAt   DateTime     @default(now())
}

model Chapter {
  id          String       @id @default(uuid())
  subjectId   String
  subject     Subject      @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  name        String       // e.g. "Rotational Dynamics"
  topics      Topic[]
  createdAt   DateTime     @default(now())
}

model Topic {
  id          String       @id @default(uuid())
  chapterId   String
  chapter     Chapter      @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  name        String       // e.g. "Moment of Inertia"
  masteries   TopicMastery[]
  questions   Question[]
  createdAt   DateTime     @default(now())
}

model TopicMastery {
  id             String        @id @default(uuid())
  userId         String
  topicId        String
  topic          Topic         @relation(fields: [topicId], references: [id], onDelete: Cascade)
  accuracy       Float         @default(0.0) // 0 - 100
  questionsTried Int           @default(0)
  level          MasteryLevel  @default(DEVELOPING)
  lastAssessedAt DateTime      @default(now())

  @@unique([userId, topicId])
}

model StudyPlan {
  id          String       @id @default(uuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  date        DateTime     @default(now())
  blocks      StudyBlock[]
  createdAt   DateTime     @default(now())
}

model StudyBlock {
  id               String       @id @default(uuid())
  studyPlanId      String
  studyPlan        StudyPlan    @relation(fields: [studyPlanId], references: [id], onDelete: Cascade)
  subjectName      String
  topicName        String
  allocatedMinutes Int          @default(45)
  completedMinutes Int          @default(0)
  status           BlockStatus  @default(PLANNED)
  priority         Priority     @default(HIGH)
  createdAt        DateTime     @default(now())
}

model StudyRoom {
  id              String       @id @default(uuid())
  name            String       // "BEYOND Quiet Study Room #04"
  topic           String       // "Physics Mechanics Sprint"
  timerMinutes    Int          @default(25)
  isLive          Boolean      @default(true)
  maxCapacity     Int          @default(12)
  members         RoomMember[]
  createdAt       DateTime     @default(now())
}

model RoomMember {
  id              String       @id @default(uuid())
  roomId          String
  room            StudyRoom    @relation(fields: [roomId], references: [id], onDelete: Cascade)
  userId          String
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  activeGoal      String       // "Solving 10 Rotational Dynamics PYQs"
  joinedAt        DateTime     @default(now())
  minutesActive   Int          @default(0)

  @@unique([roomId, userId])
}

model Assessment {
  id          String       @id @default(uuid())
  title       String       // "Electrostatics Dipole Quiz"
  subjectName String
  duration    Int          @default(15) // minutes
  questions   Question[]
  attempts    AssessmentAttempt[]
  createdAt   DateTime     @default(now())
}

model Question {
  id             String       @id @default(uuid())
  assessmentId   String?
  assessment     Assessment?  @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  topicId        String?
  topic          Topic?       @relation(fields: [topicId], references: [id])
  prompt         String
  optionsJson    String       // JSON array of options
  correctOption  Int          // 0, 1, 2, 3
  explanation    String
  difficulty     String       @default("MEDIUM")
}

model AssessmentAttempt {
  id             String       @id @default(uuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  assessmentId   String
  assessment     Assessment   @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  score          Int
  totalQuestions Int
  accuracy       Float
  completedAt    DateTime     @default(now())
}

model StarsLedger {
  id          String       @id @default(uuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  amount      Int          // positive delta
  reason      String       // "Completed Electrostatics Quiz", "12-Day Streak"
  createdAt   DateTime     @default(now())
}

model Scholarship {
  id                 String    @id @default(uuid())
  title              String
  authority          String
  supportAmount      String
  eligibilitySummary String
  officialSourceUrl  String
  academicYear       String    @default("AY 2026-27")
  documentChecklist  String[]
  deadline           DateTime?
  createdAt          DateTime  @default(now())
}

model Idea {
  id          String       @id @default(uuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  problem     String
  solution    String
  upvotes     Int          @default(0)
  createdAt   DateTime     @default(now())
}

model HelpRequest {
  id          String       @id @default(uuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  subject     String
  question    String
  answers     HelpAnswer[]
  isResolved  Boolean      @default(false)
  createdAt   DateTime     @default(now())
}

model HelpAnswer {
  id            String       @id @default(uuid())
  helpRequestId String
  helpRequest   HelpRequest  @relation(fields: [helpRequestId], references: [id], onDelete: Cascade)
  userId        String
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  content       String
  isHelpfulVote Int          @default(0)
  createdAt     DateTime     @default(now())
}
```

---

# 6. Tailwind Configuration & Font Setup

### `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        monograph: {
          canvas: "#F7F5F0",
          surface: "#F0EDE4",
          olive: "#283826",
          sage: "#6C7D64",
          ochre: "#B07D4F",
          border: "#E1DDD2",
          ink: "#1A2219",
          muted: "#556052",
        },
        olive: {
          primary: "#283826",
          deep: "#364A33",
          dark: "#1A2219",
          muted: "#6C7D64",
          accent: "#8A9A5B",
          DEFAULT: "#283826",
        },
        beige: {
          warm: "#F7F5F0",
          soft: "#F0EDE4",
          light: "#FAF8F5",
          DEFAULT: "#F7F5F0",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Source Serif 4", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

---

# 7. Step-by-Step Execution Sequence for Manus

Follow these exact steps when instructing Manus:

1. **Step 1 — Initialize Environment**:
   - Set up Next.js 14 with TypeScript, Tailwind CSS, Lucide icons.
   - Configure `Source_Serif_4` and `Plus_Jakarta_Sans` in `src/app/layout.tsx`.
   - Set base background to `#F7F5F0` and text to `#1A2219`.

2. **Step 2 — Build Design System & Components**:
   - Create `AcademicHeader.tsx` with logo, navigation links, and "Enter Study Hall" CTA.
   - Create `MonographHero.tsx` with bold serif headline and 4 academic pillar cards.
   - Create `DailyFocusSchedule.tsx` with the interactive study blocks table and streak counter.
   - Create `QuietStudyHallCard.tsx` with the 25:00/45:00 Pomodoro timer, 8 peer goals, and ambient sounds.
   - Create `TopicMasteryLedger.tsx` with subject tabs and accuracy badges.
   - Create `DiagnosticPathwaySimulator.tsx` with JEE vs NEET vs Pure Sciences comparison cards.
   - Create `ScholarshipOpportunityRadar.tsx` with Central Sector Scheme, INSPIRE, and document checklists.
   - Create `AcademicFooter.tsx` with official citations (NTA, NSP, UGC).

3. **Step 3 — Assemble Homepage (`src/app/page.tsx`)**:
   - Stack the academic components in sequential order.
   - Ensure clean vertical rhythm (margins: 48px to 64px).

4. **Step 4 — Build Student Hub (`src/app/student/`)**:
   - Implement `layout.tsx` with the olive navigation sidebar and top progress bar.
   - Implement `dashboard/page.tsx` with "What should you study next?" cards and diagnostic graphs.
   - Implement `study/rooms/page.tsx` for full-screen focus room view.

5. **Step 5 — Connect Database & API Routes**:
   - Apply the Prisma schema to PostgreSQL (`npx prisma db push` or `prisma migrate`).
   - Create API route `/api/assessments` for topic quizzes.
   - Create API route `/api/rooms` for active study room peer status.

6. **Step 6 — Verify & Test**:
   - Run `npx tsc --noEmit` to ensure zero type errors.
   - Run `npm run build` to confirm production static optimization.
   - Test responsive breakpoints across 375px (mobile), 768px (tablet), and 1280px+ (desktop).

---

*End of BEYOND Blueprint for Manus. Save this file as `BEYOND_MANUS_BLUEPRINT.md` and supply it directly to Manus.*
