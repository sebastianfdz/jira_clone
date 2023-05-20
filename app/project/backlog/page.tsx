"use client";
import { Backlog } from "@/components/backlog";
import { notFound } from "next/navigation";
import BacklogSkeleton from "./loading";
import { useProject } from "@/hooks/useProject";
import { useIssues } from "@/hooks/useIssues";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

const BacklogPage = () => {
  const { project, projectIsLoading } = useProject();
  const { issues, issuesLoading } = useIssues(); // fetch asap
  const { data: sprints, isLoading: sprintsLoading } = useQuery(
    ["sprints"],
    api.sprints.getSprints
  ); // fetch asap
  if (projectIsLoading || issuesLoading || sprintsLoading)
    return <BacklogSkeleton />;
  if (!project || !issues || !sprints) return notFound();
  return <Backlog project={project} />;
};

export default BacklogPage;
