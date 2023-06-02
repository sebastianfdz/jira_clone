import { prisma } from "@/server/db";
import {
  insertIssueIntoBacklogList,
  insertIssueIntoBoardList,
  moveIssueWithinBacklogList,
  moveIssueWithinBoardList,
} from "@/utils/helpers";
import { type IssueStatus, type Issue, type Sprint } from "@prisma/client";

export async function handleSprintPositionChange(payload: {
  sourceSprint: string | null;
  destinationSprint: string | null;
  sourcePosition: number;
  destinationPosition: number;
  issue: Issue;
}) {
  const {
    sourceSprint,
    destinationSprint,
    sourcePosition,
    destinationPosition,
    issue,
  } = payload;

  let newIssues: Issue[] = [];
  if (sourceSprint === destinationSprint) {
    // MOVE WITHIN LIST
    const issueList = await prisma.issue.findMany({
      where: { sprintId: sourceSprint },
      orderBy: { sprintPosition: "asc" },
    });

    newIssues = moveIssueWithinBacklogList({
      issueList,
      oldIndex: sourcePosition,
      newIndex: destinationPosition,
    });
  } else {
    // MOVE BETWEEN LISTS
    const destinationList = await prisma.issue.findMany({
      where: { sprintId: destinationSprint },
      orderBy: { sprintPosition: "asc" },
    });
    const updatedIssue = await prisma.issue.update({
      where: { key: issue.key },
      data: { sprintId: destinationSprint },
    });

    newIssues = insertIssueIntoBacklogList({
      issueList: destinationList,
      issue: updatedIssue,
      index: destinationPosition,
    });

    const sourceList = await prisma.issue.findMany({
      where: { sprintId: sourceSprint },
      orderBy: { sprintPosition: "asc" },
    });

    // UPDATE SPRINT POSITIONS IN OLD LIST
    await Promise.all(
      sourceList.map(async (issue, index) => {
        return await prisma.issue.update({
          where: {
            key: issue.key,
          },
          data: {
            sprintPosition: index,
          },
        });
      })
    );
  }

  // UPDATE SPRINT POSITIONS IN NEW LIST
  const updatedIssues = await Promise.all(
    newIssues.map(async (issue, index) => {
      return await prisma.issue.update({
        where: {
          key: issue.key,
        },
        data: {
          sprintPosition: index,
        },
      });
    })
  );
  return updatedIssues;
}

export async function handleBoardPositionChange(payload: {
  sourceStatus: IssueStatus;
  destinationStatus: IssueStatus;
  sourcePosition: number;
  destinationPosition: number;
  issue: Issue;
}) {
  const {
    sourceStatus,
    destinationStatus,
    sourcePosition,
    destinationPosition,
    issue,
  } = payload;

  let newIssues: Issue[] = [];
  const activeSprints = await prisma.sprint.findMany({
    where: {
      status: "ACTIVE",
    },
  });
  if (sourceStatus === destinationStatus) {
    // MOVE WITHIN LIST
    const issueList = await getIssuesInActiveSprint({
      status: sourceStatus,
      activeSprints,
    });

    newIssues = moveIssueWithinBoardList({
      issueList,
      oldIndex: sourcePosition,
      newIndex: destinationPosition,
    });
  } else {
    // MOVE BETWEEN LISTS
    const destinationList = await getIssuesInActiveSprint({
      status: destinationStatus,
      activeSprints,
    });

    const updatedIssue = await prisma.issue.update({
      where: { key: issue.key },
      data: { status: destinationStatus },
    });

    newIssues = insertIssueIntoBoardList({
      issueList: destinationList,
      issue: updatedIssue,
      index: destinationPosition,
    });

    const sourceList = await getIssuesInActiveSprint({
      status: sourceStatus,
      activeSprints,
    });

    // UPDATE BOARD POSITIONS IN OLD LIST
    await Promise.all(
      sourceList.map(async (issue, index) => {
        return await prisma.issue.update({
          where: {
            key: issue.key,
          },
          data: {
            boardPosition: index,
          },
        });
      })
    );
  }

  // UPDATE BOARD POSITIONS IN NEW LIST
  const updatedNewIssues = await Promise.all(
    newIssues.map(async (issue, index) => {
      return await prisma.issue.update({
        where: {
          key: issue.key,
        },
        data: {
          boardPosition: index,
        },
      });
    })
  );
  return updatedNewIssues;
}

export async function getIssuesInActiveSprint({
  status,
  activeSprints,
}: {
  status: IssueStatus;
  activeSprints: Sprint[];
}) {
  const issueList = await prisma.issue.findMany({
    where: {
      AND: [
        {
          status,
        },
        {
          sprintId: {
            in: activeSprints.map((sprint) => sprint.id),
          },
        },
      ],
    },
    orderBy: { boardPosition: "asc" },
  });

  return issueList;
}
