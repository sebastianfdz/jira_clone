import { Fragment, useEffect, useState } from "react";
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
    <div className="flex w-full items-center justify-between text-sm ">
      <AccordionTrigger className="flex w-full items-center p-2 font-medium [&[data-state=open]>svg]:rotate-90">
        <Fragment>
          <FaChevronRight
            className="mr-2 text-xs text-black transition-transform"
            aria-hidden
          />
          <div className="flex items-center">
            <div className="text-semibold">Backlog</div>
            <div className="ml-3 font-normal text-gray-500">
              ({issues.length} issues)
            </div>
          </div>
        </Fragment>
      </AccordionTrigger>
      <div className="flex items-center gap-x-2 py-2">
        <IssueStatusCount statusCount={statusCount} />
        <Button>
          <span className="whitespace-nowrap">Create Sprint</span>
        </Button>
      </div>
    </div>
  );
};

const BacklogList: React.FC<{ id: string }> = ({ id }) => {
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

  const [openAccordion, setOpenAccordion] = useState("");

  useEffect(() => {
    // Open accordion on mount in order for DND to work.
    setOpenAccordion(`backlog-${id}`);
  }, [id]);

  return (
    <Fragment>
      <Accordion
        className="rounded-md pl-2"
        type="single"
        value={openAccordion}
        onValueChange={setOpenAccordion}
        collapsible
      >
        <AccordionItem value={`backlog-${id}`}>
          <BacklogListHeader issues={issues} />
          <IssueList sprintId={id} issues={issues} />
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};

export { BacklogList };
