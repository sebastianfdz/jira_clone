import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { type IssueType } from "@/components/backlog/issue";
import { NotImplemented } from "@/components/not-implemented";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";

const IssueStatusSelect: React.FC<{ currentStatus: IssueType["status"] }> = ({
  currentStatus,
}) => {
  const statuses = [
    { value: "TODO", color: "#52525b" },
    { value: "IN PROGRESS", color: "#1e40af" },
    { value: "DONE", color: "#15803d" },
  ];
  const [selected, setSelected] = useState(currentStatus ?? "TODO");
  return (
    <Select
      onValueChange={
        setSelected as React.Dispatch<React.SetStateAction<string>>
      }
    >
      <SelectTrigger
        style={{
          backgroundColor:
            statuses.find((status) => status.value == selected)?.color ??
            "#1e40af",
        }}
        className="mx-2 flex items-center gap-x-1 rounded-md bg-opacity-30 px-1.5 py-0.5 text-xs font-semibold text-white focus:ring-2"
      >
        <SelectValue className="w-full bg-transparent text-white">
          {selected}
        </SelectValue>
        <SelectIcon>
          <FaChevronDown className="text-xs" />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal className="">
        <SelectContent>
          <SelectViewport className="top-10 w-60 rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <SelectGroup>
              {statuses.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className={clsx(
                    "border-l-[3px] border-transparent py-1 pl-2 text-sm hover:cursor-default hover:border-blue-600 hover:bg-zinc-50"
                  )}
                >
                  <span
                    style={{ color: status.color }}
                    className={clsx(
                      "rounded-md bg-opacity-30 px-2 text-xs font-semibold"
                    )}
                  >
                    {status.value}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator className="mt-2 h-[1px] bg-gray-300" />
            <NotImplemented feature="workflow">
              <button className="w-full border py-4 pl-5 text-left text-sm font-medium hover:cursor-default hover:bg-zinc-100">
                View Workflow
              </button>
            </NotImplemented>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export { IssueStatusSelect };