"use client";
import { Board } from "@/components/board";
import { useProject } from "@/hooks/query-hooks/useProject";
import { type NextPage } from "next";
import BoardSkeleton from "./loading";
import { notFound } from "next/navigation";

const BoardPage: NextPage = () => {
  const { project, projectIsLoading } = useProject();

  if (projectIsLoading) return <BoardSkeleton />;

  if (!project) return notFound();

  return <Board project={project} />;
};

export default BoardPage;
