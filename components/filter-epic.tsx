import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { isEpic } from "@/utils/helpers";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { type IssueType } from "@/utils/types";
import { useFiltersContext } from "@/context/use-filters-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./filter-search-bar";
import { CountBall } from "./issue/issue-status-count";
const EpicFilter: React.FC = () => {
  const { epics, setEpics } = useFiltersContext();
  const { issues } = useIssues();
  const [search, setSearch] = useState("");

  function searchFilter(issue: IssueType) {
    return (
      isEpic(issue) && issue.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  function onSelectChange(
    e: React.ChangeEvent<HTMLInputElement>,
    issue: IssueType
  ) {
    if (e.target.checked) {
      setEpics((prev) => [...prev, issue.id]);
    } else {
      setEpics((prev) => prev.filter((id) => id !== issue.id));
    }
  }
  return (
    <Dropdown>
      <DropdownTrigger className="rounded-[3px] [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
        <Button
          customColors
          className="flex items-center gap-x-2 transition-all duration-200 hover:bg-gray-200"
        >
          <span className="text-sm">Epic</span>
          <CountBall
            count={epics.length}
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
          className="z-10 mt-2 w-64 rounded-[3px] border-[0.3px] bg-white pb-2 shadow-md"
        >
          <div className="w-full p-2">
            <SearchBar
              placeholder="Search epics..."
              fullWidth={true}
              search={search}
              setSearch={setSearch}
            />
          </div>
          {issues?.filter(searchFilter).map((issue) => (
            <DropdownItem
              onSelect={(e) => e.preventDefault()}
              key={issue.id}
              className="px-3 py-1.5 text-sm hover:bg-gray-100"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSelectChange(e, issue)
              }
            >
              <div className="flex items-center gap-x-2 hover:cursor-default">
                <label htmlFor="epic-filter" className="sr-only">
                  Epic filter checkbox
                </label>
                <input
                  type="checkbox"
                  id="epic-filter"
                  className="form-checkbox h-3 w-3 rounded-sm text-inprogress"
                  checked={epics.includes(issue.id)}
                />
                <TooltipWrapper text={issue.name}>
                  <span className="text-sm text-gray-700">{issue.name}</span>
                </TooltipWrapper>
              </div>
            </DropdownItem>
          ))}
          {issues?.filter(searchFilter).length === 0 && (
            <div className="py-4 text-center text-sm text-gray-500">
              No epics found
            </div>
          )}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};

export { EpicFilter };
