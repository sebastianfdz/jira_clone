import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db";
import { clerkClient } from "@clerk/nextjs";
import { filterUserForClient } from "@/utils/helpers";

const patchSchema = z.object({
  content: z.string(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { issue_key: string; comment_id: string } }
) {
  const { comment_id } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  console.log("body", body);

  const validated = patchSchema.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  console.log("validated", validated);

  const { content } = validated.data;

  const comment = await prisma.comment.update({
    where: {
      id: comment_id,
    },
    data: {
      content,
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
