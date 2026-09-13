"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  ChevronRight,
  ExternalLink,
  X,
  BookOpen,
  Layers,
  Database,
  CheckCircle2,
  Clock,
  Zap,
  Trophy,
  Star,
  GraduationCap,
  PlayCircle,
  Target,
  Sparkles,
  Lightbulb,
  Bug,
  Send,
  Loader2,
  Terminal,
  FileCode,
  HelpCircle
} from "lucide-react";

interface Exercise {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "Tutorial" | "Problem" | "Course" | "Project";
  url: string;
  source: string;
  description: string;
  estimatedTime: string;
  free: boolean;
}

interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "Completed" | "In Progress" | "Recommended";
  badgeCode: string;
  icon: React.ReactNode;
  color: string;
  tagline: string;
  exercises: Exercise[];
}

const SKILLS: SkillItem[] = [
  {
    id: "sk-1",
    name: "Python Programming Fundamentals",
    category: "Coding & Computer Science",
    level: "Intermediate",
    status: "Completed",
    badgeCode: "SKL-PY-88",
    icon: <Code2 className="w-5 h-5" />,
    color: "blue",
    tagline: "Official python.org exercises — the Guruji of Python itself",
    exercises: [
      {
        title: "Python Official Tutorial — Introduction",
        difficulty: "Easy",
        type: "Tutorial",
        url: "https://docs.python.org/3/tutorial/introduction.html",
        source: "python.org (Official)",
        description: "Numbers, strings, and lists — the very start of your Python journey from python.org itself.",
        estimatedTime: "30 min",
        free: true
      },
      {
        title: "Control Flow — if, for, while, break",
        difficulty: "Easy",
        type: "Tutorial",
        url: "https://docs.python.org/3/tutorial/controlflow.html",
        source: "python.org (Official)",
        description: "Master conditional statements, loops, range(), and Python's unique control structures.",
        estimatedTime: "45 min",
        free: true
      },
      {
        title: "Data Structures — Lists, Tuples, Sets, Dicts",
        difficulty: "Easy",
        type: "Tutorial",
        url: "https://docs.python.org/3/tutorial/datastructures.html",
        source: "python.org (Official)",
        description: "Python's built-in collection types with list comprehensions, stacks, queues, and dictionaries.",
        estimatedTime: "1 hr",
        free: true
      },
      {
        title: "Modules & Packages",
        difficulty: "Medium",
        type: "Tutorial",
        url: "https://docs.python.org/3/tutorial/modules.html",
        source: "python.org (Official)",
        description: "Learn how Python's import system works — create your own reusable modules and packages.",
        estimatedTime: "45 min",
        free: true
      },
      {
        title: "Input & Output — File Reading/Writing",
        difficulty: "Medium",
        type: "Tutorial",
        url: "https://docs.python.org/3/tutorial/inputoutput.html",
        source: "python.org (Official)",
        description: "Formatted output with f-strings, reading/writing files, and JSON serialization.",
        estimatedTime: "1 hr",
        free: true
      },
      {
        title: "Errors & Exceptions Handling",
        difficulty: "Medium",
        type: "Tutorial",
        url: "https://docs.python.org/3/tutorial/errors.html",
        source: "python.org (Official)",
        description: "try/except/finally, raising exceptions, and writing robust error-tolerant Python code.",
        estimatedTime: "1 hr",
        free: true
      },
      {
        title: "Classes & Object-Oriented Programming",
        difficulty: "Medium",
        type: "Tutorial",
        url: "https://docs.python.org/3/tutorial/classes.html",
        source: "python.org (Official)",
        description: "Inheritance, method resolution, __init__, __str__, and the full Python OOP model.",
        estimatedTime: "2 hrs",
        free: true
      },
      {
        title: "The Python Standard Library — Brief Tour",
        difficulty: "Medium",
        type: "Tutorial",
        url: "https://docs.python.org/3/tutorial/stdlib.html",
        source: "python.org (Official)",
        description: "os, sys, math, random, datetime, csv, urllib — batteries included exploration.",
        estimatedTime: "1 hr",
        free: true
      },
      {
        title: "Python HOWTOs — Logging, Sorting, Regex",
        difficulty: "Hard",
        type: "Tutorial",
        url: "https://docs.python.org/3/howto/index.html",
        source: "python.org (Official HOWTOs)",
        description: "Advanced deep-dives: logging, regular expressions, sorting, Unicode, and functional programming.",
        estimatedTime: "3 hrs",
        free: true
      },
      {
        title: "Python Glossary — Know Every Term",
        difficulty: "Easy",
        type: "Tutorial",
        url: "https://docs.python.org/3/glossary.html",
        source: "python.org (Official Glossary)",
        description: "The official Python glossary — 100+ precise definitions of Python-specific terms and concepts.",
        estimatedTime: "20 min",
        free: true
      },
      {
        title: "Python 3.12 What's New",
        difficulty: "Hard",
        type: "Tutorial",
        url: "https://docs.python.org/3/whatsnew/3.12.html",
        source: "python.org (Latest Docs)",
        description: "Explore the newest Python features — type annotations, f-string improvements, and performance gains.",
        estimatedTime: "1 hr",
        free: true
      },
      {
        title: "PEP 8 — Python Style Guide",
        difficulty: "Easy",
        type: "Tutorial",
        url: "https://peps.python.org/pep-0008/",
        source: "python.org (PEP Index)",
        description: "The official Python code style guide used by all professional Python developers worldwide.",
        estimatedTime: "30 min",
        free: true
      }
    ]
  },
  {
    id: "sk-2",
    name: "Web Canvas & 3D Graphics (Three.js / Next.js)",
    category: "Creative Technology",
    level: "Intermediate",
    status: "In Progress",
    badgeCode: "SKL-3D-92",
    icon: <Layers className="w-5 h-5" />,
    color: "violet",
    tagline: "100% free courses — official docs, YouTube & open books",
    exercises: [
      {
        title: "Three.js Official Manual — Fundamentals",
        difficulty: "Easy",
        type: "Tutorial",
        url: "https://threejs.org/manual/#en/fundamentals",
        source: "threejs.org (Official Manual)",
        description: "The official starting point — build your first 3D scene with a cube, lights, camera, and animation loop. Written by the Three.js core team.",
        estimatedTime: "1 hr",
        free: true
      },
      {
        title: "Discover Three.js — Free Online Book",
        difficulty: "Easy",
        type: "Course",
        url: "https://discoverthreejs.com/book/introduction/",
        source: "discoverthreejs.com (Free Book)",
        description: "A complete free book dedicated to Three.js — covers scene setup, geometry, materials, lighting, textures, animations, and the render loop from scratch.",
        estimatedTime: "6 hrs",
        free: true
      },
      {
        title: "Three.js Crash Course for Absolute Beginners — YouTube",
        difficulty: "Easy",
        type: "Course",
        url: "https://www.youtube.com/watch?v=xJAfLec-9IY",
        source: "YouTube — DevelopedByEd (Free)",
        description: "A beginner-friendly YouTube crash course — build an immersive 3D website with Three.js from scratch in one video. No prior WebGL knowledge needed.",
        estimatedTime: "1.5 hrs",
        free: true
      },
      {
        title: "Three.js Full Course — freeCodeCamp YouTube",
        difficulty: "Easy",
        type: "Course",
        url: "https://www.youtube.com/watch?v=Q7AOvWpIVHU",
        source: "YouTube — freeCodeCamp (Free)",
        description: "freeCodeCamp's full Three.js tutorial — covers scene, renderer, geometry, textures, OrbitControls, and 3D animations step by step.",
        estimatedTime: "3 hrs",
        free: true
      },
      {
        title: "Three.js in 5 Minutes — Fireship.io",
        difficulty: "Easy",
        type: "Tutorial",
        url: "https://www.youtube.com/watch?v=Q7AOvWpIVHU",
        source: "YouTube — Fireship (Free)",
        description: "Fireship's lightning-fast intro to Three.js — perfect for getting the big picture quickly before diving deeper.",
        estimatedTime: "5 min",
        free: true
      },
      {
        title: "Three.js 5-Project Crash Course — YouTube",
        difficulty: "Medium",
        type: "Project",
        url: "https://www.youtube.com/watch?v=UMqNHi1GDAE",
        source: "YouTube — RobotBobby (Free)",
        description: "Build 5 complete Three.js projects: 3D Globe, Particle Effects, Scroll Animation, Solar System, and a 3D Text scene — all for free.",
        estimatedTime: "4 hrs",
        free: true
      },
      {
        title: "MDN Web Docs — WebGL Tutorial",
        difficulty: "Medium",
        type: "Tutorial",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial",
        source: "MDN Web Docs (Mozilla — Free)",
        description: "Understand the WebGL API that powers Three.js under the hood — official Mozilla docs explaining the canvas, shaders, and GPU pipeline.",
        estimatedTime: "3 hrs",
        free: true
      },
      {
        title: "Three.js Official Examples — 300+ Live Demos",
        difficulty: "Medium",
        type: "Project",
        url: "https://threejs.org/examples/",
        source: "threejs.org (Official Examples)",
        description: "Browse and inspect 300+ live demos from the Three.js core team — animations, physics, postprocessing, AR/VR, and shaders. View every source file.",
        estimatedTime: "Ongoing",
        free: true
      },
      {
        title: "React Three Fiber — Official Docs (R3F)",
        difficulty: "Medium",
        type: "Tutorial",
        url: "https://docs.pmnd.rs/react-three-fiber/getting-started/introduction",
        source: "docs.pmnd.rs (Official R3F Docs)",
        description: "The official React Three Fiber docs — use Three.js declaratively inside Next.js/React with hooks, refs, and events. The modern way to do 3D in React.",
        estimatedTime: "2 hrs",
        free: true
      },
      {
        title: "GLSL Shader Programming — The Book of Shaders",
        difficulty: "Hard",
        type: "Tutorial",
        url: "https://thebookofshaders.com/",
        source: "thebookofshaders.com (Free Book)",
        description: "The definitive free online book for learning GLSL fragment shaders — the language that controls every pixel in Three.js scenes. Interactive examples in every chapter.",
        estimatedTime: "8 hrs",
        free: true
      },
      {
        title: "Three.js 7-Hour Full Course — YouTube",
        difficulty: "Hard",
        type: "Course",
        url: "https://www.youtube.com/watch?v=_OwJV2xL8M8",
        source: "YouTube — Zero To Mastery (Free)",
        description: "A comprehensive 7-hour guide going from absolute basics to advanced techniques — scroll animations, particles, 3D models (GLTF/GLB), and postprocessing effects.",
        estimatedTime: "7 hrs",
        free: true
      }
    ]
  },
  {
    id: "sk-3",
    name: "Data Structures & Algorithmic Problem Solving",
    category: "Computer Science",
    level: "Advanced",
    status: "Recommended",
    badgeCode: "SKL-DSA-10",
    icon: <Database className="w-5 h-5" />,
    color: "emerald",
    tagline: "Real LeetCode problems + HackerRank tracks used in actual interviews",
    exercises: [
      {
        title: "Arrays — Two Sum (LeetCode #1)",
        difficulty: "Easy",
        type: "Problem",
        url: "https://leetcode.com/problems/two-sum/",
        source: "LeetCode (Free)",
        description: "The most classic coding interview problem — find two numbers that add up to a target. O(n) with a hash map.",
        estimatedTime: "20 min",
        free: true
      },
      {
        title: "Linked Lists — Reverse Linked List (LeetCode #206)",
        difficulty: "Easy",
        type: "Problem",
        url: "https://leetcode.com/problems/reverse-a-linked-list/",
        source: "LeetCode (Free)",
        description: "Reverse a singly linked list iteratively and recursively — foundational linked list manipulation.",
        estimatedTime: "20 min",
        free: true
      },
      {
        title: "Stacks — Valid Parentheses (LeetCode #20)",
        difficulty: "Easy",
        type: "Problem",
        url: "https://leetcode.com/problems/valid-parentheses/",
        source: "LeetCode (Free)",
        description: "Check if brackets are correctly matched using a stack — used in compilers and code editors.",
        estimatedTime: "15 min",
        free: true
      },
      {
        title: "Binary Search — Search in Rotated Array (LeetCode #33)",
        difficulty: "Medium",
        type: "Problem",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        source: "LeetCode (Free)",
        description: "Binary search with a twist — search in a sorted but rotated array. O(log n) solution.",
        estimatedTime: "30 min",
        free: true
      },
      {
        title: "Trees — Maximum Depth of Binary Tree (LeetCode #104)",
        difficulty: "Easy",
        type: "Problem",
        url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        source: "LeetCode (Free)",
        description: "DFS/BFS tree traversal to find the height — essential tree recursion pattern.",
        estimatedTime: "20 min",
        free: true
      },
      {
        title: "Dynamic Programming — Climbing Stairs (LeetCode #70)",
        difficulty: "Easy",
        type: "Problem",
        url: "https://leetcode.com/problems/climbing-stairs/",
        source: "LeetCode (Free)",
        description: "Classic intro to DP — how many ways to climb n stairs taking 1 or 2 steps. Fibonacci in disguise.",
        estimatedTime: "25 min",
        free: true
      },
      {
        title: "Graphs — Number of Islands (LeetCode #200)",
        difficulty: "Medium",
        type: "Problem",
        url: "https://leetcode.com/problems/number-of-islands/",
        source: "LeetCode (Free)",
        description: "BFS/DFS on a 2D grid — count connected components. Used in geography, social networks, games.",
        estimatedTime: "30 min",
        free: true
      },
      {
        title: "Sliding Window — Longest Substring Without Repeats (LeetCode #3)",
        difficulty: "Medium",
        type: "Problem",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        source: "LeetCode (Free)",
        description: "The sliding window technique — O(n) solution to find the longest unique-character substring.",
        estimatedTime: "30 min",
        free: true
      },
      {
        title: "HackerRank — 30 Days of Code Challenge",
        difficulty: "Easy",
        type: "Course",
        url: "https://www.hackerrank.com/domains/tutorials/30-days-of-code",
        source: "HackerRank (Free)",
        description: "30 progressive daily coding challenges covering variables, arrays, OOP, linked lists, and more — earn badges.",
        estimatedTime: "30 days",
        free: true
      },
      {
        title: "HackerRank — Data Structures Track",
        difficulty: "Medium",
        type: "Course",
        url: "https://www.hackerrank.com/domains/data-structures",
        source: "HackerRank (Free)",
        description: "Arrays, linked lists, trees, heaps, tries, stacks, queues — 100+ structured problems with solutions.",
        estimatedTime: "20 hrs",
        free: true
      },
      {
        title: "HackerRank — Algorithm Track",
        difficulty: "Medium",
        type: "Course",
        url: "https://www.hackerrank.com/domains/algorithms",
        source: "HackerRank (Free)",
        description: "Sorting, searching, dynamic programming, graph theory, greedy algorithms — full structured track.",
        estimatedTime: "30 hrs",
        free: true
      },
      {
        title: "LeetCode — Top 150 Interview Questions",
        difficulty: "Hard",
        type: "Course",
        url: "https://leetcode.com/studyplan/top-interview-150/",
        source: "LeetCode (Free Study Plan)",
        description: "The curated list of 150 must-solve problems that appear in Google, Amazon, Microsoft interviews.",
        estimatedTime: "60 hrs",
        free: true
      },
      {
        title: "Merge Intervals (LeetCode #56)",
        difficulty: "Medium",
        type: "Problem",
        url: "https://leetcode.com/problems/merge-intervals/",
        source: "LeetCode (Free)",
        description: "Sort and merge overlapping intervals — used in calendar apps, scheduling, and OS memory management.",
        estimatedTime: "35 min",
        free: true
      },
      {
        title: "Tries — Implement Trie (LeetCode #208)",
        difficulty: "Medium",
        type: "Problem",
        url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
        source: "LeetCode (Free)",
        description: "Build a prefix tree from scratch — powers autocomplete, spell check, and dictionary searches.",
        estimatedTime: "40 min",
        free: true
      }
    ]
  }
];

