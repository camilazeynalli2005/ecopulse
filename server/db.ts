import { and, eq, desc, sql, type SQLWrapper } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  observations,
  grades,
  type InsertObservation,
  type Observation,
  type InsertGrade,
  type Grade,
  type User,
} from "../drizzle/schema";
// ── In-memory fallback (works without DATABASE_URL for local demo) ──────────

type MemUser = User & { id: number };
type MemObservation = Observation & { id: number };
type MemGrade = Grade & { id: number };

const memUsers: MemUser[] = [];
const memObservations: MemObservation[] = [];
const memGrades: MemGrade[] = [];
let memUserSeq = 1;
let memObsSeq = 1;
let memGradeSeq = 1;

function memFindUserByOpenId(openId: string): MemUser | undefined {
  return memUsers.find((u) => u.openId === openId);
}

function memUpsertUser(input: InsertUser): MemUser {
  let user = memFindUserByOpenId(input.openId as string);
  if (user) {
    Object.assign(user, {
      name: input.name ?? user.name,
      email: input.email ?? user.email,
      loginMethod: input.loginMethod ?? user.loginMethod,
      role: (input.role as any) ?? user.role,
      lastSignedIn: input.lastSignedIn ?? user.lastSignedIn,
      updatedAt: new Date(),
    });
    return user;
  }
  const newUser: MemUser = {
    id: memUserSeq++,
    openId: input.openId as string,
    name: input.name ?? null,
    email: input.email ?? null,
    loginMethod: input.loginMethod ?? null,
    role: (input.role as any) ?? "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: input.lastSignedIn ?? new Date(),
  };
  memUsers.push(newUser);
  return newUser;
}

function memGetUserByOpenId(openId: string): MemUser | undefined {
  return memFindUserByOpenId(openId);
}

