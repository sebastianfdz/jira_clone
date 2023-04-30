import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Issue } from "@prisma/client";
import { z } from "zod";

const postSchema = z.object({
  name: z.string(),
  type: z.enum(["BUG", "STORY", "TASK", "EPIC"]),
  sprintId: z.string().nullable(),
  reporter: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().url(),
  }),
  listPosition: z.number(),
});

export type PostIssueBody = z.infer<typeof postSchema>;
export type GetIssuesResponse = { issues: Issue[] };
export type PostIssueResponse = { issue: Issue };

export async function GET() {
  const issues = await prisma.issue.findMany();
  const active_issues = issues.filter((issue) => !issue.isDeleted);
  return NextResponse.json<GetIssuesResponse>({ issues: active_issues });
}

export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  const validated = postSchema.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { name, type, reporter, sprintId, listPosition } = validated.data;

  const issues = await prisma.issue.findMany();
  const k = issues.length + 1;

  const issue = await prisma.issue.create({
    data: {
      key: `ISSUE-${k}`,
      name,
      type,
      reporter,
      sprintId,
      listPosition,
    },
  });

  return NextResponse.json<PostIssueResponse>({ issue });
}
