import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import * as db from "../db";

export const leaderboardRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
      })
    )
    .query(async ({ input }) => {
      const rows = await db.getLeaderboard({ limit: input.limit });

      return rows.map((row, index) => ({
        place: index + 1,
        userId: row.userId,
        userName: row.userName ?? "Anonim istifadəçi",
        userEmail: row.userEmail,
        totalScore: row.totalScore,
        observationCount: row.observationCount,
      }));
    }),
});
