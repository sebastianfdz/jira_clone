import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { IssueStatus, type Issue, IssueType } from "@prisma/client";
import { z } from "zod";

export type GetIssueDetailsResponse = {
  issue: Issue | null;
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
  // return NextResponse.json<GetIssueDetailsResponse>({ issue });
  return NextResponse.json({ issue });
}
const patchSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(IssueType).optional(),
  status: z.nativeEnum(IssueStatus).optional(),
  listPosition: z.number().optional(),
  reporter: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().url(),
    })
    .optional(),
  assignee: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().url(),
    })
    .optional(),
  parentId: z.string().optional(),
  sprintId: z.string().optional(),
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
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const {
    name,
    description,
    type,
    status,
    listPosition,
    reporter,
    assignee,
    isDeleted,
    sprintId,
    parentId,
  } = validated.data;

  const current = await prisma.issue.findUnique({
    where: {
      key: issue_key,
    },
  });

  if (!current) {
    return new Response("Issue not found", { status: 404 });
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
      reporter: reporter ?? current.reporter,
      assignee: assignee ?? current.assignee ?? undefined,
      isDeleted: isDeleted ?? current.isDeleted,
      sprintId: sprintId ?? current.sprintId,
      parentId: parentId ?? current.parentId,
    },
  });

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({ issue });
}
