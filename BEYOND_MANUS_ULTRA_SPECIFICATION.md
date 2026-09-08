# BEYOND — Autonomous Master Product, UX, Amenities & Engineering Specification for Manus
### Complete Turnkey Blueprint • Version 3.0 • Production Ready • September 2026

> **AUTHORIZATION NOTICE & EXECUTION GRANT**:
> This document grants full authorization and permissions to **Manus** (and any autonomous engineering agent) to read, modify, and access the application files, environment variables, and database models to build, generate, and deploy the complete **BEYOND** Academic Growth & Student Operating System.
>
> **CRITICAL ENVIRONMENT DIRECTIVE**:
> Manus must utilize the `EMITRON_ULTRA_API_KEY` configured in the system environment (`.env` / `.env.local`) for authenticating the platform's high-efficiency intelligence engine, structured syllabus diagnostic adapters, and student assistant workflows.

---

## ⚡ Master Execution Prompt for Manus (Copy & Paste Into Manus)

```text
You are Manus, an expert autonomous software engineer, product architect, and UI/UX designer. 
You are granted full permission to access and generate the complete production-grade website and student operating ecosystem for "BEYOND".

MISSION:
Build a highly utilitarian, beautiful, professional, and distraction-free website for students (Class 11–12, JEE Main, JEE Advanced, NEET UG, and College undergraduates). Address the acute real-world challenges modern students face (burnout, exam anxiety, information overload, isolation, lack of syllabus tracking, hostel living, and financial stress) by embedding every essential student amenity directly into the platform.

AUTHENTICATION & ENVIRONMENT:
- Environment Variable: Use `EMITRON_ULTRA_API_KEY` located in the .env file attached to the workspace for all high-performance analytical routing and diagnostic evaluations.
- Database: PostgreSQL with Prisma ORM.
- Framework: Next.js 14 (App Router) + TypeScript + React 18 + Tailwind CSS.
- Icons: Lucide React (academic & utility focus: BookOpen, Compass, Users, Target, ShieldCheck, HeartPulse, Clock, PiggyBank).

DESIGN & AESTHETIC DIRECTIVES (STRICT MONOGRAPH STANDARD):
1. Color Palette:
   - Primary Ink: Deep Forest Olive (`#283826`) — Authoritative, calm, grounding.
   - Canvas Surface: Warm Unbleached Parchment Beige (`#F7F5F0`) — Zero eye fatigue during long night study.
   - Container Background: Soft Linen (`#F0EDE4`) — Tactile paper cards and grouped ledger tables.
   - Secondary Accent: Muted Sage Lichen (`#6C7D64`) — Progress rings, chapter tags, and syllabus ticks.
   - Tertiary Highlight: Burnished Ochre/Amber (`#B07D4F`) — Milestone seals, urgent deadlines, and star awards.
   - Archival Hairlines: 1px Crisp Dividers (`#E1DDD2`) — Subtle containment without noisy drop-shadows.
   - High-Contrast Typography: Near-Black Botanical Ink (`#1A2219`).
2. Typography Hierarchy:
   - Headings: Source Serif 4 (tighter letterpress kerning `-0.015em`, weights 600 & 700).
   - Body & Interface: Plus Jakarta Sans (crisp humanistic sans-serif, weights 400, 500, 600).
3. ANTI-AI CLICHÉ POLICY:
   - NO AI buzzwords ("AI-Powered Magic", "Superhuman Robot Assistant", "Next-Gen Chatbot").
   - NO AI visual tropes: No sparkle icons (✨), no glowing cyan/purple neon gradients, no floating cyber spheres.
   - The platform must look and feel like an elite university research library, prestigious monograph journal, and serious physical study hall.

KEY USER REQUIREMENT — HIGH UTILIZATION DIRECTIVE:
The website must emphasize that students should actively use this platform daily. It is not an entertainment portal or passive blog; it is an academic operating system designed to build daily study discipline, preserve mental stamina, and drive tangible academic progress.

PAGES & MODULES REQUIRED:
1. Master Homepage (`/`):
   - Monograph Navigation Header with verified official source badges.
   - Editorial Hero Spread ("Build the discipline to know where you stand, and exactly what to study next.").
   - Daily Focus & Syllabus Schedule Ledger (Interactive study blocks, elapsed focus time, checklist).
   - Crucial Student Amenities & Problem Solver Section (Mental health first-aid, PYQ vault, virtual study hall, dorm nutrition/budget, scholarship radar, degree simulator).
   - Quiet Study Room #04 (Physics Mechanics Sprint) with Pomodoro timer (25:00 / 45:00), 8-peer goal accountability list, and ambient sound selector.
   - Topic-Level Mastery Ledger (Physics, Chemistry, Math topic breakdown: Proficient, Developing, Needs Support).
   - Academic Diagnostic Pathway Simulator (JEE Main vs NEET vs Pure Sciences with 30-day recommended trial roadmap).
   - National Scholarship Radar (Verified NSP AY 2026–27 & Central Sector scheme with document preparation checklists).
   - Official Source Citations Footer (Direct links to NTA, NSP, UGC, AICTE, and student safety policies).
