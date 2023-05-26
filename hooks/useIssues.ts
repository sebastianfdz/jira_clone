import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type IssueType } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelectedIssueContext } from "@/context/useSelectedIssue";
import { type PatchIssueBody } from "@/app/api/issues/[issue_key]/route";
import {
  insertIssueIntoList,
  isNullish,
  moveIssueWithinList,
} from "@/utils/helpers";

export const useIssues = () => {
  const { issueId, setIssueId } = useSelectedIssueContext();
  const queryClient = useQueryClient();
  // GET
  const { data: issues, isLoading: issuesLoading } = useQuery(
    ["issues"],
    api.issues.getIssues,
    {
      refetchOnMount: false,
    }
  );

  // UPDATE BATCH
  const { mutate: updateIssuesBatch, isLoading: batchUpdating } = useMutation(
    api.issues.updateBatchIssues,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newIssue) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["issues"]);
        // Snapshot the previous value
        const previousIssues = queryClient.getQueryData<
          (IssueType | IssueType["parent"])[]
        >(["issues"]);

        // Optimistically updating the issues
        queryClient.setQueryData(
          ["issues"],
          (old?: (IssueType | IssueType["parent"])[]) => {
            const newIssues = (old ?? []).map((issue) => {
              const { keys, ...updatedProps } = newIssue;
              if (keys.includes(issue.key)) {
                // Assign the new prop values to the issue
                return Object.assign(issue, updatedProps);
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

  // UPDATE
  const { mutate: updateIssue, isLoading: isUpdating } = useMutation(
    api.issues.patchIssue,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newIssue) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["issues"]);
        // Snapshot the previous value
        const previousIssues = queryClient.getQueryData<
          (IssueType | IssueType["parent"])[]
        >(["issues"]);
        // Optimistically update the issue
        if (!isNullish(newIssue.listPosition) && !isNullish(previousIssues)) {
          // If listPosition is defined, we are dragging and dropping
          handleOptimisticDrangAndDrop({ previousIssues, newIssue });
        } else {
          // Otherwise, we are generically updating the issue
          queryClient.setQueryData(
            ["issues"],
            (old?: (IssueType | IssueType["parent"])[]) => {
              const newIssues = (old ?? []).map((issue) => {
                const { issue_key, ...updatedProps } = newIssue;
                if (issue.key === issue_key) {
                  // Assign the new prop values to the issue
                  return Object.assign(issue, updatedProps);
                }
                return issue;
              });
              return newIssues;
            }
          );
        }
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

  function handleOptimisticDrangAndDrop({
    previousIssues,
    newIssue,
  }: {
    previousIssues: (IssueType | IssueType["parent"])[];
    newIssue: { issue_key: string } & PatchIssueBody;
  }) {
    const { issue_key, listPosition, sprintId } = newIssue;
    const oldIssue = previousIssues.find((issue) => issue.key === issue_key);
    if (
      isNullish(listPosition) ||
      isNullish(oldIssue) ||
      sprintId === undefined
    ) {
      return;
    }

    queryClient.setQueryData(
      ["issues"],
      (old?: (IssueType | IssueType["parent"])[]) => {
        if (isNullish(old)) return;
        if (sprintId === oldIssue.sprintId) {
          // The issue is being moved within the same sprint
          const affectedIssues = old.filter(
            (issue) => issue.sprintId === sprintId
          );
          const unaffectedIssues = old.filter(
            (issue) => issue.sprintId !== sprintId
          );

          const newAffectedIssues = moveIssueWithinList({
            issueList: affectedIssues,
            oldIndex: oldIssue.listPosition,
            newIndex: listPosition,
          });
          return [...unaffectedIssues, ...newAffectedIssues];
        } else {
          // The issue is being moved to a different sprint
          const { sprintId: oldSprintId } = oldIssue;
          const oldSprintIssues = old.filter(
            (issue) =>
              issue.sprintId === oldIssue.sprintId && issue.key !== oldIssue.key
          );

          const destinationList = old.filter(
            (issue) => issue.sprintId === sprintId
          );

          const newSprintIssues = insertIssueIntoList({
            issueList: destinationList,
            issue: Object.assign(oldIssue, { listPosition, sprintId }),
            index: listPosition,
          });

          const unaffectedIssues = old.filter(
            (issue) =>
              issue.sprintId !== sprintId && issue.sprintId !== oldSprintId
          );

          return [...unaffectedIssues, ...oldSprintIssues, ...newSprintIssues];
        }
      }
    );
  }

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
