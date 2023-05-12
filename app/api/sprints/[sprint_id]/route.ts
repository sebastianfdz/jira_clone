import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { SprintStatus, type Sprint } from "@prisma/client";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.nativeEnum(SprintStatus).optional(),
});

export type PatchSprintBody = z.infer<typeof patchSchema>;
export type PatchSprintResponse = { sprint: Sprint };

type PatchParams = {
  params: {
    sprint_id: string;
  };
};

export async function PATCH(req: NextRequest, { params }: PatchParams) {
  const { sprint_id } = params;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const validated = patchSchema.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { name, description, startDate, endDate, status } = validated.data;

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
      name: name ?? current.name,
      description: description ?? current.description,
      startDate: startDate ?? current.startDate,
      endDate: endDate ?? current.endDate,
      status: status ?? current.status,
    },
  });

  // return NextResponse.json<PatchSprintResponse>({ sprint });
  return NextResponse.json({ sprint });
}

export async function DELETE(req: NextRequest, { params }: PatchParams) {
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
