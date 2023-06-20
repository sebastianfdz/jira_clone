import { type UseFormRegister } from "react-hook-form";
import { type FormValues } from "..";
import { Label } from "@/components/form/label";

const DescriptionField: React.FC<{
  register: UseFormRegister<FormValues>;
}> = ({ register }) => {
  return (
    <div className="my-2">
      <Label htmlFor="description" text="Sprint Goal" required={false} />
      <textarea
        {...register("description")}
        id="description"
        className="block h-32 w-[500px] rounded-[3px] border border-gray-300 p-2 text-sm shadow-sm outline-2 transition-all duration-75 focus:outline-blue-400"
      />
    </div>
  );
};

export { DescriptionField };
