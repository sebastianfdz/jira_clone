import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  AccordionItem,
  Accordion,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { FaChevronRight } from "react-icons/fa";
import { IssueIcon } from "../issue/issue-icon";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import clsx from "clsx";
import { IssueSelectStatus } from "../issue/issue-select-status";
import { IssueAssigneeSelect } from "../issue/issue-select-assignee";
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "../ui/button";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import { EmtpyIssue } from "../issue/issue-empty";
import { type IssueType } from "@/utils/types";
import { useUser } from "@clerk/clerk-react";
import { LIGHT_COLORS } from "../color-picker";
import {
  assigneeNotInFilters,
  epicNotInFilters,
  isSubtask,
  issueNotInSearch,
  issueSprintNotInFilters,
  issueTypeNotInFilters,
} from "@/utils/helpers";
import { useFiltersContext } from "@/context/useFiltersContext";
import { ProgressBar } from "@/components/progress-bar";

type CreateIssueProps = {
  name: string;
  type: IssueType["type"];
  parentKey?: string | null;
  sprintColor?: string | null;
};

const EpicsTable: React.FC = () => {
  const { createIssue, isCreating } = useIssues();
  const [isCreatingEpic, setIsCreatingEpic] = useState(false);
  const renderContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop + 15;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  function handleCreateIssue({
    name,
    type,
    parentKey = null,
    sprintColor = null,
  }: CreateIssueProps) {
    createIssue(
      {
        name,
        type,
        parentKey,
        sprintId: null,
        reporterId: user?.id ?? null,
        sprintColor,
      },
      {
        onSuccess: () => {
          setIsCreatingEpic(false);
        },
      }
    );
  }

  return (
    <div
      className="w-full overflow-y-auto rounded-[3px] border"
      ref={renderContainerRef}
    >
      <div className="sticky top-0 z-10 h-10 bg-gray-100" />
      <EpicsAccordion handleCreateIssue={handleCreateIssue} />
      <div className="sticky bottom-0 h-10 border-t bg-white">
        <Button
          onClick={() => setIsCreatingEpic(true)}
          data-state={isCreatingEpic ? "closed" : "open"}
          customColors
          className="flex w-full items-center gap-x-1.5 hover:bg-gray-100 [&[data-state=closed]]:hidden"
        >
          <AiOutlinePlus />
          <span className="text-[14px] font-medium">Create Epic</span>
        </Button>
        <EmtpyIssue
          data-state={isCreatingEpic ? "open" : "closed"}
          className="[&[data-state=closed]]:hidden"
          onCreate={({ name }) =>
            handleCreateIssue({
              name,
              type: "EPIC",
              sprintColor: LIGHT_COLORS[0]?.hex ?? null,
            })
          }
          onCancel={() => setIsCreatingEpic(false)}
          isCreating={isCreating}
          isEpic
        />
      </div>
    </div>
  );
};

const EpicsAccordion: React.FC<{
  handleCreateIssue: (props: CreateIssueProps) => void;
}> = ({ handleCreateIssue }) => {
  const [creationParent, setCreationParent] = useState<number | null>(null);
  const { setIssueId } = useSelectedIssueContext();
  const { issues, isCreating } = useIssues();
  const { search, assignees, issueTypes, epics, sprints } = useFiltersContext();

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined) => {
      if (!issues) return [];
      const filteredIssues = issues.filter((issue) => {
        if (!isSubtask(issue)) {
          if (issueNotInSearch({ issue, search })) return false;
          if (assigneeNotInFilters({ issue, assignees })) return false;
          if (epicNotInFilters({ issue, epics })) return false;
          if (issueTypeNotInFilters({ issue, issueTypes })) return false;
          if (
            issueSprintNotInFilters({
              issue,
              sprintIds: sprints,
              excludeBacklog: true,
            })
          ) {
            return false;
          }
          return true;
        }
        return false;
      });

      return filteredIssues;
    },
    [search, assignees, epics, issueTypes, sprints]
  );

  return (
    <Accordion type="multiple" className="overflow-hidden">
      {issues
        ?.filter((issue) => issue.type == "EPIC")
        .map((issue, index) => (
          <AccordionItem key={issue.key} value={issue.key}>
            <div
              className={clsx(
                index % 2 == 0 ? "bg-white" : "bg-gray-100",
                "flex w-full items-center justify-between hover:bg-gray-200"
              )}
            >
              <AccordionTrigger className="flex w-full items-center px-2 py-2.5 font-medium [&[data-state=open]>svg]:rotate-90">
                <FaChevronRight
                  data-state={
                    issue.children.length ? "show-arrow" : "hide-arrow"
                  }
                  className="mr-2 text-xs text-transparent transition-transform [&[data-state=show-arrow]]:text-black"
                  aria-hidden
                />
              </AccordionTrigger>
              <div
                className="flex flex-grow items-center py-1.5"
                role="button"
                onClick={() => setIssueId(issue.key)}
              >
                <IssueIcon issueType="EPIC" />
                <div>
                  <div className="flex items-center">
                    <div className="flex items-center gap-x-2">
                      <span className="ml-3 text-sm font-normal text-gray-500">
                        {issue.key}
                      </span>
                      <span className="text-sm font-normal">{issue.name}</span>
                    </div>
                  </div>
                  <div className="ml-3 w-64">
                    {issue.children.length ? (
                      <ProgressBar variant="sm" issues={issue.children} />
                    ) : null}
                  </div>
                </div>
              </div>
              <Button
                customColors
                className="mr-2  hover:bg-gray-300"
                onClick={() => setCreationParent(index)}
              >
                <AiOutlinePlus />
              </Button>
            </div>
            <AccordionContent>
              {filterIssues(issue.children)?.map((child) => (
                <div
                  key={child.key}
                  role="button"
                  onClick={() => setIssueId(child.key)}
                  className="flex items-center justify-between p-1.5 pl-12 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-x-2">
                    <IssueIcon issueType={child.type} />
                    <div
                      data-state={child.status}
                      className="whitespace-nowrap text-sm text-gray-500 [&[data-state=DONE]]:line-through"
                    >
                      {child.key}
                    </div>
                    <div>{child.name}</div>
                  </div>
                  <div className="flex items-center gap-x-2 pr-2">
                    <IssueSelectStatus
                      key={child.key + child.status}
                      currentStatus={child.status}
                      issueId={child.key}
                    />
                    <IssueAssigneeSelect
                      issue={child}
                      avatarSize={18}
                      avatarOnly
                    />
                  </div>
                </div>
              ))}
              <EmtpyIssue
                data-state={creationParent == index ? "open" : "closed"}
                className="[&[data-state=closed]]:hidden"
                onCreate={({ name, type }) =>
                  handleCreateIssue({ name, type, parentKey: issue.key })
                }
                onCancel={() => setCreationParent(null)}
                isCreating={isCreating}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export { EpicsTable };
