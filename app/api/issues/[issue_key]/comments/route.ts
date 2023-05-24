import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Comment } from "@prisma/client";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient } from "@/utils/helpers";
import { type User } from "@/server/db";

export type GetIssueCommentsResponse = {
  comments: GetIssueCommentResponse["comment"][];
};

export type GetIssueCommentResponse = {
  comment: Comment & { author: User };
};

export type PostCommentBody = z.infer<typeof postSchema>;

export async function GET(
  req: NextRequest,
  { params }: { params: { issue_key: string } }
) {
  const { issue_key } = params;

  const comments = await prisma.comment.findMany({
    where: {
      issueKey: issue_key,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const userIds = comments.map((c) => c.authorId);

  const users = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit: 110,
    })
  ).map(filterUserForClient);

  const commentsForClient = comments.map((comment) => {
    const author = users.find((u) => u.id === comment.authorId) ?? null;
    return { ...comment, author };
  });

  return NextResponse.json({ comments: commentsForClient });
}

const postSchema = z.object({
  content: z.string(),
  authorId: z.string(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { issue_key: string } }
) {
  const { issue_key } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  console.log("body", body);

  const validated = postSchema.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  console.log("validated", validated);

  const { content, authorId } = validated.data;

  const comment = await prisma.comment.create({
    data: {
      issueKey: issue_key,
      content,
      authorId,
    },
  });

  const author = await clerkClient.users.getUser(comment.authorId);
  const authorForClient = filterUserForClient(author);

  return NextResponse.json({
    comment: {
      ...comment,
      author: authorForClient,
    },
  });
}
