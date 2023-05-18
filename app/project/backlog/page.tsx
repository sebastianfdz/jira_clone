"use client";
import { Backlog } from "@/components/backlog";
import { notFound } from "next/navigation";
import BacklogSkeleton from "./loading";
import { useProject } from "@/hooks/useProject";

const BacklogPage = () => {
  const { project, projectIsLoading } = useProject();
  if (projectIsLoading) return <BacklogSkeleton />;
  if (!project) return notFound();
  return <Backlog project={project} />;
};

export default BacklogPage;
