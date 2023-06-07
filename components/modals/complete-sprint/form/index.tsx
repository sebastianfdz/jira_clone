import { type Sprint } from "@prisma/client";
import { useForm } from "react-hook-form";
import { SprintDropdownField } from "./fields/sprint-dropdown";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { type IssueType } from "@/utils/types";
import { isDone } from "@/utils/helpers";
import { useSprints } from "@/hooks/query-hooks/useSprints";
import { FormSubmit } from "@/components/form/submit";

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

  const { updateIssuesBatch, batchUpdating } = useIssues();

  function handleCompleteSprint(data: FormValues) {
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
      keys:
        issues?.filter((issue) => !isDone(issue)).map((issue) => issue.key) ??
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
