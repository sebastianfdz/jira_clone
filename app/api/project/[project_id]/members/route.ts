import { type NextRequest, NextResponse } from "next/server";
import { type User, prisma } from "@/server/db";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "@/utils/helpers";

export type GetProjectMembersResponse = {
  members: User[];
};

type MembersParams = {
  params: {
    project_id: string;
  };
};

export async function GET(req: NextRequest, { params }: MembersParams) {
  const { project_id } = params;
  const members = await prisma.member.findMany({
    where: {
      projectId: project_id,
    },
  });

  const users = (
    await clerkClient.users.getUserList({
      userId: members.map((member) => member.id),
      limit: 20,
    })
  ).map(filterUserForClient);

  // return NextResponse.json<GetProjectMembersResponse>({ members:users });
  return NextResponse.json({ members: users });
}
