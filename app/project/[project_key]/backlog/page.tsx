import { Backlog } from "@/components/backlog";
import { prisma } from "@/server/db";
import { notFound } from "next/navigation";

const getProject = async (key: string | undefined) => {
  if (!key) return null;
  return await prisma.project.findUnique({
    where: { key },
  });
};

const BacklogPage = async ({
  params,
}: {
  params: { [param: string]: string };
}) => {
  const { project_key } = params;
  const project = await getProject(project_key);

  if (!project) return notFound();

  return <Backlog project={project} />;
};

export default BacklogPage;
