import { z } from "zod";
import { protectedProcedure, router } from "./trpc";
import * as db from "../db";

const scoreSchema = z.number().int().min(1).max(5);

export const gradeRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        observationId: z.number(),
        scientificObservation: scoreSchema,
        dataUsage: scoreSchema,
        resultJustification: scoreSchema,
        teamwork: scoreSchema,
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      // Only teachers/admins can grade
      if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") {
        throw new Error("Forbidden: only teachers can grade");
      }

      const observation = await db.getObservationById(input.observationId);
      if (!observation) {
        throw new Error("Observation not found");
      }

      const existing = await db.getGradeByObservationId(input.observationId);
      if (existing) {
        throw new Error("Grade already exists for this observation");
      }

      const totalScore =
        input.scientificObservation +
        input.dataUsage +
        input.resultJustification +
        input.teamwork;

      const grade = await db.createGrade({
        observationId: input.observationId,
        teacherId: ctx.user.id,
        scientificObservation: input.scientificObservation,
        dataUsage: input.dataUsage,
        resultJustification: input.resultJustification,
        teamwork: input.teamwork,
        totalScore,
        feedback: input.feedback ?? null,
      });

      return { success: true, grade };
    }),

  list: protectedProcedure
    .input(
      z.object({
        observationId: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const rows = await db.listGradesWithObservations({
        teacherId: ctx.user.role === "admin" || ctx.user.role === "teacher" ? undefined : ctx.user.id,
      });

      // Filter by observationId if provided
      const filtered = input.observationId
        ? rows.filter((row) => row.observationId === input.observationId)
        : rows;

      return filtered;
    }),
});
