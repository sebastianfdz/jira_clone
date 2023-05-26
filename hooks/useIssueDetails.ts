import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import { type GetIssueCommentsResponse } from "@/app/api/issues/[issue_key]/comments/route";
import { toast } from "@/components/toast";

export const useIssueDetails = () => {
  const { issueId } = useSelectedIssueContext();
  const queryClient = useQueryClient();
  // GET
  const { data: comments, isLoading: commentsLoading } = useQuery(
    ["issues", "comments", issueId],
    () => api.issues.getIssueComments({ issue_key: issueId ?? "" }),
    {
      enabled: !!issueId,
      refetchOnMount: false,
    }
  );

  // POST
  const { mutate: addComment, isLoading: isAddingComment } = useMutation(
    api.issues.addCommentToIssue,
    {
      onSuccess: (newComment) => {
        console.log("newComment", newComment);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues", "comments", issueId]);
      },
    }
  );

  const { mutate: updateComment, isLoading: commentUpdating } = useMutation(
    api.issues.updateIssueComment,
    {
      onMutate: async (newComment) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["issues", "comments", issueId]);
        // Snapshot the previous value
        const previousComments = queryClient.getQueryData<
          GetIssueCommentsResponse["comments"]
        >(["issues", "comments", issueId]);
        // Optimistically update the comment
        queryClient.setQueryData(
          ["issues", "comments", issueId],
          (old?: GetIssueCommentsResponse["comments"]) => {
            const newComments = (old ?? []).map((comment) => {
              const { content } = newComment;
              if (comment.id === newComment.commentId) {
                // Assign the new prop values to the comment
                return { ...comment, content };
              }
              return comment;
            });
            return newComments;
          }
        );
        // Return a context object with the snapshotted value
        return { previousComments };
      },
      onError: (err, newIssue, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(
          ["issues", "comments", issueId],
          context?.previousComments
        );
        toast.error({
          message: `Something went wrong while updating comment`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues", "comments", issueId]);
      },
    }
  );
  return {
    comments,
    commentsLoading,
    addComment,
    isAddingComment,
    updateComment,
    commentUpdating,
  };
};