const COLOR_MAP: Record<string, {
  badge: string; icon: string; header: string;
  easy: string; medium: string; hard: string;
  tutorial: string; problem: string; course: string; project: string;
  ring: string;
}> = {
  blue: {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "bg-blue-100 text-blue-700",
    header: "from-blue-900 to-blue-800",
    easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-red-100 text-red-800 border-red-200",
    tutorial: "bg-blue-50 text-blue-700 border-blue-200",
    problem: "bg-purple-50 text-purple-700 border-purple-200",
    course: "bg-indigo-50 text-indigo-700 border-indigo-200",
    project: "bg-teal-50 text-teal-700 border-teal-200",
    ring: "hover:border-blue-400 hover:shadow-blue-100"
  },
  violet: {
    badge: "bg-violet-100 text-violet-800 border-violet-200",
    icon: "bg-violet-100 text-violet-700",
    header: "from-violet-900 to-violet-800",
    easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-red-100 text-red-800 border-red-200",
    tutorial: "bg-violet-50 text-violet-700 border-violet-200",
    problem: "bg-purple-50 text-purple-700 border-purple-200",
    course: "bg-indigo-50 text-indigo-700 border-indigo-200",
    project: "bg-teal-50 text-teal-700 border-teal-200",
    ring: "hover:border-violet-400 hover:shadow-violet-100"
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "bg-emerald-100 text-emerald-700",
    header: "from-emerald-900 to-emerald-800",
    easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-red-100 text-red-800 border-red-200",
    tutorial: "bg-emerald-50 text-emerald-700 border-emerald-200",
    problem: "bg-purple-50 text-purple-700 border-purple-200",
    course: "bg-indigo-50 text-indigo-700 border-indigo-200",
    project: "bg-teal-50 text-teal-700 border-teal-200",
    ring: "hover:border-emerald-400 hover:shadow-emerald-100"
  }
};