2. Student Hub Dashboard (`/student/dashboard`):
   - Full student navigation sidebar, today's goals, remediation cards, streak counters, and immutable stars ledger.
3. Quiet Study Rooms (`/student/study/rooms`):
   - Live focus environment with Pomodoro timer, ambient audio selector, peer goal wall, and session wrap-up quiz.
4. Wellness & Mental First-Aid (`/student/wellness`):
   - 5-Minute Exam Panic Reset (Box breathing pacer), anonymous peer empathy corner, and Tele-MANAS 24x7 SOS helpline (14416).

Proceed with autonomous execution following the detailed architecture and database schema in this document.
```

---

# 1. Exhaustive Research: Student Problems & Required Amenities

Based on current educational research across high-school competitive aspirants (JEE Main, Advanced, NEET UG) and college undergraduates, students face a multidimensional crisis that conventional edtech products fail to solve.

### The 6 Core Student Problem Pillars

#### 1. Academic Paralysis & Information Overload
- **The Issue**: Students are drowning in pirated Telegram test PDFs, multiple coaching modules, and hundreds of YouTube channels. They suffer from *analysis paralysis* — spending more time planning or searching for notes than actually studying.
- **The Emotional Toll**: Feeling perpetual guilt that "I haven't done enough" despite sitting at a desk for 10 hours.
- **The Missing Amenity**: A structured **Daily Focus Syllabus Ledger** with high-yield NTA weightage heatmaps and an objective **Topic Mastery Matrix** that tells them exactly what single topic to fix today.

#### 2. Exam Anxiety, Perfectionism & Impostor Syndrome
- **The Issue**: High-stakes exams create severe physiological and emotional panic. Negative test scores trigger downward spirals where students freeze during timed mocks.
- **The Emotional Toll**: Fear of disappointing parents, catastrophic thinking ("If I don't clear JEE/NEET, my life is ruined"), sleep paralysis, and debilitating test anxiety.
- **The Missing Amenity**: **5-Minute Exam Panic Reset Protocol** (clinically grounded box breathing, grounding exercises), an **Anonymous Peer Empathy Corner**, and 24/7 toll-free government mental health support (**Tele-MANAS 14416**).

#### 3. Isolation & Procrastination in Unsupervised Environments
- **The Issue**: Studying in a closed bedroom or cramped hostel PG leads to doom-scrolling, daydreaming, and loneliness. Video study groups (Zoom/Discord) are noisy and filled with memes/distractions.
- **The Emotional Toll**: Low motivation, time blindness, and guilt-driven procrastination.
- **The Missing Amenity**: **Silent Virtual Study Halls** with synchronized 25:00 / 45:00 Pomodoro cycles, written peer goal declarations (e.g. *"Solving 10 Rotational Dynamics PYQs"*), ambient noise-cancelling soundscapes, and immediate conversion into a 5-minute quiz.

#### 4. Physical Neglect: Sleep Deprivation & Poor Hostel Nutrition
- **The Issue**: Late-night cramming disrupts circadian REM sleep, causing brain fog during morning exam shifts (9 AM – 12 PM). Oily, low-protein hostel mess food causes digestive distress and afternoon lethargy.
- **The Emotional Toll**: Chronic fatigue, headaches, decreased memory consolidation, and burnout.
- **The Missing Amenity**: A **Circadian Rhythm Exam Sleep Planner** and a **High-Focus Dorm Nutrition Guide** (budget-friendly, focus-sustaining food pairings).

#### 5. Financial Anxiety & Opaque Opportunities
- **The Issue**: Coaching fees and living expenses drain middle-class family savings. Students miss out on legitimate government financial aid because official portals (NSP, INSPIRE) have arcane deadlines and confusing document requirements.
- **The Emotional Toll**: Financial guilt towards parents and vulnerability to scholarship scams.
- **The Missing Amenity**: A **National Scholarship Radar (AY 2026–27)** featuring verified schemes (Central Sector CSSS, INSPIRE SHE, AICTE Pragati) with step-by-step document checklists and zero-fee verification.

#### 6. Career Blindspots & Stream Confusion
- **The Issue**: Students pick careers based on peer pressure or coaching hype ("Everyone does CSE") without knowing what the curriculum entails, leading to high dropout and depression rates in 1st year college.
- **The Emotional Toll**: Disillusionment, career existential dread, and wasted preparation years.
- **The Missing Amenity**: A **Degree Reality Simulator** comparing *JEE Main → B.Tech CSE* vs *NEET → MBBS* vs *Pure Sciences BS-MS* (real 4-year subject breakdown, lab intensity, job reality, and 30-day trial projects).

---

# 2. Comprehensive Student Amenities Architecture

BEYOND embeds these amenities as core platform modules rather than cosmetic add-ons:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BEYOND AMENITIES SUITE                             │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│ 1. ACADEMIC CLARITY      │ 2. FOCUS & STUDY HALLS   │ 3. MENTAL FIRST-AID   │
│ - Syllabus Ledger        │ - 25m/45m Pomodoro Timer │ - 5-Min Panic Reset   │
│ - NTA Weightage Maps     │ - Peer Goal Accountability│ - Tele-MANAS 14416   │
│ - Topic Mastery Matrix   │ - Ambient Lo-Fi Audio    │ - Anonymous Empathy   │
│ - PYQ Diagnostic Drills  │ - Distraction-Free Notes │ - De-catastrophizing  │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│ 4. LIVING & WELLNESS     │ 5. FINANCIAL RADAR       │ 6. FUTURE & PORTFOLIO │
│ - Circadian Sleep Clock  │ - NSP AY 2026-27 Radar   │ - Degree Reality Check│
│ - Hostel Nutrition Guide │ - Central Sector (CSSS)  │ - BEYOND Idea Lab     │
│ - Monthly Budget Tracker │ - INSPIRE SHE Scheme     │ - Milestone Portfolios│
│ - Roommate Harmony Rules │ - Document Checklist     │ - 30-Day Trial Tracks │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

---

# 3. Visual Design Tokens & Styling (BEYOND Monograph)

### Color Palette Tokens

```css
:root {
  --color-canvas: #F7F5F0;       /* Unbleached warm parchment base */
  --color-surface: #F0EDE4;      /* Soft ecru linen containers */
  --color-surface-high: #FFFFFF; /* High-emphasis card interiors */
  --color-olive-primary: #283826;/* Deep Forest Olive for typography & buttons */
  --color-olive-deep: #364A33;   /* Active button hover */
  --color-sage: #6C7D64;         /* Muted sage lichen for tags & progress */
  --color-ochre: #B07D4F;        /* Burnished ochre for milestone seals & deadlines */
  --color-border: #E1DDD2;       /* 1px archival hairlines */
  --color-ink-dark: #1A2219;     /* Near-black botanical ink for headers */
  --color-ink-muted: #556052;    /* Soft charcoal-sage body text */
}
```

### Typography
- **Headlines & Expressive Titles**: `Source Serif 4` (serif, tracking `-0.015em`).
- **Body & Numerical Interface**: `Plus Jakarta Sans` (sans-serif).
- **Metadata & Tags**: `Plus Jakarta Sans` in uppercase tracking-widest (`font-mono text-[10px] font-bold`).

---

# 4. Full-Stack Technical Stack & Architecture

```text
                      BEYOND PLATFORM
                             │
            ┌────────────────┴────────────────┐
            │                                 │
     FRONTEND CLIENT                   BACKEND SERVICES
            │                                 │
  Next.js 14 (App Router)            Node.js / Server Actions
  TypeScript Strict Mode             Route Handlers (/api)
  Tailwind CSS (Monograph)           EMITRON_ULTRA_API_KEY
  Lucide Icons (Academic)                     │
            │                                 │
            └────────────────┬────────────────┘
                             │
                      PostgreSQL Database
                             │
                         Prisma ORM
                             │
            ┌────────────────┼────────────────┐
            │                │                │
       Redis Cache     Cloudflare R2     Official Feeds
      (Leaderboards)     (Documents)       (NTA, NSP)
