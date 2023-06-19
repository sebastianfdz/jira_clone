"use client";
import { type Sprint } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { NameField } from "./fields/name";
import { DurationField } from "./fields/duration";
import { StartDateField } from "./fields/start-date";
import { EndDateField } from "./fields/end-date";
import { DescriptionField } from "./fields/description";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { FormSubmit } from "@/components/form/submit";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

export type FormValues = {
  name: string;
  duration: "1 week" | "2 weeks" | "3 weeks" | "4 weeks" | "custom";
  startDate: Date;
  endDate: Date;
  description: string;
};

export const DEFAULT_DURATION = "1 week";

const StartSprintForm: React.FC<{
  sprint: Sprint;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ sprint, setModalIsOpen }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: sprint.name,
      duration: (sprint.duration as FormValues["duration"]) ?? DEFAULT_DURATION,
      startDate: sprint.startDate ? new Date(sprint.startDate) : new Date(),
      endDate: sprint.endDate ? new Date(sprint.endDate) : new Date(),
      description: sprint.description ?? "",
    },
  });
  const { updateSprint, isUpdating } = useSprints();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  const queryClient = useQueryClient();

  function handleStartSprint(data: FormValues) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    updateSprint(
      {
        sprintId: sprint.id,
        status: "ACTIVE",
        name: data.name,
        duration: data.duration ?? DEFAULT_DURATION,
        description: data.description,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      },
      {
        onSuccess: () => {
          // eslint-disable-next-line
          queryClient.invalidateQueries(["issues"]);
          handleClose();
        },
      }
    );
  }

  function handleClose() {
    reset();
    setModalIsOpen(false);
  }

  return (
    <form
      // eslint-disable-next-line
      onSubmit={handleSubmit(handleStartSprint)}
      className="relative h-full"
    >
      <NameField register={register} errors={errors} />
      <DurationField control={control} errors={errors} />
      <StartDateField register={register} errors={errors} control={control} />
      <EndDateField
        register={register}
        errors={errors}
        duration={watch("duration")}
        startDate={watch("startDate")}
        setValue={setValue}
      />
      <DescriptionField register={register} />
      <FormSubmit
        submitText="Start"
        ariaLabel="Start sprint"
        onCancel={handleClose}
        isLoading={isUpdating}
      />
    </form>
  );
};

export { StartSprintForm };
