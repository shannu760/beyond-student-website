"use client";

import { WAITING_ROOM } from "@/lib/data";

const MINI_GAMES = [
  { name: "Ludo", emoji: "🎲", color: "bg-red-500/20 text-red-400" },
  { name: "Quick Puzzle", emoji: "🧩", color: "bg-blue-500/20 text-blue-400" },
  { name: "Memory Game", emoji: "🧠", color: "bg-purple-500/20 text-purple-400" },
  { name: "Reaction", emoji: "⚡", color: "bg-yellow-500/20 text-yellow-400" },
];

export default function WaitingRoomPage() {
  const progress = ((WAITING_ROOM.nowServing - (WAITING_ROOM.yourNumber - 5)) / 5) * 100;

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Header */}
        <p className="text-gold text-xs font-semibold uppercase tracking-[3px] mb-4">
          Digital Waiting Room
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-8">
          Your barber will be ready soon.
        </h1>

        {/* Status Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-2">
                Your Number
              </p>
              <p className="text-5xl font-bold text-gold font-mono">
                #{WAITING_ROOM.yourNumber}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-2">
                Now Serving
              </p>
              <p className="text-5xl font-bold text-text-primary font-mono">
                #{WAITING_ROOM.nowServing}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full h-2 bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-elevated rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-1">
                Estimated Wait
              </p>
              <p className="text-2xl font-bold text-text-primary">{WAITING_ROOM.estimatedWait}</p>
            </div>
            <div className="bg-elevated rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-text-muted mb-1">
                Your Barber
              </p>
              <p className="text-2xl font-bold text-gold">{WAITING_ROOM.assignedBarber}</p>
            </div>
          </div>
        </div>

        {/* Mini Games */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Play while you wait
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {MINI_GAMES.map((game) => (
              <button
                key={game.name}
                className={`${game.color} rounded-xl p-6 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200`}
              >
                <span className="text-3xl">{game.emoji}</span>
                <span className="text-sm font-semibold">{game.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
