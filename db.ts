import { and, asc, count, desc, eq, gte, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  deadlines,
  InsertUser,
  lostFoundPosts,
  notes,
  studentProfiles,
  studyGroupMembers,
  studyGroups,
  timetableEntries,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database connection is not available");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getStudentProfile(userId: number) {
  const db = await requireDb();
  return (await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1))[0];
}

export async function saveStudentProfile(userId: number, input: { fullName: string; university: string; department: string; semester: string }) {
  const db = await requireDb();
  await db.insert(studentProfiles).values({ userId, ...input }).onDuplicateKeyUpdate({ set: { ...input } });
  return getStudentProfile(userId);
}

export async function getDashboardData(userId: number) {
  const db = await requireDb();
  const now = new Date();
  const [profile, upcomingDeadlines, timetable, recentNotes] = await Promise.all([
    getStudentProfile(userId),
    db.select().from(deadlines).where(and(eq(deadlines.userId, userId), eq(deadlines.status, "pending"), gte(deadlines.dueAt, now))).orderBy(asc(deadlines.dueAt)).limit(5),
    db.select().from(timetableEntries).where(eq(timetableEntries.userId, userId)).orderBy(asc(timetableEntries.startTime)),
    db.select().from(notes).orderBy(desc(notes.createdAt)).limit(5),
  ]);
  return { profile, upcomingDeadlines, timetable, recentNotes };
}

export async function listNotes(filter: { query?: string; subject?: string; category?: string }) {
  const db = await requireDb();
  const conditions = [
    filter.subject ? eq(notes.subject, filter.subject) : undefined,
    filter.category ? eq(notes.category, filter.category) : undefined,
    filter.query ? or(like(notes.title, `%${filter.query}%`), like(notes.subject, `%${filter.query}%`), like(notes.description, `%${filter.query}%`)) : undefined,
  ].filter(Boolean);
  return db.select().from(notes).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(notes.createdAt)).limit(100);
}

export async function createNote(userId: number, input: Omit<typeof notes.$inferInsert, "id" | "userId" | "createdAt">) {
  const db = await requireDb();
  await db.insert(notes).values({ userId, ...input });
}

export async function listStudyGroups(filter: { query?: string; subject?: string }, userId: number) {
  const db = await requireDb();
  const conditions = [
    filter.subject ? eq(studyGroups.subject, filter.subject) : undefined,
    filter.query ? or(like(studyGroups.name, `%${filter.query}%`), like(studyGroups.subject, `%${filter.query}%`), like(studyGroups.description, `%${filter.query}%`)) : undefined,
  ].filter(Boolean);
  const groups = await db.select().from(studyGroups).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(studyGroups.createdAt)).limit(100);
  return Promise.all(groups.map(async group => {
    const [{ memberCount }] = await db.select({ memberCount: count() }).from(studyGroupMembers).where(eq(studyGroupMembers.groupId, group.id));
    const isMember = (await db.select().from(studyGroupMembers).where(and(eq(studyGroupMembers.groupId, group.id), eq(studyGroupMembers.userId, userId))).limit(1)).length > 0;
    return { ...group, memberCount: Number(memberCount), isMember };
  }));
}

export async function createStudyGroup(userId: number, input: { name: string; subject: string; description: string; memberLimit: number }) {
  const db = await requireDb();
  await db.insert(studyGroups).values({ creatorId: userId, ...input });
  const group = (await db.select().from(studyGroups).where(eq(studyGroups.creatorId, userId)).orderBy(desc(studyGroups.createdAt)).limit(1))[0];
  if (group) await db.insert(studyGroupMembers).values({ groupId: group.id, userId });
  return group;
}

