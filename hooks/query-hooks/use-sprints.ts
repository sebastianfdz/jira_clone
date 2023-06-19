"use client";
import { toast } from "@/components/toast";
import { api } from "@/utils/api";
import { type Sprint } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { TOO_MANY_REQUESTS } from "./use-issues";

export const useSprints = () => {
  const queryClient = useQueryClient();

  // GET
  const { data: sprints, isLoading: sprintsLoading } = useQuery(
    ["sprints"],
    api.sprints.getSprints,
    {
      refetchOnMount: false,
    }
  );

  // UPDATE
  const { mutate: updateSprint, isLoading: isUpdating } = useMutation(
    api.sprints.patchSprint,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (newSprint) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(["sprints"]);
        // Snapshot the previous value
        const previousSprints = queryClient.getQueryData<Sprint[]>(["sprints"]);
        // Optimistically update the sprint

        // Otherwise, we are generically updating the sprint
        queryClient.setQueryData(["sprints"], (old?: Sprint[]) => {
          const newSprints = (old ?? []).map((sprint) => {
            const { sprintId, ...updatedProps } = newSprint;
            if (sprint.id === sprintId) {
              // Assign the new prop values to the sprint
              return Object.assign(sprint, updatedProps);
            }
            return sprint;
          });
          return newSprints;
        });

        // Return a context object with the snapshotted value
        return { previousSprints };
      },
      onError: (err: AxiosError, newSprint, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        queryClient.setQueryData(["sprints"], context?.previousSprints);

        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while updating sprint ${newSprint.sprintId}`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["sprints"]);
      },
    }
  );

  // POST
  const { mutate: createSprint, isLoading: isCreating } = useMutation(
    api.sprints.postSprint,
    {
      // NO OPTIMISTIC UPDATE BECAUSE WE DON'T KNOW THE KEY OF THE NEW SPRINT
      onError: (err: AxiosError) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while creating sprint`,
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["sprints"]);
      },
    }
  );

  // DELETE
  const { mutate: deleteSprint, isLoading: isDeleting } = useMutation(
    api.sprints.deleteSprint,
    {
      // OPTIMISTIC UPDATE
      onMutate: async (deletedSprint) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["sprints"] });
        // Snapshot the previous value
        const previousSprints = queryClient.getQueryData<Sprint[]>(["sprints"]);
        // Optimistically delete the sprint
        queryClient.setQueryData(["sprints"], (old: Sprint[] | undefined) => {
          return old?.filter((sprint) => sprint.id !== deletedSprint.sprintId);
        });
        // Return a context object with the snapshotted value
        return { previousSprints };
      },
      onError: (err: AxiosError, deletedSprint, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (err?.response?.data == "Too many requests") {
          toast.error(TOO_MANY_REQUESTS);
          return;
        }
        toast.error({
          message: `Something went wrong while deleting the sprint ${deletedSprint.sprintId}`,
          description: "Please try again later.",
        });
        queryClient.setQueryData(["sprints"], context?.previousSprints);
      },
      onSettled: () => {
        // Always refetch after error or success
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["sprints"]);
      },
    }
  );

  return {
    sprints,
    sprintsLoading,
    updateSprint,
    isUpdating,
    createSprint,
    isCreating,
    deleteSprint,
    isDeleting,
  };
};
