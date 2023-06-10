"use client";
import { toast } from "@/components/toast";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import { api } from "@/utils/api";
import { type IssueType } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteIssue = () => {
  const { issueId, setIssueId } = useSelectedIssueContext();

  const queryClient = useQueryClient();

  const { mutate: deleteIssue, isLoading: isDeleting } = useMutation(
    api.issues.deleteIssue,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (deletedIssue) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["issues"] });
        // Snapshot the previous value
        const previousIssues = queryClient.getQueryData(["issues"]);
        // Optimistically delete the issue
        queryClient.setQueryData(["issues"], (old: IssueType[] | undefined) => {
          return old?.filter((issue) => issue.key !== deletedIssue.issue_key);
        });
        // Return a context object with the snapshotted value
        return { previousIssues };
      },
      onError: (err, deletedIssue, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        toast.error({
          message: `Something went wrong while deleting the issue ${deletedIssue.issue_key}`,
          description: "Please try again later.",
        });
        queryClient.setQueryData(["issues"], context?.previousIssues);
      },
      onSettled: (deletedIssue) => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues"]);

        // Unselect the deleted issue if it is currently selected
        if (issueId == deletedIssue?.key) {
          setIssueId(null);
        }
      },
    }
  );
  return { deleteIssue, isDeleting };
};

export { useDeleteIssue };
