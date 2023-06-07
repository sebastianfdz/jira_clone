import { type ReactNode, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import clsx from "clsx";
import { IssueIcon } from "./issue-icon";
import { type IssueType } from "@/utils/types";
import { isEpic } from "@/utils/helpers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { TooltipWrapper } from "../ui/tooltip";

const IssueSelectEpic: React.FC<{
  issue: IssueType;
  children: ReactNode;
  className?: string;
}> = ({ issue, children, className }) => {
  const { issues, updateIssue } = useIssues();
  const [selected, setSelected] = useState<string | null>(issue.parentKey);
  function handleSelect(key: string | null) {
    updateIssue({
      issue_key: issue.key,
      parentKey: key,
    });
    setSelected(key);
  }
  return (
    <Select onValueChange={handleSelect}>
      <TooltipWrapper
        text={`Epic - ${selected ? "Change" : "Add"} epic`}
        side="top"
      >
        <SelectTrigger
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-x-1 rounded-[3px] p-1.5 text-xs font-semibold text-white hover:bg-gray-200 focus:ring-2"
        >
          <SelectValue
            defaultValue={selected ?? undefined}
            className={className}
          >
            {children}
          </SelectValue>
        </SelectTrigger>
      </TooltipWrapper>
      <SelectPortal className="z-50">
        <SelectContent position="popper">
          <SelectViewport className="min-w-60 rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <span className="pl-3 text-xs text-gray-500">EPICS</span>
            <SelectGroup>
              {issues
                ?.filter((issue) => isEpic(issue))
                .map((issue) => (
                  <SelectItem
                    key={issue.key}
                    value={issue.key}
                    className={clsx(
                      "border-l-[3px] border-transparent py-2 pl-3 text-sm hover:cursor-pointer  hover:bg-gray-50 [&[data-state=checked]]:bg-gray-200"
                    )}
                  >
                    <div className="flex items-center">
                      <IssueIcon issueType={issue.type} />
                      <span className="rounded-md bg-opacity-30 pl-4 text-sm">
                        {issue.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectSeparator className="mt-2 h-[1px] bg-gray-300" />
            <button
              onClick={() => handleSelect(null)}
              className="w-full py-3 pl-4 text-left text-sm text-gray-500 hover:bg-gray-100"
            >
              Unlink parent
            </button>
            <button className="w-full py-3 pl-4 text-left text-sm text-gray-500 hover:bg-gray-100">
              View all epics
            </button>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export { IssueSelectEpic };
