"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Users,
  Clock,
  Target,
  Sparkles,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeX,
  Sliders,
  Settings,
  X,
  Share2,
  Headphones,
  Flame,
  Star,
  ArrowUpRight,
  Search,
  BookOpen,
  Filter,
  Check,
  ShieldCheck,
  Lock,
  Globe,
  Radio,
  Coffee,
  CloudRain,
  Music,
  Waves,
  Maximize2,
  Minimize2,
  ChevronRight,
  Award
} from "lucide-react";
import { StudyRoom, StudyRoomTask } from "@/lib/studyRoomsService";

// Safe procedural Web Audio soundscape engine
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  public isMuted: boolean = false;
  public volume: number = 0.4;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public playChime(freq = 528) {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {}
  }

  public playSuccessFanfare() {
    try {
      this.init();
      if (!this.ctx || this.isMuted) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const start = this.ctx!.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0.22 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch {}
  }

  public setAmbience(type: "silence" | "rain" | "binaural" | "lofi" | "cafe") {
    try {
      this.stopAmbience();
      if (type === "silence" || this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.gainNode = masterGain;

      if (type === "rain") {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          output[i] = (b0 + b1 + b2) * 0.15;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 850;
        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        this.noiseNode = whiteNoise;
      } else if (type === "binaural") {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const merger = this.ctx.createChannelMerger(2);
        osc1.frequency.value = 216;
        osc2.frequency.value = 256; // 40Hz delta
        osc1.type = "sine";
        osc2.type = "sine";
        osc1.connect(merger, 0, 0);
        osc2.connect(merger, 0, 1);
        merger.connect(masterGain);
        osc1.start();
        osc2.start();
        this.noiseNode = osc1;
      } else if (type === "lofi") {
        const osc = this.ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = 174;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 320;
        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
        this.noiseNode = osc;
      } else if (type === "cafe") {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 1.7;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 450;
        filter.Q.value = 1.1;
        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        this.noiseNode = noise;
      }
    } catch {}
  }

  public stopAmbience() {
    try {
      if (this.noiseNode) {
        (this.noiseNode as any).stop?.();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch {}
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.25, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.gainNode && this.ctx && !this.isMuted) {
      this.gainNode.gain.setValueAtTime(vol * 0.25, this.ctx.currentTime);
    }
  }
}

const audioEngine = new AmbientAudioEngine();

const THEME_STYLES = {
  forest: {
    bg: "bg-[#252B18]",
    border: "border-[#C8A95B]/40",
    badge: "bg-[#3D4425] text-[#C8A95B] border-[#69704A]/30",
    timerBg: "bg-[#1B2011]",
    accentText: "text-[#C8A95B]",
    button: "bg-[#C8A95B] text-[#252B18] hover:bg-[#E8DCC3]",
    card: "bg-[#3D4425]/70"
  },
  midnight: {
    bg: "bg-[#0F172A]",
    border: "border-cyan-500/40",
    badge: "bg-cyan-950 text-cyan-300 border-cyan-700/40",
    timerBg: "bg-[#080E1A]",
    accentText: "text-cyan-400",
    button: "bg-cyan-500 text-slate-950 hover:bg-cyan-400",
    card: "bg-slate-900/80"
  },
  amber: {
    bg: "bg-[#261A10]",
    border: "border-amber-500/40",
    badge: "bg-amber-950 text-amber-300 border-amber-700/40",
    timerBg: "bg-[#180E07]",
    accentText: "text-amber-400",
    button: "bg-amber-500 text-amber-950 hover:bg-amber-400",
    card: "bg-[#382618]/80"
  },
  indigo: {
    bg: "bg-[#15122B]",
    border: "border-indigo-400/40",
    badge: "bg-indigo-950 text-indigo-300 border-indigo-700/40",
    timerBg: "bg-[#0B0918]",
    accentText: "text-indigo-400",
    button: "bg-indigo-500 text-white hover:bg-indigo-400",
    card: "bg-[#211C42]/80"
  }
};

const CATEGORIES = [
  { id: "ALL", label: "All Pods", icon: Globe },
  { id: "JEE", label: "JEE Main & Adv", icon: Sparkles },
  { id: "NEET", label: "NEET Medical", icon: Target },
  { id: "SAT", label: "SAT Digital", icon: Award },
  { id: "GRE", label: "GRE General", icon: BookOpen },
  { id: "FOUNDATION", label: "Foundation 9-11", icon: Users },
  { id: "SOLO", label: "Solo Deep Work", icon: Coffee }
];

export default function StudyRoomsPage() {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);

  // Student Profile Context
  const [profile, setProfile] = useState<any>(null);

  // Timer State
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);

  // Ambient Audio State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);

  // Modals & Panels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState<boolean>(false);
  const [rewardClaimedNotice, setRewardClaimedNotice] = useState<string | null>(null);

  // New Room Creation Form State
  const [newRoomForm, setNewRoomForm] = useState({
    title: "",
    topic: "",
    subject: "Physics",
    exam: "JEE Main 2027",
    category: "JEE" as StudyRoom["category"],
    durationMinutes: 25,
    goal: "",
    ambience: "silence" as StudyRoom["ambience"],
    theme: "forest" as StudyRoom["theme"],
    isPrivate: false,
    initialTasks: ""
  });

  // Room Customization State (for currently active or selected room)
  const [customForm, setCustomForm] = useState<Partial<StudyRoom>>({});
  const [newTaskInput, setNewTaskInput] = useState<string>("");

  // Fetch Rooms & Student Profile
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.rooms) {
        setRooms(data.rooms);
      }
    } catch (e) {
      console.error("Failed to load rooms:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchRooms();
    fetchProfile();
  }, []);

  // Sync Timer when Active Room changes
  useEffect(() => {
    if (activeRoom) {
      const initialSec = activeRoom.durationMinutes * 60;
      setTotalSeconds(initialSec);
      setSecondsLeft(initialSec);
      setIsRunning(true);
      setIsBreak(false);
      audioEngine.setAmbience(activeRoom.ambience || "silence");
      audioEngine.playChime(528);

      setCustomForm({
        title: activeRoom.title,
        topic: activeRoom.topic,
        subject: activeRoom.subject,
        exam: activeRoom.exam,
        category: activeRoom.category,
        durationMinutes: activeRoom.durationMinutes,
        goal: activeRoom.goal,
        ambience: activeRoom.ambience,
        theme: activeRoom.theme,
        notes: activeRoom.notes
      });
    } else {
      setIsRunning(false);
      audioEngine.stopAmbience();
    }
  }, [activeRoom?.id]);

  // Main Countdown Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Timer Finished!
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  // Handle Session Completion & Stars Award
  const handleTimerComplete = async () => {
    setIsRunning(false);
    audioEngine.playSuccessFanfare();

    if (activeRoom) {
      const durationMins = Math.round(totalSeconds / 60);
      try {
        const res = await fetch("/api/activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "focus",
            durationMinutes: durationMins,
            goal: activeRoom.goal
          })
        });
        const data = await res.json();
        if (data.success) {
          const starsEarned = data.starsEarned || 75;
          setRewardClaimedNotice(`🎉 Sprint Completed! +${starsEarned} BEYOND Stars awarded!`);
          window.dispatchEvent(new CustomEvent("beyond:activity-updated"));
          window.dispatchEvent(new CustomEvent("starBalanceUpdated"));
        }
      } catch (e) {
        setRewardClaimedNotice("🎉 Focus Sprint Finished! Great job staying in the zone.");
      }
    }
  };

  // Timer Controls
  const toggleTimer = () => {
    if (!isRunning) {
      audioEngine.playChime(660);
      if (activeRoom) {
        audioEngine.setAmbience(activeRoom.ambience || "silence");
      }
    } else {
      audioEngine.playChime(440);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    audioEngine.playChime(400);
  };

  const addFiveMinutes = () => {
    setSecondsLeft((prev) => prev + 300);
    setTotalSeconds((prev) => prev + 300);
    audioEngine.playChime(700);
  };

  const setPresetMinutes = (minutes: number) => {
    const sec = minutes * 60;
    setTotalSeconds(sec);
    setSecondsLeft(sec);
    setIsRunning(true);
    audioEngine.playChime(580);
  };

  // Toggle Mute / Volume
  const handleToggleMute = () => {
    const nextMuted = audioEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
  };

  // Save Customization
  const handleSaveCustomization = async () => {
    if (!activeRoom) return;

    try {
      const res = await fetch(`/api/rooms/${activeRoom.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...customForm
        })
      });
      const data = await res.json();
      if (data.success && data.room) {
        setActiveRoom(data.room);
        setRooms((prev) => prev.map((r) => (r.id === data.room.id ? data.room : r)));
        setIsCustomizeModalOpen(false);

        // If duration was changed, update timer
        if (customForm.durationMinutes && customForm.durationMinutes !== activeRoom.durationMinutes) {
          const newSec = customForm.durationMinutes * 60;
          setTotalSeconds(newSec);
          setSecondsLeft(newSec);
        }

        // If ambience was changed, update audio
        if (customForm.ambience && customForm.ambience !== activeRoom.ambience) {
          audioEngine.setAmbience(customForm.ambience);
        }

        audioEngine.playChime(750);
      }
    } catch (e) {
      console.error("Failed to save room customization:", e);
    }
  };

  // Task checklist handler inside active room
  const toggleTaskCompleted = async (taskId: string) => {
    if (!activeRoom) return;
    const updatedTasks = activeRoom.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const updatedRoom = { ...activeRoom, tasks: updatedTasks };
    setActiveRoom(updatedRoom);
    setRooms((prev) => prev.map((r) => (r.id === activeRoom.id ? updatedRoom : r)));

    // Sync to API
    try {
      await fetch(`/api/rooms/${activeRoom.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks })
      });
    } catch {}
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoom || !newTaskInput.trim()) return;

    const newTask: StudyRoomTask = {
      id: "task-" + Date.now(),
      text: newTaskInput.trim(),
      completed: false
    };

    const updatedTasks = [...activeRoom.tasks, newTask];
    const updatedRoom = { ...activeRoom, tasks: updatedTasks };
    setActiveRoom(updatedRoom);
    setRooms((prev) => prev.map((r) => (r.id === activeRoom.id ? updatedRoom : r)));
    setNewTaskInput("");

    try {
      await fetch(`/api/rooms/${activeRoom.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks })
      });
    } catch {}
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!activeRoom) return;
    const updatedTasks = activeRoom.tasks.filter((t) => t.id !== taskId);
    const updatedRoom = { ...activeRoom, tasks: updatedTasks };
    setActiveRoom(updatedRoom);
    setRooms((prev) => prev.map((r) => (r.id === activeRoom.id ? updatedRoom : r)));

    try {
      await fetch(`/api/rooms/${activeRoom.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updatedTasks })
      });
    } catch {}
  };

  // Create Room Handler
  const handleCreateRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedTasks: StudyRoomTask[] = newRoomForm.initialTasks
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t, idx) => ({ id: "t-" + idx, text: t, completed: false }));

      const payload = {
        title: newRoomForm.title || "🎯 Custom Focused Pod",
        topic: newRoomForm.topic || "Core Problem Solving",
        subject: newRoomForm.subject,
        exam: newRoomForm.exam,
        category: newRoomForm.category,
        durationMinutes: Number(newRoomForm.durationMinutes) || 25,
        goal: newRoomForm.goal || "Complete 10 focused problems",
        ambience: newRoomForm.ambience,
        theme: newRoomForm.theme,
        isPrivate: newRoomForm.isPrivate,
        tasks:
          parsedTasks.length > 0
            ? parsedTasks
            : [
                { id: "t1", text: "Read formulas and summary sheet", completed: false },
                { id: "t2", text: "Solve high-yield practice set", completed: false }
              ],
        hostName: profile?.fullName || "Krishna Addanki"
      };

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.room) {
        setRooms([data.room, ...rooms]);
        setActiveRoom(data.room);
        setIsCreateModalOpen(false);
        // Reset form
        setNewRoomForm({
          title: "",
          topic: "",
          subject: "Physics",
          exam: "JEE Main 2027",
          category: "JEE",
          durationMinutes: 25,
          goal: "",
          ambience: "silence",
          theme: "forest",
          isPrivate: false,
          initialTasks: ""
        });
      }
    } catch (e) {
      console.error("Failed to create pod:", e);
    }
  };

  // Format Time Helper
  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [secondsLeft]);

  // Progress Percent
  const progressPercent = useMemo(() => {
    if (totalSeconds <= 0) return 100;
    return Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100));
  }, [secondsLeft, totalSeconds]);

  // Filtered Rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchesCat = activeCategory === "ALL" || r.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.exam.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [rooms, activeCategory, searchQuery]);

  // Current Active Theme Styles
  const currentTheme = activeRoom ? THEME_STYLES[activeRoom.theme || "forest"] : THEME_STYLES.forest;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D4425]/15 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#252B18] flex items-center justify-center text-[#C8A95B] shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-accent font-bold text-2xl text-[#252B18]">
                  Quiet Collaborative Study Rooms
                </h1>
                <span className="text-[10px] uppercase font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  128+ Online
                </span>
              </div>
              <p className="text-xs text-[#69704A] mt-0.5">
                Join live peer pods across JEE, NEET, SAT, GRE & Foundation. Timed focus, ambient soundscapes, and +75 BEYOND Stars.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#252B18] text-[#F3EBDD] font-display font-bold text-xs uppercase tracking-wider hover:bg-[#3D4425] hover:shadow-md transition-all border border-[#C8A95B]/40"
          >
            <Plus className="w-4 h-4 text-[#C8A95B]" />
            <span>Create Study Pod</span>
          </button>
        </div>
      </div>

      {/* REWARD CLAIMED NOTIFICATION BANNER */}
      {rewardClaimedNotice && (
        <div className="bg-emerald-900/90 text-emerald-100 p-4 rounded-2xl border border-emerald-500/40 flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <p className="text-xs sm:text-sm font-semibold">{rewardClaimedNotice}</p>
          </div>
          <button
            onClick={() => setRewardClaimedNotice(null)}
            className="text-emerald-300 hover:text-white text-xs font-mono px-2 py-1 rounded bg-emerald-950/60"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE ROOM VIEW (WHEN USER IS INSIDE A ROOM) */}
      {/* ========================================================================= */}
      {activeRoom && (
        <div
          className={`${currentTheme.bg} text-[#F3EBDD] rounded-3xl p-6 sm:p-8 border ${currentTheme.border} shadow-2xl space-y-6 relative overflow-hidden transition-colors duration-500`}
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A95B]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Room Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-mono tracking-widest font-bold px-2 py-0.5 rounded-md border ${currentTheme.badge}`}>
                  {activeRoom.exam} • {activeRoom.subject}
                </span>
                {activeRoom.isPrivate ? (
                  <span className="text-[10px] font-mono text-amber-300/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Private Pod
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> Public Pod
                  </span>
                )}
                <span className="text-[10px] font-mono text-white/70">
                  Theme: <strong className="capitalize">{activeRoom.theme || "Forest"}</strong>
                </span>
              </div>
              <h2 className="font-accent font-bold text-2xl sm:text-3xl text-[#F3EBDD] flex items-center gap-2">
                {activeRoom.title}
              </h2>
              <p className="text-xs text-[#D9CAA8]/80 font-medium">
                Focus Topic: <strong>{activeRoom.topic}</strong> • Hosted by {activeRoom.hostName}
              </p>
            </div>

            {/* Room Controls Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Ambience Selector / Sound Controls */}
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={handleToggleMute}
                  title={isMuted ? "Unmute Ambience" : "Mute Ambience"}
                  className="p-1 text-white/80 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
                  <span className="text-[10px] font-mono uppercase text-[#C8A95B]">
                    {activeRoom.ambience === "rain" && "🌧️ Rain"}
                    {activeRoom.ambience === "binaural" && "🎧 40Hz"}
                    {activeRoom.ambience === "lofi" && "🎵 Lofi"}
                    {activeRoom.ambience === "cafe" && "☕ Cafe"}
                    {activeRoom.ambience === "silence" && "🤫 Silence"}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 h-1 accent-[#C8A95B] bg-white/20 rounded-lg cursor-pointer"
                    title="Ambience Volume"
                  />
                </div>
              </div>

              {/* Customize Room Button */}
              <button
                onClick={() => setIsCustomizeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-[#F3EBDD] transition-all"
                title="Customize room parameters & soundscape"
              >
                <Sliders className="w-3.5 h-3.5 text-[#C8A95B]" />
                <span>Customize Room</span>
              </button>

              {/* Leave Room Button */}
              <button
                onClick={() => setActiveRoom(null)}
                className="px-3.5 py-1.5 rounded-xl border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 text-xs font-bold transition-all"
              >
                Leave Pod
              </button>
            </div>
          </div>

          {/* MAIN ROOM WORKSPACE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT 7 COLS: WORKING TIMER & FOCUS TARGET */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* The Working Timer Card */}
              <div className={`${currentTheme.card} rounded-2xl p-6 border border-white/10 shadow-inner space-y-5 relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${currentTheme.accentText}`} />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-white/90">
                      Live Focus Sprint
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isRunning ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40" : "bg-amber-900/60 text-amber-300 border border-amber-500/40"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                      {isRunning ? "Ticking Active" : "Paused"}
                    </span>
                  </div>
                </div>

                {/* Big Digital Clock Display */}
                <div className={`${currentTheme.timerBg} py-7 px-4 rounded-2xl border border-white/10 text-center relative overflow-hidden group shadow-2xl`}>
                  <div className="text-5xl sm:text-7xl font-mono font-black tracking-widest text-[#F3EBDD] select-none">
                    {formattedTime}
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="mt-4 max-w-sm mx-auto bg-white/10 h-2 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-[#C8A95B] to-amber-400 transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-white/60 flex items-center justify-center gap-3">
                    <span>{Math.round(progressPercent)}% elapsed</span>
                    <span>•</span>
                    <span>Target: {Math.round(totalSeconds / 60)} min block</span>
                  </div>
                </div>

                {/* Timer Controls Row */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={toggleTimer}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm shadow-md transition-all ${
                      isRunning
                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                        : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause Focus</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Start Working</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={addFiveMinutes}
                    className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold text-amber-300 transition-all"
                    title="Add 5 more minutes of crunch time"
                  >
                    <span>+5 Min Boost</span>
                  </button>

                  <button
                    onClick={handleTimerComplete}
                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all border border-emerald-400/30"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Claim Stars (+75)</span>
                  </button>
                </div>

                {/* Quick Preset Mode Selector */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <span className="text-[11px] font-mono text-white/60">Quick Presets:</span>
                  <div className="flex items-center gap-1.5">
                    {[15, 25, 45, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setPresetMinutes(mins)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          Math.round(totalSeconds / 60) === mins
                            ? "bg-[#C8A95B] text-[#252B18] shadow-sm"
                            : "bg-white/5 hover:bg-white/10 text-white/70"
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Session Goal Banner */}
              <div className={`${currentTheme.card} rounded-2xl p-4 border border-white/10 space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D9CAA8]">
                    <Target className="w-4 h-4 text-[#C8A95B]" />
                    <span>Session Target Goal:</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Verified Milestone</span>
                </div>
                <p className="text-xs sm:text-sm text-[#F3EBDD] bg-black/40 p-3 rounded-xl border border-white/10 leading-relaxed font-mono">
                  {activeRoom.goal}
                </p>
                {activeRoom.notes && (
                  <div className="text-[11px] text-amber-200/80 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                    <strong>Study Tip:</strong> {activeRoom.notes}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT 5 COLS: TASK CHECKLIST & PARTICIPANTS */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Task Checklist Panel */}
              <div className={`${currentTheme.card} rounded-2xl p-5 border border-white/10 space-y-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C8A95B]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Session Checklist ({activeRoom.tasks.filter((t) => t.completed).length}/{activeRoom.tasks.length})</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/60">Real-Time Progress</span>
                </div>

                {/* Task Items List */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {activeRoom.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskCompleted(task.id)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        task.completed
                          ? "bg-emerald-950/40 border-emerald-500/30 text-white/60"
                          : "bg-black/30 border-white/10 hover:border-[#C8A95B]/40 text-[#F3EBDD]"
                      }`}
                    >
                      <button className="mt-0.5 shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                        ) : (
                          <Circle className="w-4 h-4 text-white/40" />
                        )}
                      </button>
                      <span className={`text-xs leading-snug flex-1 ${task.completed ? "line-through text-white/50" : ""}`}>
                        {task.text}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="text-white/30 hover:text-rose-400 text-xs px-1"
                        title="Delete task"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Task Input Form */}
                <form onSubmit={handleAddTask} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add step or problem..."
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8A95B]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#C8A95B] text-[#252B18] font-bold text-xs hover:bg-[#E8DCC3] transition-all"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Pod Peers Active List */}
              <div className={`${currentTheme.card} rounded-2xl p-5 border border-white/10 space-y-3`}>
                <div className="flex items-center justify-between text-xs font-bold text-[#C8A95B]">
                  <span>Pod Scholars ({activeRoom.activeCount}/{activeRoom.maxCount})</span>
                  <Users className="w-4 h-4" />
                </div>

                <div className="space-y-2 text-xs">
                  {/* Host */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#C8A95B] text-[#252B18] font-bold text-[10px] flex items-center justify-center font-mono">
                        {activeRoom.hostName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-white">{activeRoom.hostName}</span>
                      <span className="text-[9px] bg-[#C8A95B]/20 text-[#C8A95B] px-1.5 py-0.2 rounded font-mono">Host</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      In Zone
                    </span>
                  </div>

                  {/* Current Student (You) */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-emerald-500/40">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                        KA
                      </div>
                      <span className="font-semibold text-white">Krishna Addanki (You)</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Focusing</span>
                  </div>

                  {/* Seed Peers */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/20 border border-white/5 text-white/80">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 text-[10px] flex items-center justify-center font-mono">
                        SM
                      </div>
                      <span>Siddharth M.</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Focusing</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/20 border border-white/5 text-white/80">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 text-[10px] flex items-center justify-center font-mono">
                        AR
                      </div>
                      <span>Ananya R.</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Focusing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FILTER TABS & SEARCH BAR */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              const count =
                cat.id === "ALL"
                  ? rooms.length
                  : rooms.filter((r) => r.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#252B18] text-[#F3EBDD] shadow-sm font-bold"
                      : "bg-[#F8F4EC] text-[#69704A] hover:bg-[#E8DCC3] hover:text-[#252B18] border border-[#3D4425]/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-[#3D4425] text-[#C8A95B]" : "bg-black/5 text-[#69704A]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#69704A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics or exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[#F8F4EC] border border-[#3D4425]/20 focus:border-[#252B18] focus:outline-none text-[#252B18] placeholder:text-[#69704A]/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#69704A] hover:text-black"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROOMS CATALOG CARDS GRID */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-accent font-bold text-xl text-[#252B18]">
            Available Study Pods ({filteredRooms.length})
          </h2>
          <span className="text-xs text-[#69704A] font-mono">
            Silent peer focus • 45m / 60m / 90m Blocks
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-[#F8F4EC] rounded-3xl border border-[#3D4425]/15 p-8 space-y-4">
            <Users className="w-10 h-10 text-[#69704A] mx-auto opacity-50" />
            <h3 className="font-accent font-bold text-lg text-[#252B18]">No matching study pods found</h3>
            <p className="text-xs text-[#69704A] max-w-sm mx-auto">
              Try adjusting your exam category filter or create a custom study room right now.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#252B18] text-[#F3EBDD] text-xs font-bold font-display uppercase tracking-wider"
            >
              Create This Pod Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => {
              const isCurrentActive = activeRoom?.id === room.id;
              const completedTasks = room.tasks.filter((t) => t.completed).length;

              return (
                <div
                  key={room.id}
                  className={`bg-[#F8F4EC] border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden ${
                    isCurrentActive
                      ? "border-[#252B18] ring-2 ring-[#252B18]/20 bg-[#F0EDE4]"
                      : "border-[#3D4425]/20 hover:border-[#C8A95B]"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#252B18] text-[#C8A95B]">
                          {room.exam}
                        </span>
                        <span className="text-[10px] font-mono text-[#69704A] bg-[#E8DCC3]/80 px-2 py-0.5 rounded">
                          {room.subject}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{room.activeCount}/{room.maxCount}</span>
                      </div>
                    </div>

                    {/* Room Title & Topic */}
                    <div>
                      <h3 className="font-display font-bold text-base text-[#252B18] group-hover:text-[#3D4425] line-clamp-1">
                        {room.title}
                      </h3>
                      <p className="text-xs text-[#69704A] font-medium line-clamp-2 mt-0.5">
                        {room.topic}
                      </p>
                    </div>

                    {/* Goal Card */}
                    <div className="bg-[#E8DCC3]/60 p-2.5 rounded-xl text-[11px] text-[#3D4425] border border-[#3D4425]/10 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#69704A] font-bold">
                        <span>🎯 Pod Goal</span>
                        <span>{completedTasks}/{room.tasks.length} tasks ready</span>
                      </div>
                      <p className="line-clamp-2 font-medium">{room.goal}</p>
                    </div>

                    {/* Soundscape and Host */}
                    <div className="flex items-center justify-between text-[11px] text-[#69704A]">
                      <span className="flex items-center gap-1 font-mono">
                        <Headphones className="w-3 h-3 text-[#3D4425]" />
                        <span className="capitalize">{room.ambience}</span>
                      </span>
                      <span className="text-[10px] font-mono">Host: {room.hostName.split(" ")[0]}</span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 mt-2 border-t border-[#3D4425]/10 flex items-center justify-between">
                    <span className="text-xs text-[#3D4425] font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C8A95B]" />
                      <span>{room.durationMinutes}m sprint</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveRoom(room);
                          setIsCustomizeModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#3D4425]/20 text-[#3D4425] hover:bg-[#E8DCC3] transition-colors"
                        title="Customize room before entering"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveRoom(room)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          isCurrentActive
                            ? "bg-[#C8A95B] text-[#252B18]"
                            : "bg-[#252B18] text-[#F3EBDD] hover:bg-[#3D4425]"
                        }`}
                      >
                        <span>{isCurrentActive ? "Focusing" : "Enter Pod"}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CUSTOMIZE ROOM MODAL */}
      {/* ========================================================================= */}
      {isCustomizeModalOpen && activeRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#252B18] text-[#F3EBDD] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#C8A95B]/40 shadow-2xl space-y-5 relative my-8">
            <div className="flex items-center justify-between border-b border-[#69704A]/30 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C8A95B] font-bold">
                  Pod Configuration
                </span>
                <h3 className="font-accent font-bold text-2xl text-[#F3EBDD]">
                  Customize Study Room
                </h3>
              </div>
              <button
                onClick={() => setIsCustomizeModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Room Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D9CAA8]">Room Title</label>
                <input
                  type="text"
                  value={customForm.title || ""}
                  onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                  className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                />
              </div>

              {/* Exam & Subject */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#D9CAA8]">Exam Target</label>
                  <select
                    value={customForm.exam || "JEE Main"}
                    onChange={(e) => setCustomForm({ ...customForm, exam: e.target.value })}
                    className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                  >
                    <option value="JEE Main 2027">JEE Main 2027</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="NEET-UG 2027">NEET-UG 2027</option>
                    <option value="SAT Digital">SAT Digital</option>
                    <option value="GRE General">GRE General</option>
                    <option value="Foundation / Boards">Foundation / Boards</option>
                    <option value="Personal Deep Work">Personal Deep Work</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#D9CAA8]">Subject Area</label>
                  <input
                    type="text"
                    value={customForm.subject || ""}
                    onChange={(e) => setCustomForm({ ...customForm, subject: e.target.value })}
                    placeholder="e.g. Physics, Quantitative"
                    className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                  />
                </div>
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D9CAA8]">Focus Topic</label>
                <input
                  type="text"
                  value={customForm.topic || ""}
                  onChange={(e) => setCustomForm({ ...customForm, topic: e.target.value })}
                  placeholder="e.g. Projectile Motion, Integral Calculus"
                  className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                />
              </div>

              {/* Target Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D9CAA8]">Session Target Goal</label>
                <textarea
                  rows={2}
                  value={customForm.goal || ""}
                  onChange={(e) => setCustomForm({ ...customForm, goal: e.target.value })}
                  placeholder="Specific actionable milestone to accomplish during this timer..."
                  className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                />
              </div>

              {/* Timer Duration Slider */}
              <div className="space-y-2 bg-[#1B2011] p-3.5 rounded-2xl border border-[#69704A]/30">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-[#D9CAA8]">Timer Duration:</label>
                  <span className="font-mono font-bold text-[#C8A95B] bg-[#252B18] px-2.5 py-0.5 rounded border border-[#69704A]/30">
                    {customForm.durationMinutes || 25} Minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={customForm.durationMinutes || 25}
                  onChange={(e) => setCustomForm({ ...customForm, durationMinutes: parseInt(e.target.value) })}
                  className="w-full accent-[#C8A95B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/50">
                  <span>10m (Sprint)</span>
                  <span>25m (Pomodoro)</span>
                  <span>45m (Exam block)</span>
                  <span>90m (Marathon)</span>
                </div>
              </div>

              {/* Soundscape Ambience */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#D9CAA8]">Soundscape Ambience</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "silence", label: "🤫 Silence", desc: "No audio" },
                    { id: "rain", label: "🌧️ Rain", desc: "Pink noise" },
                    { id: "binaural", label: "🎧 40Hz Beta", desc: "Gamma focus" },
                    { id: "lofi", label: "🎵 Lofi Chord", desc: "174Hz calm" },
                    { id: "cafe", label: "☕ Warm Cafe", desc: "Coffeehouse" }
                  ].map((amb) => (
                    <button
                      key={amb.id}
                      type="button"
                      onClick={() => setCustomForm({ ...customForm, ambience: amb.id as any })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        customForm.ambience === amb.id
                          ? "bg-[#C8A95B] text-[#252B18] font-bold border-[#C8A95B]"
                          : "bg-[#1B2011] text-white/80 border-[#69704A]/30 hover:border-white/30"
                      }`}
                    >
                      <div className="text-xs font-semibold">{amb.label}</div>
                      <div className="text-[10px] opacity-70">{amb.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Theme Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#D9CAA8]">Visual Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "forest", label: "Emerald Zen", color: "bg-[#252B18] border-emerald-500" },
                    { id: "midnight", label: "Cyber Onyx", color: "bg-[#0F172A] border-cyan-400" },
                    { id: "amber", label: "Amber Study", color: "bg-[#261A10] border-amber-500" },
                    { id: "indigo", label: "Cosmic Indigo", color: "bg-[#15122B] border-indigo-400" }
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCustomForm({ ...customForm, theme: theme.id as any })}
                      className={`p-2 rounded-xl border text-center text-xs transition-all ${theme.color} ${
                        customForm.theme === theme.id ? "ring-2 ring-white font-bold" : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="text-white font-semibold text-[11px]">{theme.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#69704A]/30 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomization}
                className="px-5 py-2 rounded-xl bg-[#C8A95B] text-[#252B18] font-bold text-xs hover:bg-[#E8DCC3] transition-all shadow-md"
              >
                Apply & Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE NEW STUDY POD MODAL */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#252B18] text-[#F3EBDD] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#C8A95B]/40 shadow-2xl space-y-5 relative my-8">
            <div className="flex items-center justify-between border-b border-[#69704A]/30 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C8A95B] font-bold">
                  Host A Study Room
                </span>
                <h3 className="font-accent font-bold text-2xl text-[#F3EBDD]">
                  Create New Study Pod
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D9CAA8]">Pod Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ⚡ JEE Physics Electromagnetism Sprint"
                  value={newRoomForm.title}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, title: e.target.value })}
                  className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#D9CAA8]">Exam Target</label>
                  <select
                    value={newRoomForm.exam}
                    onChange={(e) => {
                      const exam = e.target.value;
                      let cat: StudyRoom["category"] = "JEE";
                      if (exam.includes("NEET")) cat = "NEET";
                      else if (exam.includes("SAT")) cat = "SAT";
                      else if (exam.includes("GRE")) cat = "GRE";
                      else if (exam.includes("Foundation")) cat = "FOUNDATION";
                      else if (exam.includes("Solo")) cat = "SOLO";
                      setNewRoomForm({ ...newRoomForm, exam, category: cat });
                    }}
                    className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                  >
                    <option value="JEE Main 2027">JEE Main 2027</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="NEET-UG 2027">NEET-UG 2027</option>
                    <option value="SAT Digital">SAT Digital</option>
                    <option value="GRE General">GRE General</option>
                    <option value="Foundation Class 11">Foundation Class 11</option>
                    <option value="Solo Deep Work">Solo Deep Work</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#D9CAA8]">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics, Chemistry, Math"
                    value={newRoomForm.subject}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, subject: e.target.value })}
                    className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D9CAA8]">Focus Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotational Dynamics & Center of Mass"
                  value={newRoomForm.topic}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, topic: e.target.value })}
                  className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D9CAA8]">Session Target Goal *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Complete 15 numericals and write key formula derivations"
                  value={newRoomForm.goal}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, goal: e.target.value })}
                  className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                />
              </div>

              {/* Duration & Ambience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#D9CAA8]">Sprint Duration</label>
                  <select
                    value={newRoomForm.durationMinutes}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                  >
                    <option value="15">15 Minutes (Micro Sprint)</option>
                    <option value="25">25 Minutes (Pomodoro)</option>
                    <option value="45">45 Minutes (Power Sprint)</option>
                    <option value="60">60 Minutes (Full Exam Block)</option>
                    <option value="90">90 Minutes (Deep Flow Block)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#D9CAA8]">Ambience Audio</label>
                  <select
                    value={newRoomForm.ambience}
                    onChange={(e) => setNewRoomForm({ ...newRoomForm, ambience: e.target.value as any })}
                    className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B]"
                  >
                    <option value="silence">🤫 Absolute Silence</option>
                    <option value="rain">🌧️ Gentle Rain</option>
                    <option value="binaural">🎧 40Hz Binaural Beat</option>
                    <option value="lofi">🎵 Warm Lofi Chords</option>
                    <option value="cafe">☕ Coffeehouse Murmur</option>
                  </select>
                </div>
              </div>

              {/* Tasks List (One per line) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#D9CAA8]">
                  Initial Tasks Checklist <span className="text-[10px] text-white/50 font-normal">(One per line)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Review core formulas&#10;Solve questions 1-10&#10;Self-grade and log mistakes"
                  value={newRoomForm.initialTasks}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, initialTasks: e.target.value })}
                  className="w-full bg-[#1B2011] border border-[#69704A]/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C8A95B] font-mono"
                />
              </div>

              {/* Privacy Setting */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPrivateCheck"
                  checked={newRoomForm.isPrivate}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, isPrivate: e.target.checked })}
                  className="w-4 h-4 accent-[#C8A95B] rounded cursor-pointer"
                />
                <label htmlFor="isPrivateCheck" className="text-xs text-white/90 cursor-pointer">
                  Make this a <strong>Private Solo Pod</strong> (only you can enter)
                </label>
              </div>

              <div className="pt-3 border-t border-[#69704A]/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C8A95B] text-[#252B18] font-bold text-xs hover:bg-[#E8DCC3] transition-all shadow-md font-display uppercase tracking-wider"
                >
                  Launch Study Pod
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

