"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface RealtimeRoomMember {
  id: string;
  roomId: string;
  userId: string;
  activeGoal: string;
  joinedAt: string;
  minutesActive: number;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface RealtimeRoom {
  id: string;
  name: string;
  topic: string;
  timerMinutes: number;
  isLive: boolean;
  maxCapacity: number;
  members: RealtimeRoomMember[];
  createdAt: string;
}

export function useStudyRoomRealtime(roomId: string | null) {
  const [room, setRoom] = useState<RealtimeRoom | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      return;
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const subscribe = async () => {
      try {
        channel = supabase
          .channel(`study-room-${roomId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "RoomMember",
              filter: `roomId=eq.${roomId}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setRoom((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    members: [...prev.members, payload.new as RealtimeRoomMember],
                  };
                });
              } else if (payload.eventType === "DELETE") {
                setRoom((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    members: prev.members.filter((m) => m.id !== payload.old.id),
                  };
                });
              } else if (payload.eventType === "UPDATE") {
                setRoom((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    members: prev.members.map((m) =>
                      m.id === payload.new.id ? (payload.new as RealtimeRoomMember) : m
                    ),
                  };
                });
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "StudyRoom",
              filter: `id=eq.${roomId}`,
            },
            (payload) => {
              setRoom((prev) => {
                if (!prev) return prev;
                return { ...prev, ...payload.new };
              });
            }
          )
          .subscribe((status) => {
            setIsConnected(status === "SUBSCRIBED");
            if (status === "CHANNEL_ERROR") {
              setError("Failed to connect to realtime");
            }
          });

        const { data } = await supabase
          .from("StudyRoom")
          .select(`
            *,
            members: RoomMember (
              *,
              user: User (id, name, avatarUrl)
            )
          `)
          .eq("id", roomId)
          .single();

        if (data) {
          setRoom(data as RealtimeRoom);
        }
      } catch (err) {
        console.error("Error subscribing to room:", err);
        setError("Failed to load room");
      }
    };

    subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, [roomId]);

  const updateGoal = useCallback(
    async (goal: string) => {
      if (!roomId) return;
      const { error } = await supabase
        .from("RoomMember")
        .update({ activeGoal: goal })
        .eq("roomId", roomId)
        .eq("userId", (await supabase.auth.getUser()).data.user?.id);
      if (error) console.error("Error updating goal:", error);
    },
    [roomId]
  );

  const updateMinutesActive = useCallback(
    async (minutes: number) => {
      if (!roomId) return;
      const { error } = await supabase
        .from("RoomMember")
        .update({ minutesActive: minutes })
        .eq("roomId", roomId)
        .eq("userId", (await supabase.auth.getUser()).data.user?.id);
      if (error) console.error("Error updating minutes:", error);
    },
    [roomId]
  );

  return { room, isConnected, error, updateGoal, updateMinutesActive };
}

export function useStudyRoomsList() {
  const [rooms, setRooms] = useState<RealtimeRoom[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const subscribe = async () => {
      try {
        channel = supabase
          .channel("study-rooms-list")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "StudyRoom",
              filter: "isLive=eq.true",
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setRooms((prev) => [payload.new as RealtimeRoom, ...prev]);
              } else if (payload.eventType === "DELETE") {
                setRooms((prev) => prev.filter((r) => r.id !== payload.old.id));
              } else if (payload.eventType === "UPDATE") {
                setRooms((prev) =>
                  prev.map((r) => (r.id === payload.new.id ? { ...r, ...payload.new } : r))
                );
              }
            }
          )
          .subscribe((status) => {
            setIsConnected(status === "SUBSCRIBED");
          });

        const { data } = await supabase
          .from("StudyRoom")
          .select(`
            *,
            members: RoomMember (
              *,
              user: User (id, name, avatarUrl)
            )
          `)
          .eq("isLive", true)
          .order("createdAt", { ascending: false });

        if (data) {
          setRooms(data as RealtimeRoom[]);
        }
      } catch (err) {
        console.error("Error subscribing to rooms list:", err);
      }
    };

    subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, []);

  return { rooms, isConnected };
}