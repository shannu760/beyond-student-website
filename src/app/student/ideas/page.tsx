"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  ThumbsUp,
  Brain,
  Rocket,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { StudentIdeaSubmission, IdeaFeasibilityAnalysis } from "@/lib/ai/student-ai-types";
import { evaluateStudentIdea } from "@/lib/ai/student-engine";

interface IdeaCard {
  id: string;
  title: string;
  category: string;
  author: string;
  problem: string;
  solution: string;
  feasibilityScore: number;
  votes: number;
  status: string;
}

const INITIAL_IDEAS: IdeaCard[] = [
  {
    id: "idea-1",
    title: "Interactive Physics Formula Visualizer",
    category: "Study Tool",
    author: "Arjun K.",
    problem: "Students struggle to visualize how changing dipole charges dynamically bends field lines in 3D.",
    solution: "A web canvas tool using Three.js allowing students to drag charges and observe vector field vectors in real time.",
    feasibilityScore: 86,
    votes: 42,
    status: "Feasibility Approved"
  },
  {
    id: "idea-[#2]",
    title: "Peer Problem Swap Challenge",
    category: "Community Idea",
    author: "Siddharth M.",
    problem: "Solving static book problems alone gets repetitive without timed competition.",
    solution: "Students craft 1 original numerical problem per week and swap with an assigned study room partner.",
    feasibilityScore: 92,
    votes: 38,
    status: "Under Review"
  }
];

