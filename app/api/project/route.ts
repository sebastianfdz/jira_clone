import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Project } from "@prisma/client";

export type GetProjectResponse = {
  project: Project | null;
};

export async function GET() {
  const project = await prisma.project.findUnique({
    where: {
      key: "CLONE",
    },
  });
  return NextResponse.json<GetProjectResponse>({ project });
}
