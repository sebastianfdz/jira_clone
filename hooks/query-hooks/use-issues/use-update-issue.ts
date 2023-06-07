import { type PatchIssueBody } from "@/app/api/issues/[issue_key]/route";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import {
  insertIssueIntoBacklogList,
  insertIssueIntoBoardList,
  isNullish,
  moveIssueWithinBacklogList,
  moveIssueWithinBoardList,
} from "@/utils/helpers";
import { type IssueType } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        // Optimistically update the issue
        if (!isNullish(newIssue.sprintPosition) && !isNullish(previousIssues)) {
          // If sprintPosition OR boardPosition is defined, we are dragging and dropping
          handleOptimisticBacklogDragAndDrop({ previousIssues, newIssue });
        } else if (
          !isNullish(newIssue.boardPosition) &&
          !isNullish(previousIssues)
        ) {
          handleOptimisticBoardDragAndDrop({ previousIssues, newIssue });
        } else {
          // Otherwise, we are generically updating the issue
          queryClient.setQueryData(["issues"], (old?: IssueType[]) => {
            const newIssues = (old ?? []).map((issue) => {
              const { issue_key, ...updatedProps } = newIssue;
              if (issue.key === issue_key) {
                // Assign the new prop values to the issue
                return Object.assign(issue, updatedProps);
              }
              return issue;
            });
            return newIssues;
          });
        }
        // Return a context object with the snapshotted value
        return { previousIssues };
      },
      onError: (err, newIssue, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        console.log("Error update mutation: ", err);
        queryClient.setQueryData(["issues"], context?.previousIssues);
        toast.error({
          message: `Something went wrong while updating the issue ${newIssue.issue_key}`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        if (!queryClient.isMutating({ mutationKey: ["issues"] })) {
          // If there are no other mutations happening, invalidate the cache
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          queryClient.invalidateQueries(["issues"]);
        }
      },
    }
  );
  function handleOptimisticBacklogDragAndDrop({
    previousIssues,
    newIssue,
  }: {
    previousIssues: IssueType[];
    newIssue: { issue_key: string } & PatchIssueBody;
  }) {
    const { issue_key, sprintPosition, sprintId } = newIssue;
    const oldIssue = previousIssues.find((issue) => issue.key === issue_key);
    if (
      isNullish(sprintPosition) ||
      isNullish(oldIssue) ||
      (sprintId === undefined && newIssue.status === undefined)
    ) {
      return;
    }

    queryClient.setQueryData(["issues"], (old?: IssueType[]) => {
      if (isNullish(old)) return;
      if (sprintId === oldIssue.sprintId) {
        // The issue is being moved within the same sprint
        const affectedIssues = old.filter(
          (issue) => issue.sprintId === sprintId
        );
        const unaffectedIssues = old.filter(
          (issue) => issue.sprintId !== sprintId
        );

        const newAffectedIssues = moveIssueWithinBacklogList({
          issueList: affectedIssues,
          oldIndex: oldIssue.sprintPosition,
          newIndex: sprintPosition,
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

        const newSprintIssues = insertIssueIntoBacklogList({
          issueList: destinationList,
          issue: Object.assign(oldIssue, { sprintPosition, sprintId }),
          index: sprintPosition,
        });

        const unaffectedIssues = old.filter(
          (issue) =>
            issue.sprintId !== sprintId && issue.sprintId !== oldSprintId
        );

        return [...unaffectedIssues, ...oldSprintIssues, ...newSprintIssues];
      }
    });
  }

  function handleOptimisticBoardDragAndDrop({
    previousIssues,
    newIssue,
  }: {
    previousIssues: IssueType[];
    newIssue: { issue_key: string } & PatchIssueBody;
  }) {
    const { issue_key, boardPosition, status } = newIssue;
    const oldIssue = previousIssues.find((issue) => issue.key === issue_key);

    console.log("oldIssue", oldIssue);
    console.log("newIssue", newIssue);
    console.log("boardPosition", boardPosition);
    console.log("previousIssues", previousIssues);
    if (
      isNullish(boardPosition) ||
      isNullish(oldIssue) ||
      (status === undefined && newIssue.status === undefined)
    ) {
      return;
    }

    // const sprints = queryClient.getQueryData<Sprint[]>(["sprints"]);

    queryClient.setQueryData(["issues"], (old?: IssueType[]) => {
      if (isNullish(old) || isNullish(oldIssue.boardPosition)) return;
      if (status === oldIssue.status) {
        // MOVE WITHIN COLUMN

        const affectedIssues = old.filter(
          (issue) => issue.status === oldIssue.status && issue.sprintIsActive
          // issueSprintIsActive(issue, sprints)
        );
        const unaffectedIssues = old.filter(
          (issue) => issue.status !== oldIssue.status
        );

        const newAffectedIssues = moveIssueWithinBoardList({
          issueList: affectedIssues,
          oldIndex: oldIssue.boardPosition,
          newIndex: boardPosition,
        });
        return [...unaffectedIssues, ...newAffectedIssues];
      } else {
        // MOVE BETWEEN COLUMNS

        const { status: oldStatus } = oldIssue;
        const sourceColumnIssues = old.filter(
          (issue) =>
            issue.status === oldIssue.status &&
            issue.key !== oldIssue.key &&
            issue.sprintIsActive
          // issueSprintIsActive(issue, sprints)
        );

        const destinationColumnIssues = old.filter(
          (issue) => issue.status === status && issue.sprintIsActive
          // issueSprintIsActive(issue, sprints)
        );

        const newDestinationColumnIssues = insertIssueIntoBoardList({
          issueList: destinationColumnIssues,
          issue: Object.assign(oldIssue, { boardPosition, status }),
          index: boardPosition,
        });

        const unaffectedIssues = old.filter(
          (issue) =>
            (issue.status !== status && issue.status !== oldStatus) ||
            !issue.sprintIsActive
          // !issueSprintIsActive(issue, sprints)
        );

        return [
          ...unaffectedIssues,
          ...sourceColumnIssues,
          ...newDestinationColumnIssues,
        ];
      }
    });
  }
  return { updateIssue, isUpdating };
};

export { useUpdateIssue };
