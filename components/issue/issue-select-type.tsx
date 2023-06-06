import { useState } from "react";
import clsx from "clsx";
import { type IssueType } from "@/utils/types";
import { IssueIcon } from "./issue-icon";
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
import { TooltipWrapper } from "../ui/tooltip";
import { capitalize } from "@/utils/helpers";

export const ISSUE_TYPES: IssueType["type"][] = ["STORY", "TASK", "BUG"];
const SUBTASK_OPTIONS: IssueType["type"][] = ["SUBTASK"];
const IssueSelectType: React.FC<{
  currentType: IssueType["type"];
  dropdownIcon?: boolean;
  onSelect?: (type: IssueType["type"]) => void;
}> = ({ currentType, dropdownIcon, onSelect }) => {
  const [selected, setSelected] = useState(currentType);

  function handleSelect(selected: string) {
    const _selected = selected as IssueType["type"];
    if (onSelect) {
      onSelect(_selected);
    }
    setSelected(_selected);
  }
  return (
    <Select onValueChange={handleSelect}>
      <TooltipWrapper
        text={`${capitalize(selected)} - Change issue type`}
        side="top"
      >
        <SelectTrigger className="flex items-center gap-x-1 rounded-[3px] bg-opacity-30 p-1.5 text-xs font-semibold text-white hover:bg-gray-200 focus:ring-2">
          <SelectValue>
            <IssueIcon issueType={selected} />
          </SelectValue>
          {dropdownIcon ? (
            <SelectIcon>
              <FaChevronDown className="text-gray-500" />
            </SelectIcon>
          ) : null}
        </SelectTrigger>
      </TooltipWrapper>
      <SelectPortal className="z-50">
        <SelectContent position="popper">
          <SelectViewport className="w-52 rounded-md border border-gray-300 bg-white py-2 shadow-md">
            <span className="pl-3 text-xs text-gray-500">
              CHANGE ISSUE TYPE
            </span>
            <SelectGroup>
              {(currentType === "SUBTASK" ? SUBTASK_OPTIONS : ISSUE_TYPES).map(
                (type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className={clsx(
                      "border-transparent py-2 pl-3 text-sm hover:cursor-default hover:bg-gray-50"
                    )}
                  >
                    <div className="flex">
                      <IssueIcon issueType={type} />
                      <span className={clsx("px-2 text-xs")}>{type}</span>
                    </div>
                  </SelectItem>
                )
              )}
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export { IssueSelectType };
