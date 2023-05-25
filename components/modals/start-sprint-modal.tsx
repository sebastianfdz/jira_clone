"use client";
import { Fragment, useState, type ReactNode, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "../ui/modal";
import {
  type FieldValues,
  useForm,
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type FieldError,
} from "react-hook-form";
import clsx from "clsx";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "../ui/select";
import { FaChevronDown } from "react-icons/fa";

const StartSprintModal: React.FC<{
  children: ReactNode;
  issueCount: number;
}> = ({ children, issueCount }) => {
  return (
    <Modal>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <ModalTitle>Start Sprint</ModalTitle>
          <ModalDescription>
            {issueCount} {issueCount > 1 ? "issues" : "issue"} will be included
            in this sprint.
          </ModalDescription>
          <StartSprintForm />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

type FormValues = {
  sprintName: string;
  duration: "1 week" | "2 weeks" | "3 weeks" | "4 weeks" | "custom";
  startDate: Date;
  endDate: Date;
  sprintGoal: string;
};

const StartSprintForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    getValues,
  } = useForm<FormValues>();
  function handleStartSprint(data: FieldValues) {
    console.log(data);
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
        key={getValues().duration}
        startDate={getValues().startDate}
        duration={getValues().duration}
        register={register}
        errors={errors}
      />
      <SprintGoalField register={register} />

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

const NameField: React.FC<{
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
}> = ({ errors, register }) => {
  return (
    <div className="my-2">
      <Label htmlFor="sprintName" text="Sprint Name" />
      <input
        {...register("sprintName", { required: true })}
        aria-invalid={errors.sprintName ? "true" : "false"}
        type="text"
        id="sprintName"
        className={clsx(
          errors.sprintName
            ? "focus:outline-red-500"
            : "focus:outline-blue-400",
          "form-input block h-10 w-64 rounded-[3px] border border-gray-300 px-2 text-sm shadow-sm outline-2 transition-all duration-200"
        )}
      />
      <Error trigger={errors.sprintName} message="Sprint name is required" />
    </div>
  );
};

const DurationField: React.FC<{
  control: Control<FormValues, "duration">;
  errors: FieldErrors<FormValues>;
}> = ({ control, errors }) => {
  const durationOptions = ["1 week", "2 weeks", "3 weeks", "4 weeks", "custom"];

  return (
    <Fragment>
      <Label htmlFor="duration" text="Duration" />
      <Controller
        control={control}
        name="duration"
        defaultValue="1 week"
        render={({ field }) => {
          return (
            <Select onValueChange={field.onChange} defaultValue="1 week">
              <SelectTrigger className="flex h-10 w-64 items-center justify-between rounded-[3px] bg-gray-100 px-2 text-xs font-semibold transition-all duration-200 hover:bg-gray-200 focus:ring-2">
                <SelectValue />
                <SelectIcon>
                  <FaChevronDown className="text-gray-500" />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal className="z-[999]">
                <SelectContent position="popper">
                  <SelectViewport className="w-64 rounded-md border border-gray-300 bg-white py-2 shadow-md">
                    <SelectGroup>
                      {durationOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className={clsx(
                            "border-l-2 border-transparent py-2 pl-3 text-sm hover:cursor-default hover:border-inprogress hover:bg-gray-100 [&[data-state=checked]]:border-inprogress [&[data-state=checked]]:bg-blue-100 [&[data-state=checked]]:text-blue-600"
                          )}
                        >
                          <span className={clsx("px-2 text-xs")}>{option}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </Select>
          );
        }}
      />

      <Error trigger={errors.duration} message="Duration is required" />
    </Fragment>
  );
};

const StartDateField: React.FC<{
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
}> = ({ errors, register }) => {
  return (
    <div className="my-2">
      <Label htmlFor="startDate" text="Start Date" />
      <input
        {...register("startDate", { required: true })}
        aria-invalid={errors.startDate ? "true" : "false"}
        type="date"
        defaultValue={new Date().toISOString().slice(0, 10)}
        id="startDate"
        className={clsx(
          errors.startDate ? "focus:outline-red-500" : "focus:outline-blue-400",
          "form-input block h-10 w-64 rounded-[3px] border border-gray-300 px-2 text-sm shadow-sm outline-2 transition-all duration-200"
        )}
      />
      <Error trigger={errors.startDate} message="Start date is required" />
    </div>
  );
};

const EndDateField: React.FC<{
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
  startDate: FormValues["startDate"];
  duration: FormValues["duration"];
}> = ({ errors, register, startDate, duration }) => {
  //   const currentDate = new Date(startDate);
  const [endDate, setEndDate] = useState(new Date());

  function calculateMillisecondsFromDuration(
    duration: FormValues["duration"] | undefined
  ) {
    if (duration === "custom" || !duration) return 0;
    console.log(duration);
    const durationInWeeks = parseInt(duration.split(" ")[0] as string);

    return durationInWeeks * 7 * 24 * 60 * 60 * 1000;
  }

  useEffect(() => {
    if (!startDate || !duration) return;
    const currentDate = new Date(startDate);
    setEndDate(
      new Date(
        currentDate.getTime() + calculateMillisecondsFromDuration(duration)
      )
    );
  }, [duration, startDate]);

  return (
    <div className="my-2">
      <Label htmlFor="endDate" text="End Date" />
      <input
        {...register("endDate", {
          required: true,
          validate: {
            endDateAfterStartDate: (value) => {
              const endDate = new Date(value);
              const _startDate = new Date(startDate);
              return endDate > _startDate;
            },
          },
        })}
        aria-invalid={errors.endDate ? "true" : "false"}
        type="date"
        defaultValue={endDate.toISOString().slice(0, 10)}
        id="endDate"
        className={clsx(
          errors.endDate ? "focus:outline-red-500" : "focus:outline-blue-400",
          "form-input block h-10 w-64 rounded-[3px] border border-gray-300 px-2 text-sm shadow-sm outline-2 transition-all duration-200"
        )}
      />
      <Error
        trigger={errors.endDate}
        message="The end date of a sprint must be after the start date."
      />
    </div>
  );
};

const SprintGoalField: React.FC<{
  register: UseFormRegister<FormValues>;
}> = ({ register }) => {
  return (
    <div className="my-2">
      <Label htmlFor="sprintGoal" text="Sprint Goal" required={false} />
      <input
        {...register("sprintGoal")}
        type="text"
        id="sprintGoal"
        className="form-input block h-32 w-[500px] rounded-[3px] border border-gray-300 px-2 text-sm shadow-sm outline-2 transition-all duration-200 focus:outline-blue-400"
      />
    </div>
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
export { StartSprintModal };
