"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const usePostIssue = () => {
  const queryClient = useQueryClient();

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
  return { createIssue, isCreating };
};

export { usePostIssue };
