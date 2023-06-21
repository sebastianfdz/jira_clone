import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownPortal,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { useFiltersContext } from "@/context/use-filters-context";
import { Button } from "@/components/ui/button";
import { CountBall } from "./issue/issue-status-count";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { type Sprint } from "@prisma/client";
const SprintFilter: React.FC = () => {
  const { sprints: filterSprints, setSprints } = useFiltersContext();
  const { sprints } = useSprints();

  function filterActiveSprints(sprint: Sprint) {
    return sprint.status === "ACTIVE";
  }
  function onSelectChange(
    e: React.ChangeEvent<HTMLInputElement>,
    sprint: Sprint
  ) {
    if (e.target.checked) {
      setSprints((prev) => [...prev, sprint.id]);
    } else {
      setSprints((prev) => prev.filter((id) => id !== sprint.id));
    }
  }
  return (
    <Dropdown>
      <DropdownTrigger className="rounded-[3px] [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
        <Button
          customColors
          className="flex items-center gap-x-2 transition-all duration-200 hover:bg-gray-200"
        >
          <span className="text-sm">Sprint</span>
          <CountBall
            count={filterSprints.length}
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
          className="z-10 mt-2 w-64 rounded-[3px] border-[0.3px] bg-white py-2 shadow-md"
        >
          {sprints?.filter(filterActiveSprints).map((sprint) => (
            <DropdownItem
              onSelect={(e) => e.preventDefault()}
              key={sprint.id}
              className="px-3 py-1.5 text-sm hover:bg-gray-100"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSelectChange(e, sprint)
              }
            >
              <div className="flex items-center gap-x-2 hover:cursor-default">
                <input
                  type="checkbox"
                  className="form-checkbox h-3 w-3 rounded-sm text-inprogress"
                  checked={filterSprints.includes(sprint.id)}
                />
                <TooltipWrapper text={sprint.name}>
                  <span className="text-sm text-gray-700">{sprint.name}</span>
                </TooltipWrapper>
              </div>
            </DropdownItem>
          ))}
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};

export { SprintFilter };
