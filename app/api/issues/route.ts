import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Issue, type IssueType } from "@prisma/client";

export type GetIssuesResponse = {
  issues: Issue[];
};

export type PostIssueBody = {
  name: string;
  type: IssueType;
  sprintId: Issue["sprintId"];
  reporter: string;
};

export type PostIssueResponse = {
  issue: Issue;
};

export async function GET() {
  const issues = await prisma.issue.findMany();
  const active_issues = issues.filter((issue) => !issue.isDeleted);
  return NextResponse.json({ issues: active_issues });
}

export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const { name, type, reporter, sprintId } = body as PostIssueBody;

  const issues = await prisma.issue.findMany();
  const k = issues.length + 1;

  const issue = await prisma.issue.create({
    data: {
      key: `ISSUE-${k}`,
      name,
      type,
      reporter,
      sprintId,
    },
  });
  return NextResponse.json({ issue });
}
