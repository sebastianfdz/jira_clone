import { Fragment } from "react";
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
import { Label } from "@/components/form/label";
import { useSprints } from "@/hooks/query-hooks/use-sprints";

const SprintDropdown: React.FC = () => {
  const { sprints } = useSprints();
  const backlog = { id: "backlog", name: "Backlog", status: "PENDING" };
  return (
    <Fragment>
      <Label
        htmlFor="open-issues"
        text="Move open issues to"
        required={false}
      />
      <Select name="open-issues">
        <SelectTrigger className="flex h-10 w-[400px] items-center justify-between rounded-[3px] bg-gray-100 px-2 text-xs font-semibold transition-all duration-200 hover:bg-gray-200 focus:outline-blue-400 focus:ring-2">
          <SelectValue />
          <SelectIcon>
            <FaChevronDown className="text-gray-500" />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal className="z-50">
          <SelectContent position="popper" className="w-full">
            <SelectViewport className=" w-[400px] rounded-md border border-gray-300 bg-white py-2 shadow-md">
              <SelectGroup>
                {sprints &&
                  [...sprints, backlog]
                    ?.filter((sprint) => sprint.status === "PENDING")
                    ?.map((sprint) => (
                      <SelectItem
                        key={sprint.id}
                        value={sprint.name}
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
    </Fragment>
  );
};

export { SprintDropdown };
