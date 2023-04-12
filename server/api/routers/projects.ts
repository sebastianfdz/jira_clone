import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const projectsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({}) => {
    return [
      {
        id: "1",
        name: "Project 1",
        description: "Project 1 description",
      },
    ];
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
});
