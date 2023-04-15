import { Fragment, useState } from "react";
import { type IssueType } from "./issue";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IssueList } from "./issue-list";
import { getIssueCountByStatus } from "@/utils/helpers";
import { IssueStatusCount } from "./issue-status-count";

const BacklogListHeader: React.FC<{ issues: IssueType[] }> = ({ issues }) => {
  const [statusCount] = useState(() => getIssueCountByStatus(issues));

  return (
    <AccordionTrigger className="flex w-full items-center justify-between py-2 pl-2 font-medium [&[data-state=open]>svg]:rotate-90">
      <Fragment>
        <FaChevronRight
          className="mr-2 text-xs text-black transition-transform"
          aria-hidden
        />
        <div className="flex w-full items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="text-semibold">Backlog</div>
            <div className="ml-3 font-normal text-gray-500">
              ({issues.length} issues)
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <IssueStatusCount statusCount={statusCount} />
            <Button>Create Sprint</Button>
          </div>
        </div>
      </Fragment>
    </AccordionTrigger>
  );
};

export const BacklogList: React.FC<{ id: string }> = ({ id }) => {
  const issues: IssueType[] = [
    {
      id: `issue-1-${id}`,
      name: "Issue 1",
      description: "This is a description",
      status: "TODO",
      assignee: "assignee_id",
      type: "STORY",
    },
    {
      id: `issue-2-${id}`,
      name: "Issue 2",
      description: "This is a description",
      status: "IN_PROGRESS",
      assignee: "assignee_id",
      type: "TASK",
    },
    {
      id: `issue-3-${id}`,
      name: "Issue 3",
      description: "This is a description",
      status: "IN_PROGRESS",
      assignee: "assignee_id",
      type: "TASK",
    },
    {
      id: `issue-4-${id}`,
      name: "Issue 4",
      description: "This is a description",
      status: "DONE",
      assignee: "assignee_id",
      type: "BUG",
    },
  ];
  return (
    <Fragment>
      <Accordion className="rounded-md pl-2" type="single" collapsible>
        <AccordionItem value={`sprint-${id}`}>
          <BacklogListHeader issues={issues} />
          <IssueList sprintId={id} issues={issues} />
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};
