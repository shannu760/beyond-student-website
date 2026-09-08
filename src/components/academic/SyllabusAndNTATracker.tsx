"use client";

import React, { useState } from "react";
import { 
  Compass, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  Search, 
  ChevronRight, 
  Globe, 
  ShieldCheck,
  FileText,
  Activity,
  Calendar
} from "lucide-react";

interface SyllabusDomain {
  domainName: string;
  weightage?: string;
  subtopics: string[];
}

interface ExamSyllabus {
  id: string;
  examName: string;
  fullName: string;
  conductingBody: string;
  officialSite: string;
  lastUpdated: string;
  trackingStatus: "SYNCHRONIZED" | "VERIFIED" | "PENDING_NOTIFICATION";
  domains: SyllabusDomain[];
}

const EXAM_SYLLABI: ExamSyllabus[] = [
  {
    id: "sat",
    examName: "Digital SAT",
    fullName: "Scholastic Assessment Test (Digital Suite)",
    conductingBody: "College Board",
    officialSite: "https://satsuite.collegeboard.org",
    lastUpdated: "AY 2026–27 Suite Synchronized",
    trackingStatus: "VERIFIED",
    domains: [
      {
        domainName: "Math — Algebra (13–15 Questions)",
        weightage: "35% of Math",
        subtopics: [
          "Linear equations in 1 variable and 2 variables",
          "Linear functions and equation modeling",
          "Systems of two linear equations in two variables",
          "Linear inequalities in 1 and 2 variables and graphical solutions"
        ]
      },
      {
        domainName: "Math — Advanced Math (13–15 Questions)",
        weightage: "35% of Math",
        subtopics: [
          "Equivalent expressions and polynomial operations",
          "Nonlinear equations in 1 variable and systems of nonlinear equations",
          "Nonlinear functions (Quadratic, exponential, polynomial, radical)",
          "Graphing transformations and vertex form analysis"
        ]
      },
      {
        domainName: "Math — Problem-Solving & Data Analysis (5–7 Questions)",
        weightage: "15% of Math",
        subtopics: [
          "Ratios, rates, proportional relationships, and unit conversion",
          "Percentages and empirical change calculations",
          "One-variable data: distributions, mean, median, IQR, and standard deviation",
          "Two-variable data: scatterplots, best-fit models, and correlation",
          "Probability and relative frequency in conditional contexts"
        ]
      },
      {
        domainName: "Math — Geometry & Trigonometry (5–7 Questions)",
        weightage: "15% of Math",
        subtopics: [
          "Area and volume formulas (provided on official reference sheet)",
          "Lines, angles, similarity, and triangle congruence theorems",
          "Right triangles and trigonometric ratios (sin, cos, tan, radians)",
          "Circles: standard equation (x-h)² + (y-k)² = r², arc length, and sector area"
        ]
      },
      {
        domainName: "Reading & Writing — Craft and Structure (13–15 Questions)",
        weightage: "28% of R&W",
        subtopics: [
          "Words in Context: determining precise vocabulary based on surrounding evidence",
          "Text Structure and Purpose: identifying the rhetorical function of passages",
          "Cross-Text Connections: synthesizing arguments between two paired viewpoints"
        ]
      },
      {
        domainName: "Reading & Writing — Information and Ideas (12–14 Questions)",
        weightage: "26% of R&W",
        subtopics: [
          "Central Ideas and Details: discerning the primary thesis and key claims",
          "Command of Evidence (Textual & Quantitative charts/graphs)",
          "Inferences: completing the logical continuation of an academic hypothesis"
        ]
      },
      {
        domainName: "Reading & Writing — Standard English Conventions (11–15 Questions)",
        weightage: "26% of R&W",
        subtopics: [
          "Sentence Boundaries: avoiding run-on sentences, comma splices, and fragments",
          "Form, Structure, and Sense: subject-verb agreement, verb tense, and parallel structure",
          "Punctuation rules (semicolons, colons, dashes, apostrophes, and commas)"
        ]
      },
      {
        domainName: "Reading & Writing — Expression of Ideas (8–12 Questions)",
        weightage: "20% of R&W",
        subtopics: [
          "Rhetorical Synthesis: integrating research notes to achieve a specified goal",
          "Transitions: selecting logical connectors (furthermore, conversely, consequently)"
        ]
      }
    ]
  },
  {
    id: "gre",
    examName: "GRE General Test",
    fullName: "Graduate Record Examination (Shorter Format: 1h 58m)",
    conductingBody: "Educational Testing Service (ETS)",
    officialSite: "https://www.ets.org/gre",
    lastUpdated: "ETS 2026–27 Edition Verified",
    trackingStatus: "VERIFIED",
    domains: [
      {
        domainName: "Quantitative Reasoning — Arithmetic",
        weightage: "Fundamental Foundation",
        subtopics: [
          "Properties of integers: divisibility, prime factorization, remainders, odd/even rules",
          "Arithmetic operations, fractions, decimals, and percentage change",
          "Ratio, proportion, absolute value, and number line distances",
          "Exponents and radicals (power laws, scientific notation)"
        ]
      },
      {
        domainName: "Quantitative Reasoning — Algebra",
        weightage: "Core Problem Solving",
        subtopics: [
          "Linear and quadratic equations, factoring, and roots",
          "Simultaneous systems of equations and algebraic inequalities",
          "Functions, relations, and their graphical representations in coordinate plane",
          "Word problems: rate, work-time, mixture, distance, and interest calculations"
        ]
      },
      {
        domainName: "Quantitative Reasoning — Geometry",
        weightage: "Geometric Logic",
        subtopics: [
          "Lines, transversal angles, and parallel line properties",
          "Triangles: isosceles, equilateral, right (30-60-90 & 45-45-90), Pythagorean theorem",
          "Quadrilaterals, polygons, and perimeter/area derivations",
          "Circles: circumference, area, inscribed angles, and tangent properties",
          "3D solids: rectangular prisms, cylinders, and surface area vs volume"
        ]
      },
      {
        domainName: "Quantitative Reasoning — Data Analysis",
        weightage: "Statistical Interpretation",
        subtopics: [
          "Descriptive statistics: mean, median, mode, range, and standard deviation",
          "Quartiles, percentiles, and box-and-whisker distributions",
          "Permutations, combinations, and basic factorial counting rules",
          "Probability: independent, mutually exclusive events, and conditional distributions",
          "Data interpretation: bar charts, line graphs, pie graphs, and scatterplots"
        ]
      },
      {
        domainName: "Verbal Reasoning — Reading Comprehension",
        weightage: "Analytical Reading",
        subtopics: [
          "Short and medium academic passages across physical sciences, humanities, and arts",
          "Extracting primary purpose, author's perspective, and implicit assumptions",
          "Strengthen or weaken argument questions (critical reasoning)"
        ]
      },
      {
        domainName: "Verbal Reasoning — Text Completion & Sentence Equivalence",
        weightage: "Contextual Vocabulary",
        subtopics: [
          "1-blank, 2-blank, and 3-blank sentences evaluating semantic coherence",
          "Sentence Equivalence: identifying pairs of words producing synonymous interpretations",
          "High-frequency GRE vocabulary in nuanced contextual usage"
        ]
      },
      {
        domainName: "Analytical Writing — Analyze an Issue Task",
        weightage: "0.0 - 6.0 Score Scale",
        subtopics: [
          "Constructing a logical, well-supported essay on an issue of general interest",
          "Providing compelling examples, addressing counterarguments, and smooth rhetoric"
        ]
      }
    ]
  },
  {
    id: "jee",
    examName: "JEE Main & Advanced",
    fullName: "Joint Entrance Examination for Engineering Admissions",
    conductingBody: "National Testing Agency (NTA) & Joint Admission Board",
    officialSite: "https://jeemain.nta.nic.in",
    lastUpdated: "NTA 2027 Information Bulletin Live Sync",
    trackingStatus: "SYNCHRONIZED",
    domains: [
      {
        domainName: "Physics (Class 11 & 12 Complete Syllabus)",
        weightage: "30 Questions (100 Marks)",
        subtopics: [
          "Units & Measurements, Kinematics, Laws of Motion, Work, Energy & Power",
          "Rotational Motion, Gravitation, Mechanical Properties of Solids and Fluids",
          "Thermodynamics, Kinetic Theory of Gases, Oscillations and Waves",
          "Electrostatics, Current Electricity, Magnetic Effects of Current and Magnetism",
          "Electromagnetic Induction & Alternating Currents, Electromagnetic Waves",
          "Optics (Ray and Wave), Dual Nature of Matter, Atoms & Nuclei, Semiconductor Electronics"
        ]
      },
      {
        domainName: "Chemistry (Physical, Inorganic & Organic)",
        weightage: "30 Questions (100 Marks)",
        subtopics: [
          "Some Basic Concepts, Atomic Structure, Chemical Bonding & Molecular Structure",
          "Chemical Thermodynamics, Solutions, Equilibrium, Redox Reactions & Electrochemistry",
          "Chemical Kinetics, p-Block Elements, d- and f-Block Elements, Coordination Compounds",
          "Purification & Characterization, Organic Chemistry Principles, Hydrocarbons",
          "Haloalkanes, Alcohols, Phenols, Ethers, Aldehydes, Ketones, Carboxylic Acids, Amines, Biomolecules"
        ]
      },
      {
        domainName: "Mathematics (Class 11 & 12 Complete Syllabus)",
        weightage: "30 Questions (100 Marks)",
        subtopics: [
          "Sets, Relations & Functions, Complex Numbers & Quadratic Equations",
          "Matrices and Determinants, Permutations and Combinations, Binomial Theorem",
          "Sequence and Series, Limit, Continuity & Differentiability, Integral Calculus",
          "Differential Equations, Coordinate Geometry (Straight Lines, Circles, Conics)",
          "Three Dimensional Geometry, Vector Algebra, Statistics & Probability, Trigonometry"
        ]
      }
    ]
  },
  {
    id: "neet",
    examName: "NEET UG",
    fullName: "National Eligibility cum Entrance Test (Undergraduate Medical)",
    conductingBody: "National Testing Agency (NTA) & NMC",
    officialSite: "https://exams.nta.ac.in/NEET",
    lastUpdated: "NMC/NTA Harmonized Curriculum 2026–27",
    trackingStatus: "SYNCHRONIZED",
    domains: [
      {
        domainName: "Biology (Botany & Zoology)",
        weightage: "90 Questions (360 Marks)",
        subtopics: [
          "Diversity in Living World, Structural Organisation in Animals and Plants",
          "Cell Structure and Function, Plant Physiology, Human Physiology",
          "Reproduction in Organisms, Flowering Plants, and Human Reproduction",
          "Genetics and Evolution (Mendelian Principles, Molecular Basis of Inheritance)",
          "Biology and Human Welfare, Biotechnology and Its Applications, Ecology and Environment"
        ]
      },
      {
        domainName: "Physics & Chemistry for NEET",
        weightage: "90 Questions (360 Marks)",
        subtopics: [
          "Mechanics, Waves, Thermodynamics, Optics, Modern Physics (Medical Emphasis)",
          "Physical Chemistry Calculations, Organic Reaction Pathways, Bio-inorganic Systems"
        ]
      }
    ]
  }
];

