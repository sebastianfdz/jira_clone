"use client";
import { Backlog } from "@/components/backlog";
import { notFound } from "next/navigation";
import BacklogSkeleton from "./loading";
import { useProject } from "@/hooks/useProject";
import { useIssues } from "@/hooks/useIssues";
import { useSprints } from "@/hooks/useSprints";

const BacklogPage = () => {
  const { project, projectIsLoading } = useProject();
  const { issues, issuesLoading } = useIssues(); // fetch asap
  const { sprints, sprintsLoading } = useSprints(); // fetch asap

  if (projectIsLoading || issuesLoading || sprintsLoading)
    return <BacklogSkeleton />;
  if (!project || !issues || !sprints) return notFound();
  return <Backlog project={project} />;
};

export default BacklogPage;
