/* eslint-disable */
import {
  generateInitialUserComments,
  generateInitialUserIssues,
  generateInitialUserSprints,
} from "@/server/seed";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // Create default issues
  const initialIssues = generateInitialUserIssues("");
  await Promise.all(
    initialIssues.map(
      async (issue) =>
        await prisma.issue.create({
          data: {
            ...issue,
          },
        })
    )
  );

  // Create comments for default issues
  const initialComments = generateInitialUserComments("");
  await Promise.all(
    initialComments.map(
      async (comment) =>
        await prisma.comment.create({
          data: {
            ...comment,
          },
        })
    )
  );

  // Create default sprints
  const initialSprints = generateInitialUserSprints("");
  await Promise.all(
    initialSprints.map(
      async (sprint) =>
        await prisma.sprint.create({
          data: {
            ...sprint,
          },
        })
    )
  );
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
