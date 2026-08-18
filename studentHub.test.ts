import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  listDeadlines: vi.fn(),
  getStudentProfile: vi.fn(),
}));

const user = {
  id: 1,
  openId: "student-test-user",
  email: "student@example.com",
  name: "Test Student",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createCaller() {
  const ctx = {
    user,
    req: { protocol: "https", headers: {} },
    res: { clearCookie: vi.fn() },
  } as unknown as TrpcContext;
  return appRouter.createCaller(ctx);
}

describe("Student Survival Hub input safeguards", () => {
  it("returns null rather than an invalid undefined response for a first-time student profile", async () => {
    vi.mocked(db.getStudentProfile).mockResolvedValue(undefined);
    const caller = createCaller();

    await expect(caller.hub.profile.get()).resolves.toBeNull();
  });

  it("rejects a timetable entry that ends before it starts", async () => {
    const caller = createCaller();
    await expect(caller.hub.timetable.create({
      dayOfWeek: "Monday",
      startTime: "14:00",
      endTime: "12:00",
      subject: "Data Structures",
      room: "B-204",
      color: "mint",
    })).rejects.toThrow("End time must be later than start time");
  });

  it("rejects an unsupported note file type before attempting an upload", async () => {
    const caller = createCaller();
    await expect(caller.hub.notes.upload({
      title: "Revision notes",
      subject: "Calculus",
      category: "Lecture notes",
      fileName: "notes.exe",
      mimeType: "application/x-msdownload",
      fileData: "aGVsbG8=",
    })).rejects.toThrow("Please upload a PDF, Word document, or text file");
  });

  it("passes deadline status and priority filters to the data layer", async () => {
    vi.mocked(db.listDeadlines).mockResolvedValue([] as never);
    const caller = createCaller();

    await caller.hub.deadlines.list({ status: "pending", priority: "high" });

    expect(db.listDeadlines).toHaveBeenCalledWith(1, { status: "pending", priority: "high" });
  });
});
