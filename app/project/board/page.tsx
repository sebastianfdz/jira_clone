import { Board } from "@/components/board";
import { type Metadata } from "next";
import { prisma } from "@/server/db";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient, generateIssuesForClient } from "@/utils/helpers";
import { SprintStatus } from "@prisma/client";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";

export const metadata: Metadata = {
  title: "Board",
};

async function getIssuesFromServer() {
  const activeIssues = await prisma.issue.findMany({
    where: { isDeleted: false },
  });
  if (!activeIssues) {
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

async function getProjectFromServer() {
  const project = await prisma.project.findUnique({
    where: { key: "JIRA-CLONE" },
  });
  return project;
}

async function getSprintsFromServer() {
  const sprints = await prisma.sprint.findMany({
    where: {
      OR: [{ status: SprintStatus.ACTIVE }, { status: SprintStatus.PENDING }],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return sprints;
}

const BoardPage = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    await queryClient.prefetchQuery(["issues"], getIssuesFromServer),
    await queryClient.prefetchQuery(["sprints"], getSprintsFromServer),
    await queryClient.prefetchQuery(["project"], getProjectFromServer),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Board />
    </Hydrate>
  );
};

export default BoardPage;
