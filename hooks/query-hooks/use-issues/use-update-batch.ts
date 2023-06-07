import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type IssueType } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateIssuesBatch = () => {
  const queryClient = useQueryClient();

  const { mutate: updateIssuesBatch, isLoading: batchUpdating } = useMutation(
    api.issues.updateBatchIssues,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newIssue) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["issues"]);
        // Snapshot the previous value
        const previousIssues = queryClient.getQueryData<IssueType[]>([
          "issues",
        ]);

        // Optimistically updating the issues
        queryClient.setQueryData(["issues"], (old?: IssueType[]) => {
          const newIssues = (old ?? []).map((issue) => {
            const { keys, ...updatedProps } = newIssue;
            if (keys.includes(issue.key)) {
              // Assign the new prop values to the issue
              return Object.assign(issue, updatedProps);
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
          message: `Something went wrong while batch updating issues`,
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
  return { updateIssuesBatch, batchUpdating };
};

export { useUpdateIssuesBatch };
