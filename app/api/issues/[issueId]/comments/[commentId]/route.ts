import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, ratelimit } from "@/server/db";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient } from "@/utils/helpers";
import { getAuth } from "@clerk/nextjs/server";

const patchCommentBodyValidator = z.object({
  content: z.string(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { commentId } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  const validated = patchCommentBodyValidator.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { data: valid } = validated;

  const comment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: valid.content,
      isEdited: true,
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
