/* eslint-disable */

import { PrismaClient } from "@prisma/client";
import {
  defaultUsers,
  generateInitialUserComments,
  generateInitialUserIssues,
  generateInitialUserSprints,
} from "./seed-data";
const prisma = new PrismaClient();

async function initProject() {
  await prisma.project.upsert({
    where: {
      id: "init-project-id-dq8yh-d0as89hjd",
    },
    update: {},
    create: {
      id: "init-project-id-dq8yh-d0as89hjd",
      name: "Jira Clone Project",
      key: "JIRA-CLONE",
    },
  });
}
async function initDefaultUsers() {
  await Promise.all(
    defaultUsers.map(
      async (user) =>
        await prisma.defaultUser.upsert({
          where: {
            id: user.id,
          },
          update: {
            avatar: user.avatar,
          },
          create: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          },
        })
    )
  );
}
async function initDefaultProjectMembers() {
  await Promise.all(
    defaultUsers.map(
      async (user) =>
        await prisma.member.upsert({
          where: {
            id: user.id,
          },
          update: {},
          create: {
            id: user.id,
            projectId: "init-project-id-dq8yh-d0as89hjd",
          },
        })
    )
  );
}

async function initDefaultIssues(userId: string) {
  const initialIssues = generateInitialUserIssues(userId);
  await Promise.all(
    initialIssues.map(
      async (issue) =>
        await prisma.issue.upsert({
          where: {
            id: issue.id,
          },
          update: {},
          create: {
            ...issue,
          },
        })
    )
  );
}

async function initDefaultIssueComments(userId: string) {
  const initialComments = generateInitialUserComments(userId);
  await Promise.all(
    initialComments.map(
      async (comment) =>
        await prisma.comment.upsert({
          where: {
            id: comment.id,
          },
          update: {},
          create: {
            ...comment,
          },
        })
    )
  );
}

async function initDefaultSprints(userId: string) {
  const initialSprints = generateInitialUserSprints(userId);
  await Promise.all(
    initialSprints.map(
      async (sprint) =>
        await prisma.sprint.upsert({
          where: {
            id: sprint.id,
          },
          update: {},
          create: {
            ...sprint,
          },
        })
    )
  );
}

async function main() {
  // Create default project
  await initProject();
  // Create default users
  await initDefaultUsers();
  // Create default project members
  await initDefaultProjectMembers();
  // Create default issues
  await initDefaultIssues("");
  // Create comments for default issues
  await initDefaultIssueComments("");
  // Create default sprints
  await initDefaultSprints("");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
