import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { type FormValues } from "..";
import { Label } from "@/components/form/label";
import { Error } from "@/components/form/error";
import clsx from "clsx";
import { Fragment } from "react";

const StartDateField: React.FC<{
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
  control: Control<FormValues, "startDate">;
}> = ({ errors, register, control }) => {
  return (
    <div className="my-2">
      <Label htmlFor="startDate" text="Start Date" />
      <Controller
        control={control}
        name="startDate"
        render={({ field: { value, onChange } }) => {
          return (
            <Fragment>
              <label htmlFor="startDate" className="sr-only">
                Sprint start date picker
              </label>
              <input
                {...register("startDate", {
                  required: true,
                  valueAsDate: true,
                })}
                aria-invalid={errors.startDate ? "true" : "false"}
                type="date"
                value={value.toISOString().slice(0, 10)}
                onChange={(e) => onChange(new Date(e.target.value))}
                id="startDate"
                className={clsx(
                  errors.startDate
                    ? "focus:outline-red-500"
                    : "focus:outline-blue-400",
                  "block h-10 w-64 rounded-[3px] border border-gray-300 px-2 text-sm shadow-sm outline-2 transition-all duration-75"
                )}
              />
            </Fragment>
          );
        }}
      />
      <Error trigger={errors.startDate} message="Start date is required" />
    </div>
  );
};

export { StartDateField };
