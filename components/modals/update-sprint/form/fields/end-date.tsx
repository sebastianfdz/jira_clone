import { useCallback, useEffect, useState } from "react";
import { type FormValues, DEFAULT_DURATION } from "..";
import { Label } from "@/components/form/label";
import { Error } from "@/components/form/error";
import clsx from "clsx";
import {
  type UseFormSetValue,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

const EndDateField: React.FC<{
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
  duration: FormValues["duration"];
  startDate: FormValues["startDate"];
  setValue: UseFormSetValue<FormValues>;
}> = ({ errors, register, duration, startDate, setValue }) => {
  const [endDate, setEndDate] = useState(() => new Date());

  const calculateEndDate = useCallback(
    (duration: FormValues["duration"], startDate: FormValues["startDate"]) => {
      if (duration === "custom") return;
      const milliseconds = calculateMillisecondsFromDuration(
        duration ?? DEFAULT_DURATION
      );
      const _startDate = new Date(startDate ?? new Date());
      const _endDate = new Date(_startDate.getTime() + milliseconds);
      setEndDate(_endDate);
      setValue("endDate", _endDate);
    },
    [setValue]
  );

  useEffect(() => {
    calculateEndDate(duration, startDate);
  }, [duration, startDate, calculateEndDate]);

  function calculateMillisecondsFromDuration(
    duration: FormValues["duration"] | undefined
  ) {
    if (!duration || duration === "custom") return 0;
    const numberOfWeeks = parseInt(duration.split(" ")[0] as string);
    return numberOfWeeks * 7 * 24 * 60 * 60 * 1000;
  }

  function validateEndDate() {
    if (!endDate) return false;
    return new Date(startDate) <= new Date(endDate);
  }

  function handleCustomChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.value) return;
    const newDate = new Date(event.target.value);
    setEndDate(newDate);
    setValue("endDate", newDate);
  }

  return (
    <div className="my-2">
      <Label htmlFor="endDate" text="End Date" />
      <input
        {...register("endDate", {
          required: duration === "custom" ? true : false,
          valueAsDate: true,
          validate: {
            startDateBeforeEndDate: () => validateEndDate(),
          },
        })}
        aria-invalid={errors.endDate ? "true" : "false"}
        type="date"
        disabled={duration !== "custom"}
        value={endDate.toISOString().slice(0, 10)}
        onChange={handleCustomChange}
        id="endDate"
        className={clsx(
          duration === "custom" ? "" : "bg-gray-200 opacity-50",
          errors.endDate ? "focus:outline-red-500" : "focus:outline-blue-400",
          "block h-10 w-64 rounded-[3px] border border-gray-300 px-2 text-sm shadow-sm outline-2 transition-all duration-75"
        )}
      />
      <Error
        trigger={errors.endDate}
        message="The end date of a sprint must be after the start date."
      />
    </div>
  );
};

export { EndDateField };
