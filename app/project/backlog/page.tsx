import { Backlog } from "@/components/backlog";
import { prisma } from "@/server/db";
import { notFound } from "next/navigation";

const getProject = async () => {
  return await prisma.project.findUnique({
    where: { key: "CLONE" },
  });
};

const BacklogPage = async () => {
  const project = await getProject();
  if (!project) return notFound();

  return <Backlog project={project} />;
};

export default BacklogPage;
