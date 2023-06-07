import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { type FormValues } from "..";
import { Label } from "@/components/form/label";
import { Error } from "@/components/form/error";
import clsx from "clsx";
import { FaChevronDown } from "react-icons/fa";
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
} from "@/components/ui/select";
import { useSprints } from "@/hooks/query-hooks/use-sprints";

const SprintDropdownField: React.FC<{
  control: Control<FormValues, "duration">;
  errors: FieldErrors<FormValues>;
}> = ({ control, errors }) => {
  const { sprints } = useSprints();
  const backlog = { id: "backlog", name: "Backlog", status: "PENDING" };

  return (
    <div className="my-5">
      <Label htmlFor="duration" text="Move open issues to" required={false} />
      <Controller
        control={control}
        name="moveToSprintId"
        render={({ field }) => {
          return (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="flex h-10 w-full max-w-full items-center justify-between overflow-hidden whitespace-nowrap rounded-[3px] bg-gray-100 px-2 text-xs font-semibold transition-all duration-200 hover:bg-gray-200 focus:ring-2">
                <SelectValue />
                <SelectIcon>
                  <FaChevronDown className="text-gray-500" />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal className="z-50">
                <SelectContent position="popper">
                  <SelectViewport className="w-96 min-w-fit rounded-md border border-gray-300 bg-white py-2 shadow-md">
                    <SelectGroup>
                      {sprints &&
                        [...sprints, backlog]
                          ?.filter((sprint) => sprint.status === "PENDING")
                          ?.map((sprint) => (
                            <SelectItem
                              key={sprint.id}
                              value={sprint.id}
                              className={clsx(
                                "border-l-2 border-transparent py-2 pl-3 text-sm hover:cursor-default hover:border-inprogress hover:bg-gray-100 [&[data-state=checked]]:border-inprogress [&[data-state=checked]]:bg-blue-100 [&[data-state=checked]]:text-blue-600"
                              )}
                            >
                              <span className={clsx("px-2 text-xs")}>
                                {sprint.name}
                              </span>
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
      <Error trigger={errors.moveToSprintId} message="New sprint is required" />
    </div>
  );
};

export { SprintDropdownField };
