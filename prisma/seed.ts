/* eslint-disable */

import {
  initDefaultIssueComments,
  initDefaultIssues,
  initDefaultProjectMembers,
  initDefaultSprints,
  initDefaultUsers,
  initProject,
} from "@/server/functions";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