export default function IdeaLabPage() {
  const [ideas, setIdeas] = useState<IdeaCard[]>(INITIAL_IDEAS);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<StudentIdeaSubmission["category"]>("Study Tool");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<IdeaFeasibilityAnalysis | null>(null);

  const handleVote = (id: string) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
    );
  };

  const handleEvaluateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problem.trim() || !solution.trim()) return;

    setIsEvaluating(true);
    try {
      const evaluation = await evaluateStudentIdea({
        title,
        category,
        problemStatement: problem,
        proposedSolution: solution,
        targetUsers: "Class 11-12 Students"
      });

      setEvalResult(evaluation);

      const newIdeaCard: IdeaCard = {
        id: `idea-${Date.now()}`,
        title,
        category,
        author: "Arjun K.",
        problem,
        solution,
        feasibilityScore: evaluation.feasibilityScore,
        votes: 1,
        status: "Feasibility Approved"
      };

      setIdeas([newIdeaCard, ...ideas]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#3D4425]" />
            <h1 className="font-accent font-bold text-2xl text-[#252B18]">
              BEYOND Idea Lab
            </h1>
            <span className="text-[10px] uppercase font-mono font-bold bg-[#252B18] text-[#C8A95B] px-2.5 py-0.5 rounded-full border border-[#C8A95B]/40">
              Student Feedback Engine
            </span>
          </div>
          <p className="text-xs text-[#69704A] mt-1">
            Turn your study tools & educational ideas into real projects with AI feasibility analysis & community votes.
          </p>
        </div>

        <button
          onClick={() => {
            setShowSubmitModal(true);
            setEvalResult(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3D4425] text-[#F3EBDD] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#252B18] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#C8A95B]" />
          <span>Submit Student Idea</span>
        </button>
      </div>

      {/* Ethical Student Contribution & IP Ownership Policy Banner */}
      <div className="p-3.5 rounded-2xl bg-[#E8DCC3]/50 border border-[#3D4425]/15 text-[11px] text-[#3D4425] flex items-start sm:items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed">
          <strong className="text-[#252B18]">Student Ownership Guarantee:</strong> You retain 100% intellectual property ownership of all ideas submitted to BEYOND Idea Lab. Submissions serve exclusively for peer feedback, AI feasibility analysis, and community voting under our Ethical Student Contribution Policy.
        </div>
      </div>

      {/* Idea Cards Grid */}
      <div className="space-y-4">
        {ideas.map((item) => (
          <div
            key={item.id}
            className="bg-[#F8F4EC] border border-[#3D4425]/20 hover:border-[#C8A95B] rounded-2xl p-6 shadow-sm space-y-4 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3D4425]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#252B18] text-[#C8A95B]">
                  {item.category}
                </span>
                <span className="text-xs text-[#69704A]">Submitted by {item.author}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                  Feasibility: {item.feasibilityScore}%
                </div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#E8DCC3] text-[#3D4425]">
                  {item.status}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-[#252B18] mb-1">
                {item.title}
              </h3>
              <div className="space-y-1.5 text-xs text-[#3D4425]">
                <p><strong>Problem:</strong> {item.problem}</p>
                <p><strong>Proposed Solution:</strong> {item.solution}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#3D4425]/10 flex items-center justify-between">
              <button
                onClick={() => handleVote(item.id)}
                className="flex items-center gap-2 text-xs font-bold text-[#3D4425] hover:text-[#C8A95B] transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{item.votes} Student Votes</span>
              </button>

              <span className="text-xs font-mono text-[#69704A]">
                Reviewed by Founder & AI Mentor
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-[#252B18]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F8F4EC] border border-[#3D4425]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-accent font-bold text-2xl text-[#252B18]">
              Submit Student Idea to Lab
            </h3>

            {!evalResult ? (
              <form onSubmit={handleEvaluateAndSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D4425] uppercase tracking-wider mb-1">
                    Idea Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Physics Formula Visualizer"
                    className="w-full bg-[#E8DCC3] border border-[#3D4425]/20 rounded-xl px-3.5 py-2 text-xs text-[#252B18]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D4425] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#E8DCC3] border border-[#3D4425]/20 rounded-xl px-3.5 py-2 text-xs text-[#252B18]"
                  >
                    <option>Study Tool</option>
                    <option>App Idea</option>
                    <option>Science Project</option>
                    <option>Community Idea</option>
                    <option>School Innovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D4425] uppercase tracking-wider mb-1">
                    Problem Statement
                  </label>
                  <textarea
                    rows={2}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="What specific problem does this solve for students?"
                    className="w-full bg-[#E8DCC3] border border-[#3D4425]/20 rounded-xl px-3.5 py-2 text-xs text-[#252B18]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D4425] uppercase tracking-wider mb-1">
                    Proposed Solution
                  </label>
                  <textarea
                    rows={3}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Describe how your proposed tool or idea works..."
                    className="w-full bg-[#E8DCC3] border border-[#3D4425]/20 rounded-xl px-3.5 py-2 text-xs text-[#252B18]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#3D4425]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEvaluating}
                    className="px-5 py-2.5 rounded-xl bg-[#3D4425] text-[#F3EBDD] font-bold text-xs uppercase tracking-wider hover:bg-[#252B18]"
                  >
                    {isEvaluating ? "Analyzing Feasibility..." : "Analyze & Submit Idea"}
                  </button>
                </div>
              </form>
            ) : (
              /* AI Feasibility Result View */
              <div className="space-y-4 animate-fade-in">
                <div className="bg-[#252B18] text-[#F3EBDD] p-5 rounded-2xl border border-[#C8A95B]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#C8A95B] font-bold">
                      AI Feasibility Analysis Complete
                    </span>
                    <span className="text-xl font-bold font-display text-[#C8A95B]">
                      {evalResult.feasibilityScore}% Score
                    </span>
                  </div>

                  <p className="text-xs text-[#D9CAA8] leading-relaxed">
                    {evalResult.clarifiedConcept}
                  </p>

                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-[#F3EBDD]">Recommended Prototype Plan:</div>
                    <ul className="list-disc list-inside text-[#D9CAA8]/80 space-y-0.5">
                      {evalResult.prototypePlan.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="w-full py-3 rounded-xl bg-[#C8A95B] text-[#252B18] font-bold text-xs uppercase tracking-wider hover:bg-[#d4b566]"
                >
                  Close & View in Idea Lab
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
