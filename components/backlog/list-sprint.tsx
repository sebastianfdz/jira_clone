"use client";
import { Fragment, useState } from "react";
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
import { type Issue as IssueType, type Sprint } from "@prisma/client";

const SprintList: React.FC<{
  sprint: Sprint;
  issues: IssueType[];
}> = ({ sprint, issues }) => {
  return (
    <Accordion className="rounded-lg bg-zinc-100 p-2" type="single" collapsible>
      <AccordionItem value={sprint.id}>
        <SprintListHeader sprint={sprint} issues={issues} />
        <IssueList sprintId={sprint.id} issues={issues} />
      </AccordionItem>
    </Accordion>
  );
};

const SprintListHeader: React.FC<{ issues: IssueType[]; sprint: Sprint }> = ({
  issues,
  sprint,
}) => {
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
            <div className="text-semibold whitespace-nowrap">{sprint.name}</div>
            <div className="whitespace-nowrap font-normal text-gray-500">
              10 Mar - 17 Mar ({issues.length} issues)
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

export { SprintList };
