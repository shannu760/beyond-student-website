"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  StudentTaskSignal,
  PerformanceSignal,
  RecommendedVideo,
  DEFAULT_TASKS,
  DEFAULT_PERFORMANCE,
  computeRealtimeRecommendations,
} from "@/lib/videoRecommendationEngine";

const STORAGE_KEY_TASKS = "beyond_study_schedule_blocks_v2";
const STORAGE_KEY_PERF = "beyond_study_perf_signals_v2";

export function useAIVideoRecommendations() {
  const [tasks, setTasks] = useState<StudentTaskSignal[]>(DEFAULT_TASKS);
  const [performance, setPerformance] = useState<PerformanceSignal>(DEFAULT_PERFORMANCE);
  const [isClient, setIsClient] = useState(false);
  const [lastEventMessage, setLastEventMessage] = useState<string | null>(null);

  // Initialize from localStorage or server profile/activity on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }

      const savedPerf = localStorage.getItem(STORAGE_KEY_PERF);
      if (savedPerf) {
        const parsed = JSON.parse(savedPerf);
        if (parsed && typeof parsed === "object") {
          setPerformance((prev) => ({ ...prev, ...parsed }));
        }
      }

      // Also try fetching from /api/daily-report and /api/profile
      fetch("/api/daily-report")
        .then((res) => res.json())
        .then((data) => {
          if (data?.report) {
            setPerformance((prev) => ({
              ...prev,
              accuracyPercentage: data.report.accuracyPercentage || prev.accuracyPercentage,
              weakTopics: data.report.reviewNeededTopics?.length
                ? data.report.reviewNeededTopics
                : prev.weakTopics,
              masteredTopics: data.report.masteredTopics?.length
                ? data.report.masteredTopics
                : prev.masteredTopics,
            }));
          }
        })
        .catch(() => {});
    } catch {
      // fallback to defaults
    }
  }, []);

  // Synchronize tasks to localStorage
  const saveTasks = useCallback((newTasks: StudentTaskSignal[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(newTasks));
    } catch {}
  }, []);

  // Toggle or update a task's status
  const updateTaskStatus = useCallback(
    (taskId: string, newStatus?: "completed" | "in_progress" | "planned") => {
      setTasks((prev) => {
        const updated = prev.map((t) => {
          if (t.id !== taskId) return t;
          const status =
            newStatus !== undefined
              ? newStatus
              : t.status === "completed"
              ? "planned"
              : "completed";
          return { ...t, status };
        });

        try {
          localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updated));
        } catch {}

        const target = updated.find((t) => t.id === taskId);
        if (target) {
          const msg =
            target.status === "completed"
              ? `Completed: "${target.topic}" • Stepping up AI recommendations`
              : `Scheduled: "${target.topic}" for active study`;
          setLastEventMessage(msg);

          // Broadcast custom event so other components (e.g. DailyFocusSchedule, Popups) react
          window.dispatchEvent(
            new CustomEvent("beyond:task-updated", {
              detail: {
                taskId,
                topic: target.topic,
                status: target.status,
                subject: target.subject,
              },
            })
          );
        }

        return updated;
      });
    },
    []
  );

  // Set predefined simulation scenarios for rapid demonstration
  const setScenario = useCallback((scenario: "rotational_mastery" | "electrostatics_remediation" | "calculus_active" | "reset") => {
    if (scenario === "rotational_mastery") {
      const updated: StudentTaskSignal[] = DEFAULT_TASKS.map((t) =>
        t.topic.includes("Rotational")
          ? { ...t, status: "completed" as const }
          : t.topic.includes("Definite")
          ? { ...t, status: "in_progress" as const }
          : { ...t, status: "planned" as const }
      );
      saveTasks(updated);
      setPerformance((prev) => ({
        ...prev,
        masteredTopics: ["Rotational Dynamics Basics", "Work-Energy"],
        weakTopics: ["Electrostatics Dipole"],
      }));
      setLastEventMessage("Scenario Applied: Just completed Rotational Dynamics basics (Step-Up Mode)");
    } else if (scenario === "electrostatics_remediation") {
      const updated: StudentTaskSignal[] = DEFAULT_TASKS.map((t) =>
        t.topic.includes("Electrostatics")
          ? { ...t, status: "in_progress" as const }
          : { ...t, status: "planned" as const }
      );
      saveTasks(updated);
      setPerformance((prev) => ({
        ...prev,
        accuracyPercentage: 42,
        weakTopics: ["Electrostatics Dipole", "Gauss Law"],
      }));
      setLastEventMessage("Scenario Applied: Diagnostic score 42% in Electrostatics (Remediation Mode)");
    } else if (scenario === "calculus_active") {
      const updated: StudentTaskSignal[] = DEFAULT_TASKS.map((t) =>
        t.topic.includes("Definite")
          ? { ...t, status: "in_progress" as const }
          : { ...t, status: "planned" as const }
      );
      saveTasks(updated);
      setPerformance((prev) => ({
        ...prev,
        accuracyPercentage: 74,
        weakTopics: ["Definite Integrals Leibniz"],
      }));
      setLastEventMessage("Scenario Applied: Active Focus on Definite Integrals");
    } else {
      saveTasks(DEFAULT_TASKS);
      setPerformance(DEFAULT_PERFORMANCE);
      setLastEventMessage("Schedule and performance reset to default state");
    }
  }, [saveTasks]);

  // Listen for global application events
  useEffect(() => {
    const handleTaskUpdated = (e: any) => {
      const detail = e.detail;
      if (!detail) return;

      setTasks((prev) => {
        // If task is already in state, update its status
        const exists = prev.some((t) => t.id === detail.taskId);
        if (exists) {
          return prev.map((t) =>
            t.id === detail.taskId ? { ...t, status: detail.status || t.status } : t
          );
        }
        return prev;
      });

      setLastEventMessage(
        `Real-time sync: "${detail.topic}" is now ${detail.status?.toUpperCase() || "UPDATED"}`
      );
    };

    const handleActivityUpdated = () => {
      fetch("/api/daily-report")
        .then((res) => res.json())
        .then((data) => {
          if (data?.report) {
            setPerformance((prev) => ({
              ...prev,
              accuracyPercentage: data.report.accuracyPercentage || prev.accuracyPercentage,
              weakTopics: data.report.reviewNeededTopics?.length
                ? data.report.reviewNeededTopics
                : prev.weakTopics,
            }));
          }
        })
        .catch(() => {});
    };

    window.addEventListener("beyond:task-updated", handleTaskUpdated);
    window.addEventListener("beyond:activity-updated", handleActivityUpdated);

    return () => {
      window.removeEventListener("beyond:task-updated", handleTaskUpdated);
      window.removeEventListener("beyond:activity-updated", handleActivityUpdated);
    };
  }, []);

  // Real-time computed recommendation list
  const recommendations = useMemo(() => {
    return computeRealtimeRecommendations({
      tasks,
      performance,
    });
  }, [tasks, performance]);

  const topRecommendation = recommendations[0] || null;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const activeTask = tasks.find((t) => t.status === "in_progress") || tasks.find((t) => t.status === "planned");

  return {
    tasks,
    performance,
    recommendations,
    topRecommendation,
    completedCount,
    totalTasksCount: tasks.length,
    activeTask,
    updateTaskStatus,
    setScenario,
    lastEventMessage,
    isClient,
  };
}
