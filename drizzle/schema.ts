import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "teacher", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Öğrenci/taleb müşahidə və tapşırıq qeydləri.
 * Her bir kayıt bir kullanıcıya (user_id) bağlıdır.
 */
export const observations = mysqlTable("observations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  location: varchar("location", { length: 100 }).notNull(), // Topxana meşəsi, Kəlbəcər, Laçın
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "graded"]).default("pending").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Observation = typeof observations.$inferSelect;
export type InsertObservation = typeof observations.$inferInsert;

/**
 * Müəllim tərəfindən verilen 4 kriteriyalı qiymətləndirmə.
 * Her bir osservasiyaya bir kez verilir.
 */
export const grades = mysqlTable("grades", {
  id: int("id").autoincrement().primaryKey(),
  observationId: int("observation_id")
    .notNull()
    .references(() => observations.id),
  teacherId: int("teacher_id").notNull().references(() => users.id),
  scientificObservation: int("scientific_observation").notNull().default(0), // 1-5
  dataUsage: int("data_usage").notNull().default(0), // 1-5
  resultJustification: int("result_justification").notNull().default(0), // 1-5
  teamwork: int("teamwork").notNull().default(0), // 1-5
  totalScore: int("total_score").notNull().default(0),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Grade = typeof grades.$inferSelect;
export type InsertGrade = typeof grades.$inferInsert;