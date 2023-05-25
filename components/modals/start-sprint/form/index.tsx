import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { type Sprint } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { type FieldError, useForm } from "react-hook-form";
import { NameField } from "./fields/name";
import { DurationField } from "./fields/duration";
import { StartDateField } from "./fields/start-date";
import { EndDateField } from "./fields/end-date";
import { DescriptionField } from "./fields/description";

export type FormValues = {
  name: string;
  duration: "1 week" | "2 weeks" | "3 weeks" | "4 weeks" | "custom";
  startDate: Date;
  endDate: Date;
  description: string;
};

export const DEFAULT_DURATION = "1 week";

const StartSprintForm: React.FC<{ sprint: Sprint }> = ({ sprint }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<FormValues>();
  const { mutate: updateSprint } = useMutation(api.sprints.patchSprint);
  function handleStartSprint(data: FormValues) {
    updateSprint({
      sprintId: sprint.id,
      status: "ACTIVE",
      name: data.name,
      description: data.description,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    });
  }

  return (
    <form
      // eslint-disable-next-line
      onSubmit={handleSubmit(handleStartSprint)}
      className="relative h-full"
    >
      <NameField register={register} errors={errors} />
      <DurationField control={control} errors={errors} />
      <StartDateField register={register} errors={errors} />
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
          className="bg-inprogress px-3 py-1.5 font-medium text-white"
          type="submit"
          name="create"
          aria-label={"create"}
        >
          Start
        </Button>
        <Button
          customColors
          customPadding
          className="px-3 py-1.5 font-medium text-inprogress underline-offset-2 hover:underline hover:brightness-110"
          type="submit"
          name="create"
          aria-label={"create"}
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
