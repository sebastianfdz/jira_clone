"use client";
import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { type GetIssueCommentsResponse } from "@/app/api/issues/[issueId]/comments/route";
import { toast } from "@/components/toast";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS, useIssues } from "./use-issues";
import { useCallback, useEffect, useState } from "react";
import { type IssueType } from "@/utils/types";

export const useIssueDetails = () => {
  const { issueKey } = useSelectedIssueContext();
  const { issues } = useIssues();

  const getIssueId = useCallback(
    (issues: IssueType[] | undefined) => {
      return issues?.find((issue) => issue.key === issueKey)?.id ?? null;
    },
    [issueKey]
  );

  const [issueId, setIssueId] = useState<IssueType["id"] | null>(() =>
    getIssueId(issues)
  );

  useEffect(() => {
    setIssueId(getIssueId(issues));
  }, [setIssueId, getIssueId, issues]);

  const queryClient = useQueryClient();

  // GET
  const { data: comments, isLoading: commentsLoading } = useQuery(
    ["issues", "comments", issueId],
    () => api.issues.getIssueComments({ issueId: issueId ?? "" }),
    {
      enabled: !!issueId,
      refetchOnMount: false,
    }
  );

  // POST
  const { mutate: addComment, isLoading: isAddingComment } = useMutation(
    api.issues.addCommentToIssue,
    {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues", "comments", issueId]);
      },
      onError: (err: AxiosError) => {
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while creating comment`,
          description: "Please try again later.",
        });
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
      onError: (err: AxiosError, newIssue, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(
          ["issues", "comments", issueId],
          context?.previousComments
        );

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }

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
