"use client";
import { Backlog } from "@/components/backlog";
// import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import BacklogSkeleton from "./loading";

// const getProject = async () => {
//   return await prisma.project.findUnique({
//     where: { key: "CLONE" },
//   });
// };

const BacklogPage = () => {
  // const project = await getProject();
  const { data: project, isLoading } = useQuery(
    ["project"],
    api.project.getProject,
    {
      onError: (error) => {
        console.log("error", error);
      },
    }
  );
  if (isLoading) return <BacklogSkeleton />;
  if (!project) return notFound();
  return <Backlog project={project} />;
};

export default BacklogPage;
