import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { type FormValues } from "..";
import { Label } from "@/components/form/label";
import { Error } from "@/components/form/error";
import clsx from "clsx";

const NameField: React.FC<{
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
}> = ({ errors, register }) => {
  return (
    <div className="my-2">
      <Label htmlFor="name" text="Sprint Name" />
      <input
        {...register("name", { required: true })}
        aria-invalid={errors.name ? "true" : "false"}
        type="text"
        id="name"
        className={clsx(
          errors.name ? "focus:outline-red-500" : "focus:outline-blue-400",
          "block h-10 w-64 rounded-[3px] border border-gray-300 px-2 text-sm shadow-sm outline-2 ring-0 transition-all duration-75"
        )}
      />
      <Error trigger={errors.name} message="Sprint name is required" />
    </div>
  );
};

export { NameField };