```

### Environment Configuration (`.env` / `.env.local`)

```ini
DATABASE_URL="postgresql://postgres:password@localhost:5432/beyond_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="beyond_academic_growth_network_jwt_secret_2026"

# Intelligence Engine Adapter (Configured for Manus & System)
EMITRON_ULTRA_API_KEY="emitron_ultra_live_student_ecosystem_key_2026"

# Audio Engine
ELEVENLABS_API_KEY="sk_a9f848d284ba394db163fbc1913f0fd9d6e1bbccb83a4b9e"
```

---

# 5. Complete Production Database Schema (Prisma ORM)

Save this to `prisma/schema.prisma`:

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
  stressLogs    StressCheckIn[]
}

model Profile {
  id               String      @id @default(uuid())
  userId           String      @unique
  user             User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  classGrade       Int         @default(12)
  targetExam       ExamTarget  @default(JEE_MAIN)
  targetYear       Int         @default(2027)
  streakDays       Int         @default(0)
  totalFocusMins   Int         @default(0)
  stateRegion      String?
  diagnosticScore  Int         @default(0)
  interests        String[]    @default([])
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

model StressCheckIn {
  id               String      @id @default(uuid())
  userId           String
  user             User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  stressLevel      Int         // 1 to 5
  energyLevel      Int         // 1 to 5
  notes            String?
  usedBreathingReset Boolean   @default(false)
  createdAt        DateTime    @default(now())
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
  name        String
  topics      Topic[]
  createdAt   DateTime     @default(now())
}

model Topic {
  id          String       @id @default(uuid())
  chapterId   String
  chapter     Chapter      @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  name        String
  masteries   TopicMastery[]
  questions   Question[]
  createdAt   DateTime     @default(now())
}

model TopicMastery {
  id             String        @id @default(uuid())
  userId         String
  topicId        String
  topic          Topic         @relation(fields: [topicId], references: [id], onDelete: Cascade)
  accuracy       Float         @default(0.0)
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
  activeGoal      String
  joinedAt        DateTime     @default(now())
  minutesActive   Int          @default(0)

  @@unique([roomId, userId])
}

model Assessment {
  id          String       @id @default(uuid())
  title       String
  subjectName String
  duration    Int          @default(15)
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
  optionsJson    String
  correctOption  Int
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
  amount      Int
  reason      String
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

# 6. Detailed Page Layouts & Component Implementation

### 1. Flagship Homepage (`src/app/page.tsx`)
Stack of components:
1. `AcademicHeader.tsx` — Top editorial navigation with official source badges.
2. `MonographHero.tsx` — Positioning statement: *"Build the discipline to know where you stand, and exactly what to study next."*
3. `DailyFocusSchedule.tsx` — Interactive syllabus table with checkboxes and elapsed minutes.
4. `StudentAmenitiesSection.tsx` — Crucial student amenities categorized by mental health, academic clarity, quiet halls, hostel budgeting, and verified opportunities.
5. `QuietStudyHallCard.tsx` — 25:00/45:00 Pomodoro timer, 8 synchronous peer goals, and ambient sound selector.
6. `TopicMasteryLedger.tsx` — Subject mastery matrix (Physics, Chemistry, Math) with neutral status pills.
7. `DiagnosticPathwaySimulator.tsx` — Side-by-side comparison of Engineering, Medical, and Pure Sciences with 30-day recommended trial milestones.
8. `ScholarshipOpportunityRadar.tsx` — Official NSP AY 2026-27 schemes with required document checklists.
9. `AcademicFooter.tsx` — Official citations and safety/privacy disclosures.

### 2. Student Growth Hub (`src/app/student/dashboard/page.tsx`)
- Left navigation sidebar with profile, streaks, stars ledger, and tools.
- "What Should You Study Next?" 3 recommendation cards derived from weak topics.
- Subject Mastery matrix with targeted remediation quizzes.

### 3. Quiet Study Room (`src/app/student/study/rooms/page.tsx`)
- Focus session timer with soundscapes and goal declaration input.
- Real-time peer accountability roster.

---

# 7. Step-by-Step Autonomous Execution Order for Manus

Manus should execute the following sequence to build and verify the application:

1. **Step 1: Environment & Token Setup**:
   - Ensure `EMITRON_ULTRA_API_KEY` is read from `.env`.
   - Configure Tailwind tokens for the Monograph theme (Deep Forest Olive `#283826`, Warm Parchment `#F7F5F0`, Muted Sage `#6C7D64`, Burnished Ochre `#B07D4F`, Archival Hairlines `#E1DDD2`).
   - Configure Google Fonts: `Source_Serif_4` (variable: `--font-serif`) and `Plus_Jakarta_Sans` (variable: `--font-sans`).

