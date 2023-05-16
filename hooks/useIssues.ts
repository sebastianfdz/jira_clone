import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type IssueType } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelectedIssueContext } from "./useSelectedIssue";

export const useIssues = () => {
  const { issueId, setIssueId } = useSelectedIssueContext();
  const queryClient = useQueryClient();
  // GET
  const { data: issues } = useQuery(["issues"], api.issues.getIssues, {
    refetchOnMount: false,
  });

  // UPDATE
  const { mutate: updateIssue, isLoading: isUpdating } = useMutation(
    api.issues.patchIssue,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newIssue) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["issues"]);
        // Snapshot the previous value
        const previousIssues = queryClient.getQueryData(["issues"]);
        // Optimistically update the issue
        queryClient.setQueryData(
          ["issues"],
          (old?: (IssueType | IssueType["parent"])[]) => {
            const newIssues = (old ?? []).map((issue) => {
              const { issue_key, ...updatedProps } = newIssue;
              if (issue.key === issue_key) {
                // Assign the new prop values to the issue
                Object.assign(issue, updatedProps);
              }
              return issue;
            });
            return newIssues;
          }
        );
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

  // function passProps({
  //   issue,
  //   _issue,
  // }: {
  //   issue: IssueType | IssueType["parent"];
  //   _issue: PatchIssueBody;
  // }) {
  //   if (_issue.listPosition && _issue.sprintId) {
  //     return {
  //       ...issue,
  //       listPosition: _issue.listPosition,
  //       sprintId: _issue.sprintId,
  //     };
  //   }
  //   if (_issue.assignee) {
  //     return { ...issue, assignee: _issue.assignee };
  //   }
  //   if (_issue.status) {
  //     return { ...issue, status: _issue.status };
  //   }
  //   if (_issue.name) {
  //     return { ...issue, name: _issue.name };
  //   }
  //   if (_issue.description) {
  //     return { ...issue, description: _issue.description };
  //   }
  //   if (_issue.type) {
  //     return { ...issue, type: _issue.type };
  //   }
  //   if (_issue.reporter) {
  //     return { ...issue, reporter: _issue.reporter };
  //   }
  //   return issue;
  // }

  // function handleOptimisticDnd({
  //   newIssue,
  //   previousIssues,
  // }: {
  //   newIssue: { issue_key: string } & PatchIssueBody;
  //   previousIssues: IssueType[] | undefined;
  // }) {
  //   if (!newIssue.listPosition) return;
  //   const previousIssue = previousIssues?.find(
  //     (issue) => issue.key == newIssue.issue_key
  //   );
  //   if (!previousIssue) return;
  //   if (previousIssue.sprintId == newIssue.sprintId) {
  //     // Handle drag and drop within the same sprint
  //     queryClient.setQueryData(
  //       ["issues"],
  //       (old: (IssueType | IssueType["parent"])[] | undefined) => {
  //         if (!old || !newIssue.listPosition) return;
  //         const sortedOld = [...old]
  //           .filter((issue) => issue.sprintId == newIssue.sprintId)
  //           .sort((a, b) => a.listPosition - b.listPosition);
  //         const newIssues = moveIssueWithinList({
  //           issueList: sortedOld,
  //           oldIndex: previousIssue.listPosition,
  //           newIndex: newIssue.listPosition,
  //         });

  //         return [
  //           ...newIssues.map((issue, index) => ({
  //             ...issue,
  //             listPosition: index,
  //           })),
  //           ...old.filter((issue) => issue.sprintId != newIssue.sprintId),
  //         ];
  //       }
  //     );
  //   } else {
  //     // Handle drag and drop between sprints
  //     queryClient.setQueryData(
  //       ["issues"],
  //       (old: (IssueType | IssueType["parent"])[] | undefined) => {
  //         if (!old || !newIssue.listPosition) return;
  //         const newIssues = moveIssueWithinList({
  //           issueList: old.filter(
  //             (issue) => issue.sprintId == newIssue.sprintId
  //           ),
  //           oldIndex: previousIssue.listPosition,
  //           newIndex: newIssue.listPosition,
  //         }).map((issue, index) => ({
  //           ...issue,
  //           listPosition: index,
  //         }));

  //         return [
  //           ...newIssues,
  //           ...old.filter((issue) => issue.sprintId != newIssue.sprintId),
  //         ];
  //       }
  //     );
  //   }

  //   // queryClient.setQueryData(["issues"], (old: IssueType[] | undefined) => {
  //   //   const newIssues = old?.map((issue) => {
  //   //     if (issue.key == newIssue.issue_key && newIssue.listPosition) {
  //   //       // Assign the new values to the issue
  //   //       isDraggingUp
  //   //         ? (newIssue.listPosition += 0.1)
  //   //         : (newIssue.listPosition += 0.1);
  //   //       Object.assign(issue, newIssue);
  //   //     }

  //   //     return issue;
  //   //   });
  //   //   console.log("newIssues", newIssues);
  //   //   return newIssues;
  //   // });
  // }
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
