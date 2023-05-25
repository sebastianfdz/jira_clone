import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Error, type FormValues, Label } from "..";
import clsx from "clsx";

const StartDateField: React.FC<{
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
}> = ({ errors, register }) => {
  return (
    <div className="my-2">
      <Label htmlFor="startDate" text="Start Date" />
      <input
        {...register("startDate", { required: true, valueAsDate: true })}
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

export { StartDateField };
