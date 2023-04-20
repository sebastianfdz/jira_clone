import { Fragment, useState } from "react";
import { type IssueType } from "./issue";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaChevronRight } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { IssueList } from "./issue-list";
import { getIssueCountByStatus } from "@/utils/helpers";
import { IssueStatusCount } from "./issue-status-count";

const SprintListHeader: React.FC<{ issues: IssueType[] }> = ({ issues }) => {
  const [statusCount] = useState(() => getIssueCountByStatus(issues));

  return (
    <div className="flex w-full items-center justify-between pl-2 text-sm">
      <AccordionTrigger className="flex w-full items-center font-medium [&[data-state=open]>svg]:rotate-90">
        <Fragment>
          <FaChevronRight
            className="mr-2 text-xs text-black transition-transform"
            aria-hidden
          />
          <div className="flex items-center gap-x-2">
            <div className="text-semibold whitespace-nowrap">SP2023</div>
            <div className="text-semibold whitespace-nowrap">Sprint 5</div>
            <div className="whitespace-nowrap font-normal text-gray-500">
              10 Mar - 17 Mar (20 issues)
            </div>
          </div>
        </Fragment>
      </AccordionTrigger>
      <div className="flex items-center gap-x-2">
        <IssueStatusCount statusCount={statusCount} />
        <Button>
          <span className="whitespace-nowrap">Complete Sprint</span>
        </Button>
        <Button>
          <BsThreeDots className="sm:text-xl" />
        </Button>
      </div>
    </div>
  );
};

const SprintList: React.FC<{ id: string }> = ({ id }) => {
  const issues: IssueType[] = [
    {
      id: `issue-1-${id}`,
      title: "Issue 1",
      description: "This is a description",
      status: "TODO",
      assignee: "assignee_id",
      type: "STORY",
      sprint: "P-SEB313",
      epic: "EPIC-1",
      comments: [],
      logs: [],
    },
    {
      id: `issue-2-${id}`,
      title: "Issue 2",
      description: "This is a description",
      status: "IN_PROGRESS",
      assignee: "assignee_id",
      type: "TASK",
      sprint: "P-SEB313",
      epic: "EPIC",
      comments: [],
      logs: [],
    },
    {
      id: `issue-3-${id}`,
      title: "Issue 3",
      description: "This is a description",
      status: "IN_PROGRESS",
      assignee: "assignee_id",
      type: "TASK",
      sprint: "P-SEB313",
      epic: "EPIC",
      comments: [],
      logs: [],
    },
    {
      id: `issue-4-${id}`,
      title: "Issue 4",
      description: "This is a description",
      status: "DONE",
      assignee: "assignee_id",
      type: "BUG",
      sprint: "P-SEB313",
      epic: "EPIC",
      comments: [],
      logs: [],
    },
  ];

  return (
    <Fragment>
      <Accordion
        className="rounded-lg bg-zinc-100 p-2"
        type="single"
        collapsible
      >
        <AccordionItem value={`sprint-${id}`}>
          <SprintListHeader issues={issues} />
          <IssueList sprintId={id} issues={issues} />
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};

export { SprintList };
