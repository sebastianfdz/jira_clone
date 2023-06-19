"use client";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useUpdateIssue } from "./use-update-issue";
import { useUpdateIssuesBatch } from "./use-update-batch";
import { usePostIssue } from "./use-post-issue";
import { useDeleteIssue } from "./use-delete-issue";

export const TOO_MANY_REQUESTS = {
  message: `You have exceeded the number of requests allowed per minute.`,
  description: "Please try again later.",
};

export const useIssues = () => {
  const { data: issues, isLoading: issuesLoading } = useQuery(
    ["issues"],
    ({ signal }) => api.issues.getIssues({ signal }),
    {
      refetchOnMount: false,
    }
  );

  const { updateIssuesBatch, batchUpdating } = useUpdateIssuesBatch();
  const { updateIssue, isUpdating } = useUpdateIssue();
  const { createIssue, isCreating } = usePostIssue();
  const { deleteIssue, isDeleting } = useDeleteIssue();

  return {
    issues,
    issuesLoading,
    updateIssue,
    isUpdating,
    updateIssuesBatch,
    batchUpdating,
    createIssue,
    isCreating,
    deleteIssue,
    isDeleting,
  };
};
