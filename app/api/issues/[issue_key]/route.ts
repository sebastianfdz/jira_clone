import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { IssueStatus, type Issue, IssueType } from "@prisma/client";
import { z } from "zod";
import { insertIssueIntoList, moveIssueWithinList } from "@/utils/helpers";
import { type GetIssuesResponse } from "../route";

export type GetIssueDetailsResponse = {
  issue: GetIssuesResponse["issues"][number] | null;
};

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
const patchSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(IssueType).optional(),
  status: z.nativeEnum(IssueStatus).optional(),
  listPosition: z.number().optional(),
  assigneeId: z.string().nullable().optional(),
  reporterId: z.string().optional(),
  parentKey: z.string().nullable().optional(),
  sprintId: z.string().nullable().optional(),
  isDeleted: z.boolean().optional(),
});

export type PatchIssueBody = z.infer<typeof patchSchema>;

type PatchParams = {
  params: {
    issue_key: string;
  };
};

export async function PATCH(req: NextRequest, { params }: PatchParams) {
  const { issue_key } = params;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const validated = patchSchema.safeParse(body);

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
    listPosition,
    assigneeId,
    reporterId,
    isDeleted,
    sprintId,
    parentKey,
  } = validated.data;

  const current = await prisma.issue.findUnique({
    where: {
      key: issue_key,
    },
  });

  if (!current) {
    return new Response("Issue not found", { status: 404 });
  }

  if (listPosition !== undefined && sprintId !== undefined) {
    // HANDLE DND ACTION
    const updatedIssues = await handleListPositionChange({
      sourceSprint: current.sprintId,
      destinationSprint: sprintId,
      sourcePosition: current.listPosition,
      destinationPosition: listPosition,
      current,
    });

    return NextResponse.json({
      issue: updatedIssues.filter((issue) => issue.key == issue_key)[0],
    });
  }

  const issue = await prisma.issue.update({
    where: {
      key: issue_key,
    },
    data: {
      name: name ?? current.name,
      description: description ?? current.description,
      status: status ?? current.status,
      type: type ?? current.type,
      listPosition: listPosition ?? current.listPosition,
      assigneeId: assigneeId === undefined ? current.assigneeId : assigneeId,
      reporterId: reporterId ?? current.reporterId,
      isDeleted: isDeleted ?? current.isDeleted,
      sprintId: sprintId === undefined ? current.sprintId : sprintId,
      parentKey: parentKey === undefined ? current.parentKey : parentKey,
    },
  });

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({ issue });
}

export async function DELETE(req: NextRequest, { params }: PatchParams) {
  const { issue_key } = params;

  const issue = await prisma.issue.update({
    where: {
      key: issue_key,
    },
    data: {
      isDeleted: true,
    },
  });

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({ issue });
}

async function handleListPositionChange(payload: {
  sourceSprint: string | null;
  destinationSprint: string | null;
  sourcePosition: number;
  destinationPosition: number;
  current: Issue;
}) {
  const {
    sourceSprint,
    destinationSprint,
    sourcePosition,
    destinationPosition,
    current,
  } = payload;

  let newIssues: Issue[] = [];
  if (sourceSprint === destinationSprint) {
    // MOVE WITHIN LIST
    const issueList = await prisma.issue.findMany({
      where: { sprintId: sourceSprint },
      orderBy: { listPosition: "asc" },
    });
    newIssues = moveIssueWithinList({
      issueList,
      oldIndex: sourcePosition,
      newIndex: destinationPosition,
    });
  } else {
    // MOVE BETWEEN LISTS
    const issueList = await prisma.issue.findMany({
      where: { sprintId: destinationSprint },
      orderBy: { listPosition: "asc" },
    });
    const updatedCurrent = await prisma.issue.update({
      where: { key: current.key },
      data: { sprintId: destinationSprint },
    });

    newIssues = insertIssueIntoList({
      issueList,
      issue: updatedCurrent,
      index: destinationPosition,
    });
  }

  const updatedIssues = await Promise.all(
    newIssues.map(async (issue, index) => {
      return await prisma.issue.update({
        where: {
          key: issue.key,
        },
        data: {
          listPosition: index,
        },
      });
    })
  );
  return updatedIssues;
}
