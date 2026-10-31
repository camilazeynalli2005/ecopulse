import { z } from "zod";
import { protectedProcedure, router } from "./trpc";
import * as db from "../db";

export const observationRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        location: z.string().min(1, "location is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const observation = await db.createObservation({
        userId: ctx.user.id,
        location: input.location,
        content: input.content,
        status: "pending",
      });

      return { success: true, observation };
    }),

  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "graded"]).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      // Teachers see all observations; students see only their own
      const isTeacher = ctx.user.role === "admin" || ctx.user.role === "teacher";
      const teacherId = isTeacher ? undefined : ctx.user.id;

      const rows = await db.listObservations({
        teacherId,
        status: input.status,
      });

      return rows;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const observation = await db.getObservationById(input.id);
      if (!observation) {
        throw new Error("Observation not found");
      }

      // Students can only see their own observations
      if (ctx.user && ctx.user.role !== "admin" && ctx.user.role !== "teacher") {
        if (observation.userId !== ctx.user.id) {
          throw new Error("Forbidden");
        }
      }

      return observation;
    }),
});
