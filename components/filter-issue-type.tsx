import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { capitalize } from "@/utils/helpers";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { type IssueType } from "@/utils/types";
import { ISSUE_TYPES } from "@/components/issue/issue-select-type";
import { IssueIcon } from "@/components/issue/issue-icon";
import { useFiltersContext } from "@/context/use-filters-context";
import { Button } from "@/components/ui/button";
import { CountBall } from "./issue/issue-status-count";

const IssueTypeFilter: React.FC = () => {
  const { issueTypes, setIssueTypes } = useFiltersContext();

  function onSelectChange(
    e: React.ChangeEvent<HTMLInputElement>,
    issueType: IssueType["type"]
  ) {
    if (e.target.checked) {
      setIssueTypes((prev) => [...prev, issueType]);
    } else {
      setIssueTypes((prev) => prev.filter((type) => type !== issueType));
    }
  }
  return (
    <Dropdown>
      <DropdownTrigger className="rounded-[3px] [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
        <Button
          customColors
          className="flex items-center  gap-x-2 transition-all duration-200 hover:bg-gray-200"
        >
          <span className="text-sm">Type</span>
          <CountBall
            count={issueTypes.length}
            className="bg-inprogress text-xs text-white"
            hideOnZero={true}
          />
          <FaChevronDown className="text-xs" />
        </Button>
      </DropdownTrigger>
      <DropdownPortal>
        <DropdownContent
          side="bottom"
          align="start"
          className="z-10 mt-2 w-52 rounded-[3px] border-[0.3px] bg-white py-4 shadow-md"
        >
          {ISSUE_TYPES.map((type) => (
            <DropdownItem
              onSelect={(e) => e.preventDefault()}
              key={type}
              className="px-3 py-1.5 text-sm hover:bg-gray-100"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSelectChange(e, type)
              }
            >
              <div className="flex items-center gap-x-2 hover:cursor-default">
                <label htmlFor="issue-type-filter" className="sr-only">
                  Issue type filter checkbox
                </label>
                <input
                  type="checkbox"
                  id="issue-type-filter"
                  className="form-checkbox h-3 w-3 rounded-sm text-inprogress"
                  checked={issueTypes.includes(type)}
                />

                <IssueIcon issueType={type} />
                <TooltipWrapper text={capitalize(type)}>
                  <span className="text-sm text-gray-700">
                    {capitalize(type)}
                  </span>
                </TooltipWrapper>
              </div>
            </DropdownItem>
          ))}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};

export { IssueTypeFilter };
