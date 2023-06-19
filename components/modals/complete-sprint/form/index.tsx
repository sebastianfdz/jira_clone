import { type Sprint } from "@prisma/client";
import { useForm } from "react-hook-form";
import { SprintDropdownField } from "./fields/sprint-dropdown";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { type IssueType } from "@/utils/types";
import { isDone } from "@/utils/helpers";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { FormSubmit } from "@/components/form/submit";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

export type FormValues = {
  moveToSprintId: string;
};

const CompleteSprintForm: React.FC<{
  sprint: Sprint;
  issues: IssueType[];
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ sprint, setModalIsOpen, issues }) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      moveToSprintId: "backlog",
    },
  });

  const { updateSprint, isUpdating } = useSprints();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { updateIssuesBatch, batchUpdating } = useIssues();

  function handleCompleteSprint(data: FormValues) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateSprint(
      {
        sprintId: sprint.id,
        status: "CLOSED",
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
    updateIssuesBatch({
      ids:
        issues?.filter((issue) => !isDone(issue)).map((issue) => issue.id) ??
        [],
      sprintId: data.moveToSprintId === "backlog" ? null : data.moveToSprintId,
    });
  }

  function handleClose() {
    reset();
    setModalIsOpen(false);
  }

  return (
    <form
      // eslint-disable-next-line
      onSubmit={handleSubmit(handleCompleteSprint)}
      className="relative h-full"
    >
      <SprintDropdownField control={control} errors={errors} />
      <FormSubmit
        submitText="Complete"
        ariaLabel="Complete sprint"
        onCancel={handleClose}
        isLoading={isUpdating || batchUpdating}
      />
    </form>
  );
};

export { CompleteSprintForm };
