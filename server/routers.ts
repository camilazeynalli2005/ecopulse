import { observationRouter } from "./_core/observationRouter";
import { gradeRouter } from "./_core/gradeRouter";
import { leaderboardRouter } from "./_core/leaderboardRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(() => null),
    logout: publicProcedure.mutation(() => ({ success: true } as const)),
    devLogin: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "name is required"),
          role: z.enum(["user", "teacher", "admin"]),
        })
      )
      .mutation(async ({ input }) => {
        const openId = `dev_${input.name.toLowerCase().replace(/\s+/g, "_")}`;

        await db.upsertUser({
          openId,
          name: input.name,
          email: null,
          loginMethod: "dev",
          role: input.role,
          lastSignedIn: new Date(),
        });

        const user = await db.getUserByOpenId(openId);
        if (!user) {
          throw new Error("Failed to create dev user");
        }

        return {
          success: true,
          user: {
            id: user.id,
            openId: user.openId,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),
  }),

  observation: observationRouter,
  grade: gradeRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
