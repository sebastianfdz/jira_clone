import { type NextRequest, NextResponse } from "next/server";
import { prisma, ratelimit } from "@/server/db";
import { SprintStatus, type Sprint } from "@prisma/client";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";

const patchSprintBodyValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(SprintStatus).optional(),
});

export type PatchSprintBody = z.infer<typeof patchSprintBodyValidator>;
export type PatchSprintResponse = { sprint: Sprint };

type ParamsType = {
  params: {
    sprint_id: string;
  };
};

export async function PATCH(req: NextRequest, { params }: ParamsType) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { sprint_id } = params;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const validated = patchSprintBodyValidator.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { data: valid } = validated;

  const current = await prisma.sprint.findUnique({
    where: {
      id: sprint_id,
    },
  });

  if (!current) {
    return new Response("Sprint not found", { status: 404 });
  }

  const sprint = await prisma.sprint.update({
    where: {
      id: sprint_id,
    },
    data: {
      name: valid.name ?? current.name,
      description: valid.description ?? current.description,
      startDate: valid.startDate ?? current.startDate,
      endDate: valid.endDate ?? current.endDate,
      status: valid.status ?? current.status,
      duration: valid.duration ?? current.duration,
    },
  });

  // return NextResponse.json<PatchSprintResponse>({ sprint });
  return NextResponse.json({ sprint });
}

export async function DELETE(req: NextRequest, { params }: ParamsType) {
  const { userId } = getAuth(req);
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { sprint_id } = params;

  await prisma.issue.updateMany({
    where: {
      sprintId: sprint_id,
    },
    data: {
      sprintId: null,
    },
  });

  const sprint = await prisma.sprint.delete({
    where: {
      id: sprint_id,
    },
  });

  // return NextResponse.json<PatchSprintResponse>({ sprint });
  return NextResponse.json({ sprint });
}
