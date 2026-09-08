import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMeditationTimer } from "./useMeditationTimer";

describe("useMeditationTimer — session completion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onComplete exactly once when the countdown naturally reaches zero", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMeditationTimer(onComplete));

    act(() => result.current.selectDuration(3));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3 * 60_000 + 1000));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(3);
    expect(result.current.status).toBe("finished");
  });

  it("does not duplicate the completion across rerenders observing the finished state", () => {
    const onComplete = vi.fn();
    const { result, rerender } = renderHook(() => useMeditationTimer(onComplete));

    act(() => result.current.selectDuration(3));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3 * 60_000 + 1000));
    rerender();
    rerender();

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("does not fire onComplete on pause", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMeditationTimer(onComplete));

    act(() => result.current.selectDuration(3));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000));
    act(() => result.current.pause());

    expect(onComplete).not.toHaveBeenCalled();
  });

  it("does not fire onComplete on resume", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMeditationTimer(onComplete));

    act(() => result.current.selectDuration(3));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000));
    act(() => result.current.pause());
    act(() => result.current.resume());

    expect(onComplete).not.toHaveBeenCalled();
  });

  it("does not fire onComplete on reset", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMeditationTimer(onComplete));

    act(() => result.current.selectDuration(3));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000));
    act(() => result.current.reset());

    expect(onComplete).not.toHaveBeenCalled();
  });

  it("does not fire onComplete on duration selection/change alone", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMeditationTimer(onComplete));

    act(() => result.current.selectDuration(3));
    act(() => result.current.selectDuration(7));

    expect(onComplete).not.toHaveBeenCalled();
  });

  it("does not fire onComplete when closed (unmounted) mid-session", () => {
    const onComplete = vi.fn();
    const { result, unmount } = renderHook(() => useMeditationTimer(onComplete));

    act(() => result.current.selectDuration(3));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000));
    unmount();
    act(() => vi.advanceTimersByTime(3 * 60_000));

    expect(onComplete).not.toHaveBeenCalled();
  });

  it("fires again for a genuinely new session after a prior completion", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMeditationTimer(onComplete));

    act(() => result.current.selectDuration(3));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3 * 60_000 + 1000));
    expect(onComplete).toHaveBeenCalledTimes(1);

    act(() => result.current.reset());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3 * 60_000 + 1000));

    expect(onComplete).toHaveBeenCalledTimes(2);
  });
});
