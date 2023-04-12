"use client";
import { api } from "@/utils/api";

export const useProject = ({ key }: { key: string | undefined }) => {
  if (!key) {
    return { project: null, projectIsLoading: false, projectError: null };
  }

  console.log("useProject called with keyyyy ", key);
  const { data, isLoading, error } = api.projects.getOne.useQuery({
    key,
  });

  return {
    project: data,
    projectIsLoading: isLoading,
    projectError: error,
  };
};