const STATUS_STYLES: Record<string, string> = {
  "Completed": "bg-emerald-100 text-emerald-900 border border-emerald-200",
  "In Progress": "bg-amber-100 text-amber-900 border border-amber-200",
  "Recommended": "bg-[#E8DCC3] text-[#252B18] border border-[#C8A95B]/40"
};

export default function SkillAssessmentsPage() {
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  // CodeAI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"hint" | "tutor" | "debug">("hint");
  const [targetProblem, setTargetProblem] = useState("Arrays — Two Sum (LeetCode #1)");
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [tutorQuery, setTutorQuery] = useState("");
  const [codeSnippet, setCodeSnippet] = useState(
`# Paste your Python or JavaScript code here to review:
def two_sum(nums, target):
    seen = {}
    for i in range(len(nums)):
        diff = target - nums[i]
        if diff in seen:
            return [seen[diff], i]
        seen[nums[i]] = i
    return []`
  );

  const filteredExercises = activeSkill?.exercises.filter(
    (ex) => filter === "All" || ex.difficulty === filter
  ) ?? [];

  const getDifficultyStyle = (diff: string, color: string) => {
    const c = COLOR_MAP[color];
    if (diff === "Easy") return c.easy;
    if (diff === "Medium") return c.medium;
    return c.hard;
  };

  const getTypeStyle = (type: string, color: string) => {
    const c = COLOR_MAP[color];
    if (type === "Tutorial") return c.tutorial;
    if (type === "Problem") return c.problem;
    if (type === "Course") return c.course;
    return c.project;
  };

  // Fetch CodeAI Guidance
  const fetchCodeAi = async (mode: "hint" | "explain" | "debug", lvl: 1 | 2 | 3 = hintLevel, problem = targetProblem, queryText = tutorQuery) => {
    setAiLoading(true);
    setAiOutput(null);
    try {
      const res = await fetch("/api/ai/code-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemTitle: problem,
          mode,
          hintLevel: lvl,
          query: queryText,
          codeSnippet: mode === "debug" ? codeSnippet : undefined
        })
      });
      const data = await res.json();
      if (data?.content) {
        setAiOutput(data.content);
      } else {
        setAiOutput("Could not generate response. Please try again.");
      }
    } catch (err) {
      setAiOutput("CodeAI service temporarily unavailable.");
    } finally {
      setAiLoading(false);
    }
  };

  // Open Hint for Specific Exercise
  const openHintForProblem = (problemTitle: string) => {
    setTargetProblem(problemTitle);
    setActiveTab("hint");
    setHintLevel(1);
    setIsAiModalOpen(true);
    fetchCodeAi("hint", 1, problemTitle);
  };

  // Lock scroll when modal is open
  useEffect(() => {
    if (isAiModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isAiModalOpen]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#3D4425]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              Skill Profiles & Coding Assessments
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#252B18] text-[#C8A95B] px-2.5 py-0.5 rounded-full border border-[#C8A95B]/40">
              Floor 2 — Skills
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            Build practical programming skills with official python.org exercises, Three.js 3D web, and LeetCode DSA.
          </p>
        </div>

        {/* CodeAI Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAiModalOpen(true);
              setActiveTab("tutor");
              if (!aiOutput) fetchCodeAi("explain", 1, undefined, "How should I structure my daily coding practice?");
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#252B18] text-[#F7F5F0] hover:bg-[#3D4425] rounded-full text-xs font-mono font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A95B]" />
            <span>CodeAI Coach & Debugger</span>
          </button>
        </div>
      </div>

      {/* CodeAI Highlight Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#252B18] to-[#3D4425] text-[#F7F5F0] shadow-sm border border-[#3D4425]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8A95B] font-bold">
              BEYOND CodeAI Assistant
            </span>
          </div>
          <h3 className="font-display font-bold text-base text-white">
            Stuck on a problem or need a hint without full spoilers?
          </h3>
          <p className="text-xs text-stone-300">
            Get progressive hints (Level 1 Intuition → Level 2 Algorithm → Level 3 Code) or review your solution with AI.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => openHintForProblem("Arrays — Two Sum (LeetCode #1)")}
            className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
          >
            Two Sum Hint
          </button>
          <button
            onClick={() => openHintForProblem("Three.js Official Manual — Fundamentals")}
            className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium bg-[#C8A95B] text-[#252B18] hover:bg-[#b89849] font-bold transition-colors"
          >
            3D Scene Setup →
          </button>
        </div>
      </div>

      {/* Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SKILLS.map((sk) => {
          const colors = COLOR_MAP[sk.color];
          return (
            <div
              key={sk.id}
              onClick={() => setActiveSkill(sk)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveSkill(sk); }}
              className={`bg-[#F8F4EC] border border-[#3D4425]/20 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between cursor-pointer group select-none ${colors.ring} hover:shadow-md`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#3D4425] bg-[#E8DCC3] px-2 py-0.5 rounded">
                    {sk.level}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${STATUS_STYLES[sk.status]}`}>
                    {sk.status}
                  </span>
                </div>

                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colors.icon}`}>
                  {sk.icon}
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-[#252B18] leading-snug">
                    {sk.name}
                  </h3>
                  <p className="text-xs text-[#69704A] mt-0.5">{sk.category}</p>
                  <p className="text-[10px] text-[#69704A]/70 mt-1 italic">{sk.tagline}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-mono bg-[#3D4425]/5 text-[#3D4425] px-2 py-0.5 rounded border border-[#3D4425]/10">
                    {sk.exercises.length} exercises
                  </span>
                  <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    100% Free
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#3D4425]/10 flex items-center justify-between mt-4">
                <span className="text-[10px] font-mono text-[#3D4425] font-bold">{sk.badgeCode}</span>
                <span className="text-xs font-bold text-[#252B18] group-hover:text-[#C8A95B] flex items-center gap-1 transition-colors">
                  <span>View Exercises</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── EXERCISES PANEL ── */}
      {activeSkill && (
        <div className="mt-8 space-y-4">
          {/* Panel Header */}
          <div className={`rounded-3xl bg-gradient-to-br ${COLOR_MAP[activeSkill.color].header} p-6 text-white`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${COLOR_MAP[activeSkill.color].icon}`}>
                  {activeSkill.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono uppercase font-bold bg-white/20 px-2 py-0.5 rounded">
                      {activeSkill.level}
                    </span>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded">
                      {activeSkill.exercises.length} exercises available
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded">
                      All Free
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl leading-snug">{activeSkill.name}</h2>
                  <p className="text-xs text-white/70 mt-0.5">{activeSkill.tagline}</p>
                </div>
              </div>
              <button
                onClick={() => { setActiveSkill(null); setFilter("All"); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              <span className="text-[10px] text-white/60 font-mono uppercase">Filter:</span>
              {(["All", "Easy", "Medium", "Hard"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border transition-all ${
                    filter === f
                      ? "bg-white text-[#252B18] border-white"
                      : "border-white/30 text-white/70 hover:border-white/60 hover:text-white"
                  }`}
                >
                  {f}
                  {f !== "All" && (
                    <span className="ml-1 opacity-60">
                      ({activeSkill.exercises.filter(e => e.difficulty === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredExercises.map((ex, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between bg-[#F8F4EC] border border-[#3D4425]/15 rounded-2xl p-4 hover:border-[#3D4425]/40 hover:shadow-md transition-all"
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getDifficultyStyle(ex.difficulty, activeSkill.color)}`}>
                        {ex.difficulty}
                      </span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getTypeStyle(ex.type, activeSkill.color)}`}>
                        {ex.type}
                      </span>
                      {ex.free && (
                        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                          FREE
                        </span>
                      )}
                    </div>
                    <a
                      href={ex.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3D4425]/40 hover:text-[#3D4425] p-1"
                      title="Open source"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Title */}
                  <a
                    href={ex.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-bold text-sm text-[#252B18] leading-snug hover:text-[#C8A95B] transition-colors block"
                  >
                    {ex.title}
                  </a>

                  {/* Description */}
                  <p className="text-[11px] text-[#69704A] mt-1.5 leading-relaxed">
                    {ex.description}
                  </p>
                </div>

                {/* Footer with AI Hint button */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#3D4425]/10">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#69704A]">
                    <GraduationCap className="w-3 h-3" />
                    <span className="font-mono">{ex.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openHintForProblem(ex.title);
                      }}
                      className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300 transition-colors"
                    >
                      <Lightbulb className="w-3 h-3 text-amber-700" />
                      <span>AI Hint</span>
                    </button>
                    <div className="flex items-center gap-1 text-[10px] text-[#69704A]">
                      <Clock className="w-3 h-3" />
                      <span>{ex.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-10 text-sm text-[#69704A]">
              No {filter} exercises for this skill. Try a different filter.
            </div>
          )}
        </div>
      )}

      {/* ── CODEAI MODAL & PLAYGROUND ── */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#F8F4EC] rounded-3xl border border-[#3D4425]/20 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#3D4425]/10 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#252B18]">CodeAI Coding Coach</h3>
                  <p className="text-[11px] text-[#69704A]">Python, Three.js & DSA Reasoning Engine</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#3D4425]/10 hover:bg-[#3D4425]/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[#3D4425]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#3D4425]/10 bg-stone-50 px-5 pt-2 gap-2">
              <button
                onClick={() => {
                  setActiveTab("hint");
                  fetchCodeAi("hint", hintLevel, targetProblem);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold border-b-2 transition-all ${
                  activeTab === "hint"
                    ? "border-[#252B18] text-[#252B18]"
                    : "border-transparent text-[#69704A] hover:text-[#252B18]"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Progressive Hint</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("tutor");
                  if (!aiOutput) fetchCodeAi("explain", 1, undefined, tutorQuery || "Explain Python list comprehensions");
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold border-b-2 transition-all ${
                  activeTab === "tutor"
                    ? "border-[#252B18] text-[#252B18]"
                    : "border-transparent text-[#69704A] hover:text-[#252B18]"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Concept Tutor</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("debug");
                  fetchCodeAi("debug");
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold border-b-2 transition-all ${
                  activeTab === "debug"
                    ? "border-[#252B18] text-[#252B18]"
                    : "border-transparent text-[#69704A] hover:text-[#252B18]"
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Code Debugger</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Tab 1: Progressive Hint */}
              {activeTab === "hint" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-white border border-[#3D4425]/15">
                    <div className="text-[10px] font-mono text-[#69704A] uppercase font-bold">Target Exercise:</div>
                    <div className="text-sm font-bold text-[#252B18] mt-0.5">{targetProblem}</div>
                  </div>

                  {/* 3-Level Hint Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#252B18]">Hint Level:</span>
                    {([1, 2, 3] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          setHintLevel(lvl);
                          fetchCodeAi("hint", lvl, targetProblem);
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                          hintLevel === lvl
                            ? "bg-[#252B18] text-white border-[#252B18]"
                            : "bg-white text-[#3D4425] border-[#3D4425]/20 hover:border-[#3D4425]"
                        }`}
                      >
                        {lvl === 1 && "Level 1: Intuition"}
                        {lvl === 2 && "Level 2: Algorithm"}
                        {lvl === 3 && "Level 3: Full Code"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Concept Tutor */}
              {activeTab === "tutor" && (
                <div className="space-y-3">
                  <div className="text-xs text-[#69704A]">Ask any concept in Python, Three.js 3D math, or DSA:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "How does Three.js render loop work?",
                      "Two Sum hash map logic explained",
                      "Difference between Lists and Tuples in Python",
                      "How to write a basic GLSL fragment shader?"
                    ].map((q, qi) => (
                      <button
                        key={qi}
                        onClick={() => {
                          setTutorQuery(q);
                          fetchCodeAi("explain", 1, undefined, q);
                        }}
                        className="text-[10px] text-left px-2.5 py-1 rounded-full bg-white border border-[#3D4425]/15 hover:border-[#3D4425] text-[#3D4425] transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tutorQuery}
                      onChange={(e) => setTutorQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") fetchCodeAi("explain", 1, undefined, tutorQuery);
                      }}
                      placeholder="Ask CodeAI a question (e.g. 'Explain binary search recursive vs iterative')..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#3D4425]/20 text-xs focus:outline-none focus:ring-1 focus:ring-[#3D4425]"
                    />
                    <button
                      onClick={() => fetchCodeAi("explain", 1, undefined, tutorQuery)}
                      disabled={aiLoading || !tutorQuery.trim()}
                      className="px-4 py-1.5 bg-[#252B18] text-white text-xs font-mono font-bold rounded-xl disabled:opacity-40"
                    >
                      Ask
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Code Debugger */}
              {activeTab === "debug" && (
                <div className="space-y-3">
                  <div className="text-xs text-[#69704A]">Paste your code snippet below to review for bugs and edge cases:</div>
                  <textarea
                    rows={6}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full p-3 font-mono text-xs bg-white rounded-2xl border border-[#3D4425]/20 focus:outline-none focus:ring-1 focus:ring-[#3D4425]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => fetchCodeAi("debug")}
                      disabled={aiLoading}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[#252B18] hover:bg-[#3D4425] text-white text-xs font-mono font-bold rounded-xl transition-colors"
                    >
                      <Bug className="w-3.5 h-3.5 text-red-400" />
                      <span>Analyze Code for Bugs</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {aiLoading && (
                <div className="flex items-center justify-center py-8 gap-2 text-[#69704A] text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-[#3D4425]" />
                  <span>CodeAI is reasoning through code structures…</span>
                </div>
              )}

              {/* AI Output Display */}
              {aiOutput && !aiLoading && (
                <div className="p-4 rounded-2xl bg-white border border-[#3D4425]/15 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#69704A] border-b border-[#3D4425]/10 pb-1.5">
                    <span className="flex items-center gap-1 text-violet-800 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CodeAI Analysis
                    </span>
                    <span>Algorithms & Syntax Engine</span>
                  </div>
                  <div className="text-xs text-[#252B18] leading-relaxed whitespace-pre-wrap font-sans">
                    {aiOutput}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-white border-t border-[#3D4425]/10 text-center text-[10px] text-[#69704A]">
              CodeAI guides your problem-solving process without depriving you of the learning journey.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

