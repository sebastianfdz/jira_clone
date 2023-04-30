import { prisma } from "@/server/db";
import { type Sprint } from "@prisma/client";
import { NextResponse } from "next/server";

export type PostSprintResponse = {
  sprint: Sprint;
};

export type GetSprintsResponse = {
  sprints: Sprint[];
};

export async function POST() {
  const sprints = await prisma.sprint.findMany();
  const k = sprints.length + 1;

  const sprint = await prisma.sprint.create({
    data: {
      name: `SPRINT-${k}`,
    },
  });
  // return NextResponse.json<PostSprintResponse>({ sprint });
  return NextResponse.json({ sprint });
}

export async function GET() {
  const sprints = await prisma.sprint.findMany();
  // return NextResponse.json<GetSprintsResponse>({ sprints });
  return NextResponse.json({ sprints });
}
