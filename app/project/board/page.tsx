"use client";
import { Board } from "@/components/board";
import { useProject } from "@/hooks/query-hooks/useProject";
import BoardSkeleton from "./loading";
import { notFound } from "next/navigation";
import { useIssues } from "@/hooks/query-hooks/useIssues";
import { useSprints } from "@/hooks/query-hooks/useSprints";

const BoardPage = () => {
  const { project, projectIsLoading } = useProject();
  const { issues, issuesLoading } = useIssues(); // fetch asap
  const { sprints, sprintsLoading } = useSprints(); // fetch asap

  if (projectIsLoading || issuesLoading || sprintsLoading)
    return <BoardSkeleton />;

  if (!project || !issues || !sprints) return notFound();

  return <Board project={project} />;
};

export default BoardPage;
