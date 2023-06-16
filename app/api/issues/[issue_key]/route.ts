import { type NextRequest, NextResponse } from "next/server";
import { type User, prisma } from "@/server/db";
import { IssueStatus, type Issue, IssueType } from "@prisma/client";
import { z } from "zod";
import { type GetIssuesResponse } from "../route";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient } from "@/utils/helpers";

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
  const { data: valid } = validated;

  const currentIssue = await prisma.issue.findUnique({
    where: {
      key: issue_key,
    },
  });

  if (!currentIssue) {
    return new Response("Issue not found", { status: 404 });
  }

  const issue = await prisma.issue.update({
    where: {
      key: issue_key,
    },
    data: {
      name: valid.name ?? undefined,
      description: valid.description ?? undefined,
      status: valid.status ?? undefined,
      type: valid.type ?? undefined,
      sprintPosition: valid.sprintPosition ?? undefined,
      assigneeId: valid.assigneeId === undefined ? undefined : valid.assigneeId,
      reporterId: valid.reporterId ?? undefined,
      isDeleted: valid.isDeleted ?? undefined,
      sprintId: valid.sprintId === undefined ? undefined : valid.sprintId,
      parentKey: valid.parentKey === undefined ? undefined : valid.parentKey,
      sprintColor: valid.sprintColor ?? undefined,
      boardPosition: valid.boardPosition ?? undefined,
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
      boardPosition: -1,
      sprintPosition: -1,
      sprintId: "DELETED-SPRINT-ID",
    },
  });

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({ issue });
}