export async function joinStudyGroup(groupId: number, userId: number) {
  const db = await requireDb();
  const group = (await db.select().from(studyGroups).where(eq(studyGroups.id, groupId)).limit(1))[0];
  if (!group) throw new Error("This study group no longer exists");
  const existing = await db.select().from(studyGroupMembers).where(and(eq(studyGroupMembers.groupId, groupId), eq(studyGroupMembers.userId, userId))).limit(1);
  if (existing.length) return;
  const [{ memberCount }] = await db.select({ memberCount: count() }).from(studyGroupMembers).where(eq(studyGroupMembers.groupId, groupId));
  if (Number(memberCount) >= group.memberLimit) throw new Error("This study group is already full");
  await db.insert(studyGroupMembers).values({ groupId, userId });
}

export async function getStudyGroupMembers(groupId: number) {
  const db = await requireDb();
  return db.select({ userId: studyGroupMembers.userId, fullName: studentProfiles.fullName, department: studentProfiles.department, semester: studentProfiles.semester })
    .from(studyGroupMembers)
    .leftJoin(studentProfiles, eq(studentProfiles.userId, studyGroupMembers.userId))
    .where(eq(studyGroupMembers.groupId, groupId));
}

export async function listTimetable(userId: number) {
  const db = await requireDb();
  return db.select().from(timetableEntries).where(eq(timetableEntries.userId, userId)).orderBy(asc(timetableEntries.startTime));
}

export async function createTimetableEntry(userId: number, input: Omit<typeof timetableEntries.$inferInsert, "id" | "userId" | "createdAt">) {
  const db = await requireDb();
  await db.insert(timetableEntries).values({ userId, ...input });
}

export async function removeTimetableEntry(userId: number, entryId: number) {
  const db = await requireDb();
  await db.delete(timetableEntries).where(and(eq(timetableEntries.id, entryId), eq(timetableEntries.userId, userId)));
}

export async function listDeadlines(userId: number, filter?: { status?: "pending" | "completed"; priority?: "low" | "medium" | "high" }) {
  const db = await requireDb();
  return db.select().from(deadlines).where(and(eq(deadlines.userId, userId), filter?.status ? eq(deadlines.status, filter.status) : undefined, filter?.priority ? eq(deadlines.priority, filter.priority) : undefined)).orderBy(asc(deadlines.dueAt));
}

export async function createDeadline(userId: number, input: Omit<typeof deadlines.$inferInsert, "id" | "userId" | "createdAt" | "status">) {
  const db = await requireDb();
  await db.insert(deadlines).values({ userId, ...input, status: "pending" });
}

export async function setDeadlineStatus(userId: number, deadlineId: number, status: "pending" | "completed") {
  const db = await requireDb();
  await db.update(deadlines).set({ status }).where(and(eq(deadlines.id, deadlineId), eq(deadlines.userId, userId)));
}

export async function listLostFoundPosts(filter: { query?: string; postType?: "lost" | "found"; category?: string }) {
  const db = await requireDb();
  const conditions = [
    filter.postType ? eq(lostFoundPosts.postType, filter.postType) : undefined,
    filter.category ? eq(lostFoundPosts.category, filter.category) : undefined,
    filter.query ? or(like(lostFoundPosts.title, `%${filter.query}%`), like(lostFoundPosts.description, `%${filter.query}%`), like(lostFoundPosts.location, `%${filter.query}%`)) : undefined,
  ].filter(Boolean);
  return db.select().from(lostFoundPosts).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(lostFoundPosts.createdAt)).limit(100);
}

export async function createLostFoundPost(userId: number, input: Omit<typeof lostFoundPosts.$inferInsert, "id" | "userId" | "createdAt" | "isResolved">) {
  const db = await requireDb();
  await db.insert(lostFoundPosts).values({ userId, ...input, isResolved: false });
}

export async function setLostFoundResolved(userId: number, postId: number, isResolved: boolean) {
  const db = await requireDb();
  await db.update(lostFoundPosts).set({ isResolved }).where(and(eq(lostFoundPosts.id, postId), eq(lostFoundPosts.userId, userId)));
}
