import { type NextRequest, NextResponse } from "next/server";
import { type User, prisma } from "@/server/db";
import { IssueType, type Issue, IssueStatus } from "@prisma/client";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "@/utils/helpers";

const postSchema = z.object({
  name: z.string(),
  type: z.enum(["BUG", "STORY", "TASK", "EPIC"]),
  sprintId: z.string().nullable(),
  reporterId: z.string().nullable(),
});

export type PostIssueBody = z.infer<typeof postSchema>;
export type GetIssuesResponse = {
  issues: (Issue & {
    parent: Issue;
    assignee: User | null;
    reporter: User | null;
  })[];
};
export type PostIssueResponse = { issue: Issue };

export async function GET() {
  const issues = await prisma.issue.findMany();
  const activeIssues = issues.filter((issue) => !issue.isDeleted);
  const userIds = issues
    .map((issue) => [issue.assigneeId, issue.reporterId] as string[])
    .flat()
    .filter(Boolean);

  const users = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit: 110,
    })
  ).map(filterUserForClient);

  console.log("users => ", users);

  const issuesForClient = activeIssues.map((issue) => {
    const parent = activeIssues.find((i) => i.key === issue.parentKey) ?? null;
    const assignee = users.find((u) => u.id === issue.assigneeId) ?? null;
    const reporter = users.find((u) => u.id === issue.reporterId) ?? null;
    return { ...issue, parent, assignee, reporter };
  });

  // return NextResponse.json<GetIssuesResponse>({ issues: activeIssues });
  return NextResponse.json({ issues: issuesForClient });
}

// POST
export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  const validated = postSchema.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { name, type, reporterId, sprintId } = validated.data;

  const issues = await prisma.issue.findMany();
  const currentSprintIssues = await prisma.issue.findMany({
    where: {
      sprintId,
      isDeleted: false,
    },
  });
  const k = issues.length + 1;
  const positionToInsert = currentSprintIssues.length + 1;

  const issue = await prisma.issue.create({
    data: {
      key: `ISSUE-${k}`,
      name,
      type,
      reporterId: reporterId ?? "user_2PwZmH2xP5aE0svR6hDH4AwDlcu", // Rogan as default reporter
      sprintId,
      listPosition: positionToInsert,
    },
  });
  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({ issue });
}

const patchSchema = z.object({
  keys: z.array(z.string()),
  type: z.nativeEnum(IssueType).optional(),
  status: z.nativeEnum(IssueStatus).optional(),
  assigneeId: z.string().nullable().optional(),
  reporterId: z.string().optional(),
  parentKey: z.string().nullable().optional(),
  sprintId: z.string().nullable().optional(),
  isDeleted: z.boolean().optional(),
});

export type PatchIssuesBody = z.infer<typeof patchSchema>;

export async function PATCH(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const validated = patchSchema.safeParse(body);

  if (!validated.success) {
    // eslint-disable-next-line
    const message = "Invalid body. " + validated.error.errors[0]?.message ?? "";
    return new Response(message, { status: 400 });
  }

  const {
    keys,
    type,
    status,
    assigneeId,
    reporterId,
    isDeleted,
    sprintId,
    parentKey,
  } = validated.data;

  const issuesToUpdate = await prisma.issue.findMany({
    where: {
      key: {
        in: keys,
      },
    },
  });

  const updatedIssues = await Promise.all(
    issuesToUpdate.map(async (issue) => {
      return await prisma.issue.update({
        where: {
          id: issue.id,
        },
        data: {
          type: type ?? issue.type,
          status: status ?? issue.status,
          assigneeId: assigneeId ?? issue.assigneeId,
          reporterId: reporterId ?? issue.reporterId,
          isDeleted: isDeleted ?? issue.isDeleted,
          sprintId: sprintId === undefined ? issue.sprintId : sprintId,
          parentKey: parentKey ?? issue.parentKey,
        },
      });
    })
  );

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({ issues: updatedIssues });
}
