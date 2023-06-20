import { PrismaClient, SprintStatus } from "@prisma/client";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env.mjs";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient, generateIssuesForClient } from "@/utils/helpers";
import { type UserResource } from "@clerk/types";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, "1 m"), // 15 requests per minute
  analytics: true,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getInitialIssuesFromServer(
  userId: UserResource["id"] | undefined | null
) {
  const activeIssues = await prisma.issue.findMany({
    where: { isDeleted: false, creatorId: userId ?? "" },
  });
  if (!activeIssues || activeIssues.length === 0) {
    return [];
  }

  const activeSprints = await prisma.sprint.findMany({
    where: {
      status: "ACTIVE",
    },
  });

  const userIds = activeIssues
    .flatMap((issue) => [issue.assigneeId, issue.reporterId] as string[])
    .filter(Boolean);

  const users = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit: 20,
    })
  ).map(filterUserForClient);

  const issues = generateIssuesForClient(
    activeIssues,
    users,
    activeSprints.map((sprint) => sprint.id)
  );
  return issues;
}

export async function getInitialProjectFromServer() {
  const project = await prisma.project.findUnique({
    where: { key: "JIRA-CLONE" },
  });
  return project;
}

export async function getInitialSprintsFromServer(
  userId: UserResource["id"] | undefined
) {
  const sprints = await prisma.sprint.findMany({
    where: {
      OR: [{ status: SprintStatus.ACTIVE }, { status: SprintStatus.PENDING }],
      creatorId: userId ?? "",
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return sprints;
}
