import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type IssueType } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useIssues = () => {
  const queryClient = useQueryClient();
  const { data: issues } = useQuery(["issues"], api.issues.getIssues);

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
          message: "Something went wrong while updating the issue",
          description: "The issue was not updated. Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues"]);
      },
    }
  );
  return { issues, updateIssue, isUpdating };
};
