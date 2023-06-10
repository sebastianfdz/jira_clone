"use client";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useProject = () => {
  const { data: project, isLoading: projectIsLoading } = useQuery(
    ["project"],
    api.project.getProject
  );
  const { data: members } = useQuery(
    ["project-members"],
    () => api.project.getMembers({ project_id: project?.id ?? "" }),
    {
      enabled: !!project?.id,
    }
  );

  return {
    project,
    projectIsLoading,
    members,
  };
};
