import { afterEach, describe, expect, it } from "vitest";
import { readSessionHistory, recordCompletedSession } from "./localStorageService";

describe("session history storage (sg.sessions.v1)", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("defaults to an empty history", () => {
    expect(readSessionHistory()).toEqual({ totalCompleted: 0, records: [] });
  });

  it("appends a completed session and increments totalCompleted", () => {
    recordCompletedSession(7);
    const history = readSessionHistory();
    expect(history.totalCompleted).toBe(1);
    expect(history.records).toHaveLength(1);
    expect(history.records[0]).toMatchObject({ durationMinutes: 7 });
    expect(typeof history.records[0]!.id).toBe("string");
    expect(typeof history.records[0]!.completedAt).toBe("string");
  });

  it("keeps only the latest 50 records, newest first", () => {
    for (let i = 0; i < 55; i++) recordCompletedSession(3);
    const history = readSessionHistory();
    expect(history.records).toHaveLength(50);
  });

  it("keeps totalCompleted accurate beyond the 50-record cap", () => {
    for (let i = 0; i < 55; i++) recordCompletedSession(3);
    expect(readSessionHistory().totalCompleted).toBe(55);
  });

  it("enforces the cap on read even if storage holds more than 50 records", () => {
    const records = Array.from({ length: 55 }, (_, i) => ({
      id: `seed-${i}`,
      durationMinutes: 3,
      completedAt: new Date(0).toISOString(),
    }));
    window.localStorage.setItem("sg.sessions.v1", JSON.stringify({ totalCompleted: 55, records }));
    const history = readSessionHistory();
    expect(history.records).toHaveLength(50);
    expect(history.totalCompleted).toBe(55);

    const raw = JSON.parse(window.localStorage.getItem("sg.sessions.v1")!);
    expect(raw.records).toHaveLength(50);
  });

  it("recovers safely from corrupted storage without fabricating data", () => {
    window.localStorage.setItem("sg.sessions.v1", "{not valid json");
    expect(readSessionHistory()).toEqual({ totalCompleted: 0, records: [] });
  });

  it("recovers safely from a validly-shaped-but-wrong value", () => {
    window.localStorage.setItem("sg.sessions.v1", JSON.stringify({ totalCompleted: "3", records: "nope" }));
    expect(readSessionHistory()).toEqual({ totalCompleted: 0, records: [] });
  });
});
