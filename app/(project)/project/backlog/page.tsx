import { Backlog } from "@/components/backlog";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { prisma } from "@/server/db";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient, generateIssuesForClient } from "@/utils/helpers";
import { SprintStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Backlog",
};

async function getIssuesFromServer() {
  const activeIssues = await prisma.issue.findMany({
    where: { isDeleted: false },
  });
  if (!activeIssues) {
    return [];
  }

  const userIds = activeIssues
    .flatMap((issue) => [issue.assigneeId, issue.reporterId] as string[])
    .filter(Boolean);

  const users = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit: 20,
    })
  ).map(filterUserForClient);

  const issues = generateIssuesForClient(activeIssues, users);
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

const BacklogPage = async () => {
  const [project, issues, sprints] = await Promise.all([
    getProjectFromServer(),
    getIssuesFromServer(),
    getSprintsFromServer(),
  ]);

  if (!project || !issues || !sprints) {
    return notFound();
  }

  return <Backlog project={project} issues={issues} sprints={sprints} />;
};

export default BacklogPage;
