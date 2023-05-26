import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { type Sprint } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FieldError, useForm } from "react-hook-form";
import { NameField } from "./fields/name";
import { DurationField } from "./fields/duration";
import { StartDateField } from "./fields/start-date";
import { EndDateField } from "./fields/end-date";
import { DescriptionField } from "./fields/description";
import { Spinner } from "@/components/ui/spinner";

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
  const { mutate: updateSprint, isLoading: isUpdating } = useMutation(
    api.sprints.patchSprint
  );
  const queryClient = useQueryClient();
  function handleStartSprint(data: FormValues) {
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

      <div className="flex w-full justify-end">
        <Button
          customColors
          customPadding
          className="flex items-center gap-x-2 bg-inprogress px-3 py-1.5 font-medium text-white"
          type="submit"
          name="start"
          disabled={isUpdating}
          aria-label={"start"}
        >
          <span>Start</span>
          {isUpdating ? <Spinner white size="sm" /> : null}
        </Button>

        <Button
          customColors
          customPadding
          onClick={handleClose}
          className="px-3 py-1.5 font-medium text-inprogress underline-offset-2 hover:underline hover:brightness-110"
          name="cancel"
          aria-label={"cancel"}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

const Label: React.FC<
  { text: string; required?: boolean } & React.HTMLProps<HTMLLabelElement>
> = ({ text, required = true, ...props }) => {
  return (
    <label
      {...props}
      className="my-1 flex gap-x-1 text-xs font-medium text-gray-500"
    >
      {text}
      {required ? <span className="text-red-600">*</span> : null}
    </label>
  );
};

const Error: React.FC<{ trigger: FieldError | undefined; message: string }> = ({
  message,
  trigger,
}) => {
  if (!trigger) return null;
  return (
    <span role="alert" className="text-xs text-red-600">
      {message} *
    </span>
  );
};
export { StartSprintForm, Error, Label };