function memCreateObservation(input: InsertObservation): MemObservation {
  const row: MemObservation = {
    id: memObsSeq++,
    userId: input.userId,
    location: input.location,
    content: input.content,
    status: input.status as any,
    submittedAt: input.submittedAt ?? new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memObservations.push(row);
  return row;
}

function memListObservations({
  teacherId,
  status,
}: {
  teacherId?: number;
  status?: string;
}): Array<
  MemObservation & { userName: string | null; userEmail: string | null; gradeTotal: number | null }
> {
  let filtered = memObservations.filter((o) => {
    if (teacherId !== undefined && o.userId !== teacherId) return false;
    if (status !== undefined && o.status !== status) return false;
    return true;
  });
  filtered = filtered.slice().sort((a, b) => {
    const da = new Date(a.submittedAt).getTime();
    const db2 = new Date(b.submittedAt).getTime();
    return db2 - da;
  });
  return filtered.map((o) => {
    const user = memUsers.find((u) => u.id === o.userId);
    const grade = memGrades.find((g) => g.observationId === o.id);
    return {
      ...o,
      userName: user?.name ?? null,
      userEmail: user?.email ?? null,
      gradeTotal: grade ? grade.totalScore : null,
    };
  });
}

function memGetObservationById(id: number): MemObservation | undefined {
  return memObservations.find((o) => o.id === id);
}

function memCreateGrade(input: InsertGrade): MemGrade {
  const row: MemGrade = {
    id: memGradeSeq++,
    observationId: input.observationId,
    teacherId: input.teacherId,
    scientificObservation: input.scientificObservation ?? 0,
    dataUsage: input.dataUsage ?? 0,
    resultJustification: input.resultJustification ?? 0,
    teamwork: input.teamwork ?? 0,
    totalScore: input.totalScore ?? 0,
    feedback: input.feedback ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memGrades.push(row);
  return row;
}

function memGetGradeByObservationId(observationId: number): MemGrade | undefined {
  return memGrades.find((g) => g.observationId === observationId);
}

function memListGradesWithObservations({
  teacherId,
}: {
  teacherId?: number;
}): Array<
  MemGrade & {
    observation: MemObservation;
    userName: string | null;
    userEmail: string | null;
  }
> {
  let filtered = memGrades.filter((g) => {
    if (teacherId !== undefined && g.teacherId !== teacherId) return false;
    return true;
  });
  filtered = filtered.slice().sort((a, b) => {
    const da = new Date(a.createdAt).getTime();
    const db2 = new Date(b.createdAt).getTime();
    return db2 - da;
  });
  return filtered.map((g) => {
    const obs = memObservations.find((o) => o.id === g.observationId);
    const user = obs ? memUsers.find((u) => u.id === obs.userId) : undefined;
    return {
      ...g,
      observation: obs!,
      userName: user?.name ?? null,
      userEmail: user?.email ?? null,
    };
  });
}

function memGetLeaderboard({ limit = 10 }: { limit?: number }): Array<{
  userId: number;
  userName: string | null;
  userEmail: string | null;
  totalScore: number;
  observationCount: number;
}> {
  const byUser = new Map<
    number,
    {
      userId: number;
      userName: string | null;
      userEmail: string | null;
      totalScore: number;
      observationCount: number;
    }
  >();
  for (const g of memGrades) {
    const obs = memObservations.find((o) => o.id === g.observationId);
    if (!obs) continue;
    const user = memUsers.find((u) => u.id === obs.userId);
    const key = obs.userId;
    const existing = byUser.get(key);
    if (existing) {
      existing.totalScore += g.totalScore;
      existing.observationCount += 1;
    } else {
      byUser.set(key, {
        userId: obs.userId,
        userName: user?.name ?? null,
        userEmail: user?.email ?? null,
        totalScore: g.totalScore,
        observationCount: 1,
      });
    }
  }
  return Array.from(byUser.values())
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
}

// ── Drizzle (MySQL) instance ────────────────────────────────────────────────

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

function useMemory(): boolean {
  return !process.env.DATABASE_URL || !_db;
}

// ── User wrappers ───────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (useMemory()) {
    memUpsertUser(user);
    return;
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const values: InsertUser = {
    openId: user.openId,
  };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];

  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };

  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  }

  if (!values.lastSignedIn) {
    values.lastSignedIn = new Date();
  }

  if (Object.keys(updateSet).length === 0) {
    updateSet.lastSignedIn = new Date();
  }

  await db.insert(users).values(values).onDuplicateKeyUpdate({
    set: updateSet,
  });
}

