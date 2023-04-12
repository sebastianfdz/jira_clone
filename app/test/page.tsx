"use client";
import { useProject } from "@/hooks/project/useProject";

const Test = () => {
  const { project, projectIsLoading } = useProject({ key: "P-SEB" });
  if (projectIsLoading) return <div>Loading</div>;
  return <div>{JSON.stringify(project)}</div>;
};

export default Test;
