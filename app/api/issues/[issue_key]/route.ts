import { type NextRequest, NextResponse } from "next/server";
import { type User, prisma } from "@/server/db";
import { IssueStatus, type Issue, IssueType } from "@prisma/client";
import { z } from "zod";
import { type GetIssuesResponse } from "../route";
import { clerkClient } from "@clerk/nextjs";
import {
  calculateInsertPosition,
  filterUserForClient,
  isNullish,
} from "@/utils/helpers";
import {
  getIssuesInActiveSprint,
  handleBoardPositionChange,
  handleSprintPositionChange,
} from "./helpers";

export type GetIssueDetailsResponse = {
  issue: GetIssuesResponse["issues"][number] | null;
};

export type PostIssueResponse = { issue: Issue };

export async function GET(
  req: NextRequest,
  { params }: { params: { issue_key: string } }
) {
  const { issue_key } = params;
  const issue = await prisma.issue.findUnique({
    where: {
      key: issue_key,
    },
  });
  if (!issue?.parentKey) {
    return NextResponse.json({ issue: { ...issue, parent: null } });
  }
  const parent = await prisma.issue.findUnique({
    where: {
      key: issue.parentKey,
    },
  });
  // return NextResponse.json<GetIssueDetailsResponse>({ issue });
  return NextResponse.json({ issue: { ...issue, parent } });
}

const patchIssueBodyValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(IssueType).optional(),
  status: z.nativeEnum(IssueStatus).optional(),
  sprintPosition: z.number().optional(),
  boardPosition: z.number().optional(),
  assigneeId: z.string().nullable().optional(),
  reporterId: z.string().optional(),
  parentKey: z.string().nullable().optional(),
  sprintId: z.string().nullable().optional(),
  isDeleted: z.boolean().optional(),
  sprintColor: z.string().optional(),
});

export type PatchIssueBody = z.infer<typeof patchIssueBodyValidator>;
export type PatchIssueResponse = { issue: Issue & { assignee: User | null } };

type ParamsType = {
  params: {
    issue_key: string;
  };
};

export async function PATCH(req: NextRequest, { params }: ParamsType) {
  const { issue_key } = params;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const validated = patchIssueBodyValidator.safeParse(body);

  if (!validated.success) {
    // eslint-disable-next-line
    const message = "Invalid body. " + validated.error.errors[0]?.message ?? "";
    return new Response(message, { status: 400 });
  }
  const {
    name,
    description,
    type,
    status,
    sprintPosition,
    boardPosition,
    assigneeId,
    reporterId,
    isDeleted,
    sprintId,
    parentKey,
    sprintColor,
  } = validated.data;

  const currentIssue = await prisma.issue.findUnique({
    where: {
      key: issue_key,
    },
  });

  if (!currentIssue) {
    return new Response("Issue not found", { status: 404 });
  }

  if (!isNullish(sprintPosition) && sprintId !== undefined) {
    // HANDLE DND ACTION ON BACKLOG

    const sprint = await prisma.sprint.findUnique({
      where: {
        id: sprintId ?? undefined,
      },
    });

    const updatedIssues = await handleSprintPositionChange({
      sourceSprint: currentIssue.sprintId,
      destinationSprint: sprintId,
      sourcePosition: currentIssue.sprintPosition,
      destinationPosition: sprintPosition,
      issue: currentIssue,
      moveInBoardIsNeeded: sprint?.status === "ACTIVE",
    });

    return NextResponse.json({
      issue: updatedIssues.filter((issue) => issue.key == issue_key)[0],
    });
  }

  if (!isNullish(boardPosition) && !isNullish(status)) {
    if (isNullish(currentIssue.boardPosition)) {
      return new Response("Source board position is null", { status: 403 });
    }
    // HANDLE DND ACTION ON BOARD
    const updatedIssues = await handleBoardPositionChange({
      sourceStatus: currentIssue.status,
      destinationStatus: status,
      sourcePosition: currentIssue.boardPosition,
      destinationPosition: boardPosition,
      issue: currentIssue,
    });

    return NextResponse.json({
      issue: updatedIssues.filter((issue) => issue.key == issue_key)[0],
    });
  }

  if (!isNullish(status)) {
    // HANDLE STATUS CHANGE
    const currentIssue = await prisma.issue.findUnique({
      where: {
        key: issue_key,
      },
    });
    const activeSprints = await prisma.sprint.findMany({
      where: {
        status: "ACTIVE",
      },
    });

    const moveInBoardIsNeeded =
      currentIssue?.sprintId &&
      activeSprints.map((sprint) => sprint.id).includes(currentIssue.sprintId);

    if (moveInBoardIsNeeded) {
      // HANDLE BOARD MOVE
      const statusColumnIssueList = await getIssuesInActiveSprint({
        status,
        activeSprints,
      });

      const positionToInsert = calculateInsertPosition(statusColumnIssueList);

      const updatedIssues = await handleBoardPositionChange({
        sourceStatus: currentIssue.status,
        destinationStatus: status,
        sourcePosition: positionToInsert,
        destinationPosition: positionToInsert,
        issue: currentIssue,
      });

      return NextResponse.json({
        issue: updatedIssues.filter((issue) => issue.key == issue_key)[0],
      });
    }
  }

  const issue = await prisma.issue.update({
    where: {
      key: issue_key,
    },
    data: {
      name: name ?? undefined,
      description: description ?? undefined,
      status: status ?? undefined,
      type: type ?? undefined,
      sprintPosition: sprintPosition ?? undefined,
      assigneeId: assigneeId === undefined ? undefined : assigneeId,
      reporterId: reporterId ?? undefined,
      isDeleted: isDeleted ?? undefined,
      sprintId: sprintId === undefined ? undefined : sprintId,
      parentKey: parentKey === undefined ? undefined : parentKey,
      sprintColor: sprintColor ?? undefined,
      boardPosition: boardPosition ?? null,
    },
  });

  if (issue.assigneeId) {
    const assignee = await clerkClient.users.getUser(issue.assigneeId);
    const assigneeForClient = filterUserForClient(assignee);
    return NextResponse.json({
      issue: { ...issue, assignee: assigneeForClient },
    });
  }

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({
    issue: { ...issue, assignee: null },
  });
}

export async function DELETE(req: NextRequest, { params }: ParamsType) {
  const { issue_key } = params;

  const issue = await prisma.issue.update({
    where: {
      key: issue_key,
    },
    data: {
      isDeleted: true,
      boardPosition: null,
      sprintPosition: -1,
      sprintId: "DELETED-SPRINT-ID",
    },
  });

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({ issue });
}
