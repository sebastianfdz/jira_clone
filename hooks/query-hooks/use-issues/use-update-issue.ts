"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type IssueType } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from ".";

const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  const { mutate: updateIssue, isLoading: isUpdating } = useMutation(
    ["issues"],
    api.issues.patchIssue,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newIssue) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["issues"]);
        // Snapshot the previous value
        const previousIssues = queryClient.getQueryData<IssueType[]>([
          "issues",
        ]);

        queryClient.setQueryData(["issues"], (old?: IssueType[]) => {
          const newIssues = (old ?? []).map((issue) => {
            const { issueId, ...updatedProps } = newIssue;
            if (issue.id === issueId) {
              // Assign the new prop values to the issue
              return Object.assign(issue, updatedProps);
            }
            return issue;
          });
          return newIssues;
        });
        // }
        // Return a context object with the snapshotted value
        return { previousIssues };
      },
      onError: (err: AxiosError, newIssue, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(["issues"], context?.previousIssues);

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }

        toast.error({
          message: `Something went wrong while updating the issue ${newIssue.issueId}`,
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

  return { updateIssue, isUpdating };
};

export { useUpdateIssue };
