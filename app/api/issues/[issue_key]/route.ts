import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Issue } from "@prisma/client";

export type GetIssueDetailsResponse = {
  issue: Issue | null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { issue_key: string } }
) {
  const { issue_key } = params;
  const issue: GetIssueDetailsResponse["issue"] = await prisma.issue.findUnique(
    {
      where: {
        key: issue_key,
      },
    }
  );
  return NextResponse.json({ issue });
}