export async function getUserByOpenId(openId: string) {
  if (useMemory()) {
    return memGetUserByOpenId(openId);
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Observation wrappers ────────────────────────────────────────────────────

export async function createObservation(input: InsertObservation): Promise<Observation> {
  if (useMemory()) {
    return memCreateObservation(input);
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const [result] = await db.insert(observations).values(input).$returningId();
  const insertedId = Number(result.id ?? 0);
  const row = await db.select().from(observations).where(eq(observations.id, insertedId)).limit(1);
  if (row.length === 0) throw new Error("Failed to fetch inserted observation");
  return row[0];
}

export async function listObservations({
  teacherId,
  status,
}: { teacherId?: number; status?: string }): Promise<
  Array<Observation & { userName: string | null; userEmail: string | null; gradeTotal: number | null }>
> {
  if (useMemory()) {
    return memListObservations({ teacherId, status });
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const conditions: Array<SQLWrapper> = [];
  if (teacherId !== undefined) conditions.push(eq(observations.userId, teacherId));
  if (status !== undefined) conditions.push(eq(observations.status, status as any));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: observations.id,
      userId: observations.userId,
      location: observations.location,
      content: observations.content,
      status: observations.status,
      submittedAt: observations.submittedAt,
      createdAt: observations.createdAt,
      updatedAt: observations.updatedAt,
      userName: users.name,
      userEmail: users.email,
      gradeTotal: sql<number | null>`COALESCE((${sql`SELECT total_score FROM ${grades} WHERE ${grades.observationId} = ${observations.id} LIMIT 1`}), 0)`,
    })
    .from(observations)
    .leftJoin(users, eq(observations.userId, users.id))
    .where(whereClause)
    .orderBy(desc(observations.submittedAt));

  return rows;
}

export async function getObservationById(id: number): Promise<Observation | undefined> {
  if (useMemory()) {
    return memGetObservationById(id);
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const result = await db.select().from(observations).where(eq(observations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Grade wrappers ──────────────────────────────────────────────────────────

export async function createGrade(input: InsertGrade): Promise<Grade> {
  if (useMemory()) {
    return memCreateGrade(input);
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const [result] = await db.insert(grades).values(input).$returningId();
  const insertedId = Number(result.id ?? 0);
  const row = await db.select().from(grades).where(eq(grades.id, insertedId)).limit(1);
  if (row.length === 0) throw new Error("Failed to fetch inserted grade");
  return row[0];
}

export async function getGradeByObservationId(observationId: number): Promise<Grade | undefined> {
  if (useMemory()) {
    return memGetGradeByObservationId(observationId);
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const result = await db
    .select()
    .from(grades)
    .where(eq(grades.observationId, observationId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listGradesWithObservations({
  teacherId,
}: { teacherId?: number }): Promise<
  Array<Grade & { observation: Observation; userName: string | null; userEmail: string | null }>
> {
  if (useMemory()) {
    return memListGradesWithObservations({ teacherId });
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const conditions: Array<SQLWrapper> = [];
  if (teacherId !== undefined) conditions.push(eq(grades.teacherId, teacherId));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: grades.id,
      observationId: grades.observationId,
      teacherId: grades.teacherId,
      scientificObservation: grades.scientificObservation,
      dataUsage: grades.dataUsage,
      resultJustification: grades.resultJustification,
      teamwork: grades.teamwork,
      totalScore: grades.totalScore,
      feedback: grades.feedback,
      createdAt: grades.createdAt,
      updatedAt: grades.updatedAt,
      obsId: observations.id,
      obsUserId: observations.userId,
      obsLocation: observations.location,
      obsContent: observations.content,
      obsStatus: observations.status,
      obsSubmittedAt: observations.submittedAt,
      obsCreatedAt: observations.createdAt,
      obsUpdatedAt: observations.updatedAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(grades)
    .innerJoin(observations, eq(grades.observationId, observations.id))
    .leftJoin(users, eq(observations.userId, users.id))
    .where(whereClause)
    .orderBy(desc(grades.createdAt));

  return rows.map((row) => ({
    id: row.id,
    observationId: row.observationId,
    teacherId: row.teacherId,
    scientificObservation: row.scientificObservation,
    dataUsage: row.dataUsage,
    resultJustification: row.resultJustification,
    teamwork: row.teamwork,
    totalScore: row.totalScore,
    feedback: row.feedback,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    observation: {
      id: row.obsId,
      userId: row.obsUserId,
      location: row.obsLocation,
      content: row.obsContent,
      status: row.obsStatus,
      submittedAt: row.obsSubmittedAt,
      createdAt: row.obsCreatedAt,
      updatedAt: row.obsUpdatedAt,
    },
    userName: row.userName,
    userEmail: row.userEmail,
  }));
}

// ── Leaderboard wrappers ────────────────────────────────────────────────────

export async function getLeaderboard({
  limit = 10,
}: { limit?: number } = {}): Promise<
  Array<{ userId: number; userName: string | null; userEmail: string | null; totalScore: number; observationCount: number }>
> {
  if (useMemory()) {
    return memGetLeaderboard({ limit });
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const rows = await db
    .select({
      userId: observations.userId,
      userName: users.name,
      userEmail: users.email,
      totalScore: sql<number>`COALESCE(SUM(${grades.totalScore}), 0)`,
      observationCount: sql<number>`COUNT(DISTINCT ${observations.id})`,
    })
    .from(observations)
    .innerJoin(grades, eq(grades.observationId, observations.id))
    .innerJoin(users, eq(users.id, observations.userId))
    .groupBy(observations.userId, users.name, users.email)
    .orderBy(desc(sql<number>`COALESCE(SUM(${grades.totalScore}), 0)`))
    .limit(limit);

  return rows;
}
