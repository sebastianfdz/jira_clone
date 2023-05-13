import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type IssueType } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelectedIssueContext } from "./useSelectedIssue";

export const useIssues = () => {
  const { issueId, setIssueId } = useSelectedIssueContext();
  const queryClient = useQueryClient();
  // GET
  const { data: issues } = useQuery(["issues"], api.issues.getIssues);

  // UPDATE
  const { mutate: updateIssue, isLoading: isUpdating } = useMutation(
    api.issues.patchIssue,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newIssue) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["issues"] });
        // Snapshot the previous value
        const previousIssues = queryClient.getQueryData(["issues"]);
        // Optimistically update to the new value
        queryClient.setQueryData(["issues"], (old: IssueType[] | undefined) => {
          const newIssues = old?.map((issue) => {
            if (issue.key == newIssue.issue_key) {
              // Assign the new values to the issue
              Object.assign(issue, newIssue);
            }
            return issue;
          });
          return newIssues;
        });

        // Return a context object with the snapshotted value
        return { previousIssues };
      },
      onError: (err, newIssue, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(["issues"], context?.previousIssues);
        toast.error({
          message: `Something went wrong while updating the issue ${newIssue.issue_key}`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues"]);
      },
    }
  );

  // POST
  const { mutate: createIssue, isLoading: isCreating } = useMutation(
    api.issues.postIssue,
    {
      // NO OPTIMISTIC UPDATE BECAUSE WE DON'T KNOW THE KEY OF THE NEW ISSUE
      onError: (err, createdIssue) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        toast.error({
          message: `Something went wrong while creating the issue ${createdIssue.name}`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues"]);
      },
    }
  );

  // DELETE
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
  return {
    issues,
    updateIssue,
    isUpdating,
    createIssue,
    isCreating,
    deleteIssue,
    isDeleting,
  };
};