2. **Step 2: Database Migration**:
   - Generate Prisma Client: `npx prisma generate`.
   - Push schema to database: `npx prisma db push`.

3. **Step 3: Component Assembly**:
   - Build `AcademicHeader.tsx`, `MonographHero.tsx`, `DailyFocusSchedule.tsx`, `StudentAmenitiesSection.tsx`, `QuietStudyHallCard.tsx`, `TopicMasteryLedger.tsx`, `DiagnosticPathwaySimulator.tsx`, `ScholarshipOpportunityRadar.tsx`, and `AcademicFooter.tsx`.
   - Assemble the master landing page in `src/app/page.tsx`.
   - Update `src/app/student/layout.tsx` and `src/app/student/dashboard/page.tsx`.

4. **Step 4: Quality & Integrity Audit**:
   - Run type checking: `npx tsc --noEmit` (Must return 0 errors).
   - Run production build: `npm run build` (Confirm all static routes compile successfully).
   - Verify responsiveness across mobile (375px), tablet (768px), and desktop (1280px+).

5. **Step 5: Launch Local Server**:
   - Start the development server: `npm run dev`.
   - Verify that the website is accessible on `http://localhost:3000`.

---

*End of BEYOND Autonomous Master Specification for Manus. This document is self-contained and serves as the single source of truth for the entire platform.*