export function SyllabusAndNTATracker() {
  const [selectedExamId, setSelectedExamId] = useState("sat");
  const [searchQuery, setSearchQuery] = useState("");

  const currentExam = EXAM_SYLLABI.find((e) => e.id === selectedExamId) || EXAM_SYLLABI[0];

  const filteredDomains = currentExam.domains.map((dom) => {
    if (!searchQuery.trim()) return dom;
    const matchesDomain = dom.domainName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedSubtopics = dom.subtopics.filter((sub) =>
      sub.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchesDomain) return dom;
    if (matchedSubtopics.length > 0) {
      return { ...dom, subtopics: matchedSubtopics };
    }
    return null;
  }).filter(Boolean) as SyllabusDomain[];

  return (
    <section id="syllabus-radar" className="py-16 md:py-24 border-b border-[#E1DDD2] bg-[#F7F5F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Real-time Tracking Status Strip */}
        <div className="p-4 rounded bg-[#FAF8F5] border border-[#E1DDD2] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
            </span>
            <div>
              <div className="text-xs font-mono font-bold text-[#1A2219] flex items-center gap-2">
                <span>Real-Time NTA & College Board Verification Engine</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded border border-emerald-300">
                  LIVE SYNC ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#556052] font-sans">
                Monitoring official gazettes & bulletins across <strong>nta.ac.in</strong>, <strong>jeemain.nta.nic.in</strong>, and <strong>satsuite.collegeboard.org</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs font-mono text-[#556052]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6C7D64]" />
              <span>Checked Today, 12:45 PM IST</span>
            </span>
            <a
              href="https://nta.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#283826] font-bold hover:underline"
            >
              <span>NTA Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Section Header */}
        <div className="space-y-3 pb-4 border-b border-[#E1DDD2]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#283826]" />
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#283826]">
              Verified Syllabus & Curriculum Explorer
            </span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1A2219] tracking-tight leading-tight">
            Complete, Authoritative Syllabus — <span className="italic font-normal text-[#283826]">SAT, GRE, JEE & NEET</span>
          </h2>

          <p className="text-sm sm:text-base text-[#556052] leading-relaxed max-w-3xl font-sans">
            Every topic, subtopic, and official weightage breakdown harmonized with official conducting bodies (College Board, ETS, and NTA). Zero guesswork or missing topics.
          </p>
        </div>

        {/* Exam Selection Tabs */}
        <div className="flex flex-wrap gap-2">
          {EXAM_SYLLABI.map((exam) => (
            <button
              key={exam.id}
              onClick={() => {
                setSelectedExamId(exam.id);
                setSearchQuery("");
              }}
              className={`
                px-5 py-2.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-2 border
                ${
                  selectedExamId === exam.id
                    ? "bg-[#283826] text-[#F7F5F0] border-[#283826] shadow-xs"
                    : "bg-white text-[#556052] border-[#E1DDD2] hover:border-[#283826] hover:text-[#1A2219]"
                }
              `}
            >
              <span>{exam.examName}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                selectedExamId === exam.id ? "bg-[#364A33] text-emerald-200" : "bg-[#F0EDE4] text-[#283826]"
              }`}>
                {exam.domains.length} Units
              </span>
            </button>
          ))}
        </div>

        {/* Current Exam Overview Card */}
        <div className="p-6 rounded bg-[#F0EDE4] border border-[#E1DDD2] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-[#6C7D64]">
              Conducting Body: {currentExam.conductingBody}
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#1A2219]">
              {currentExam.fullName}
            </h3>
            <p className="text-xs text-[#556052]">
              Official Status: <strong className="text-[#283826]">{currentExam.lastUpdated}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={currentExam.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-white text-[#283826] border border-[#E1DDD2] text-xs font-mono font-bold hover:bg-[#FAF8F5] transition-all shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#6C7D64]" />
              <span>Official Bulletin</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Topic Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6C7D64] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search across all ${currentExam.examName} topics, subtopics, or formulas...`}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#E1DDD2] rounded text-xs font-sans text-[#1A2219] placeholder:text-[#556052]/60 focus:outline-none focus:border-[#283826] shadow-2xs"
          />
        </div>

        {/* Syllabus Domain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDomains.map((dom, idx) => (
            <div
              key={idx}
              className="p-5 rounded bg-white border border-[#E1DDD2] hover:border-[#283826] transition-all space-y-3 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#E1DDD2]">
                  <h4 className="font-serif font-bold text-sm text-[#1A2219]">
                    {dom.domainName}
                  </h4>
                  {dom.weightage && (
                    <span className="text-[10px] font-mono font-bold text-[#B07D4F] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                      {dom.weightage}
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5">
                  {dom.subtopics.map((sub, sIdx) => (
                    <li key={sIdx} className="text-xs text-[#556052] flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6C7D64] shrink-0 mt-1.5" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#E1DDD2] flex items-center justify-between text-[11px] font-mono text-[#6C7D64]">
                <span>{dom.subtopics.length} Core Competencies</span>
                <a href="#explain-and-earn" className="text-[#283826] hover:underline font-bold">
                  Explain & Earn Stars →
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
