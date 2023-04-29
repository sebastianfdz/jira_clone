import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

export const issuesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return await prisma.project.findUnique({
        where: { key: input.key },
      });
    }),
  getOne: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(({ input }) => {
      // const { prisma } = ctx;

      return new Promise((resolve) =>
        resolve({
          key: input.key,
          name: `Project ${input.key}`,
          description: `Project ${input.key} description`,
        })
      );
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["TASK", "STORY", "BUG", "EPIC"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log("ctx", ctx);
      const { name, type } = input;
      await prisma.issue.create({
        data: {
          name,
          reporter: "reporter_id",
          type,
        },
      });
      return;
    }),
});
