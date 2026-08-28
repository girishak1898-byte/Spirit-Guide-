"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MeditationDuration, MeditationStatus } from "@/lib/meditation/meditationContent";

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Timestamp-based countdown — remaining time is always derived from a
 * stored end timestamp vs. Date.now(), never decremented one second at a
 * time. That's what keeps it accurate across backgrounded/throttled tabs
 * (docs/IMPLEMENTATION-PLAN.md Phase 5 gate: "timer accuracy under
 * tab-visibility changes"), and a visibilitychange listener forces an
 * immediate recompute the instant the tab regains focus rather than
 * waiting for the next 1s tick.
 *
 * `announcement` is set only on meaningful transitions (start/pause/
 * resume/finish/reset) for aria-live — never per-second, per this phase's
 * required correction.
 */
export function useMeditationTimer() {
  const [status, setStatus] = useState<MeditationStatus>("idle");
  const [durationMinutes, setDurationMinutes] = useState<MeditationDuration | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const endTimestampRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    if (endTimestampRef.current === null) return;
    const remaining = Math.max(0, Math.round((endTimestampRef.current - Date.now()) / 1000));
    setRemainingSeconds(remaining);
    if (remaining <= 0) {
      clearTick();
      endTimestampRef.current = null;
      setStatus("finished");
      setAnnouncement("Meditation complete.");
    }
  }, []);

  const selectDuration = useCallback((duration: MeditationDuration) => {
    setDurationMinutes(duration);
    setRemainingSeconds(duration * 60);
  }, []);

  const start = useCallback(() => {
    setDurationMinutes((current) => {
      if (!current) return current;
      endTimestampRef.current = Date.now() + current * 60_000;
      setStatus("running");
      setAnnouncement("Meditation started.");
      clearTick();
      intervalRef.current = setInterval(tick, 1000);
      return current;
    });
  }, [tick]);

  const pause = useCallback(() => {
    setStatus((current) => {
      if (current !== "running" || endTimestampRef.current === null) return current;
      const remaining = Math.max(0, Math.round((endTimestampRef.current - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      endTimestampRef.current = null;
      clearTick();
      setAnnouncement("Meditation paused.");
      return "paused";
    });
  }, []);

  const resume = useCallback(() => {
    setStatus((current) => {
      if (current !== "paused") return current;
      setRemainingSeconds((remaining) => {
        endTimestampRef.current = Date.now() + remaining * 1000;
        return remaining;
      });
      setAnnouncement("Meditation resumed.");
      clearTick();
      intervalRef.current = setInterval(tick, 1000);
      return "running";
    });
  }, [tick]);

  /** Session reset — returns to pre-session idle, same duration still selected. */
  const reset = useCallback(() => {
    clearTick();
    endTimestampRef.current = null;
    setStatus("idle");
    setDurationMinutes((duration) => {
      setRemainingSeconds(duration ? duration * 60 : 0);
      return duration;
    });
    setAnnouncement("Meditation reset.");
  }, []);

  /** Full wipe — used when the overlay closes, so reopening without a handoff starts genuinely clean. */
  const clear = useCallback(() => {
    clearTick();
    endTimestampRef.current = null;
    setStatus("idle");
    setDurationMinutes(null);
    setRemainingSeconds(0);
    setAnnouncement("");
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [tick]);

  useEffect(() => () => clearTick(), []);

  return { status, durationMinutes, remainingSeconds, announcement, selectDuration, start, pause, resume, reset, clear };
}
