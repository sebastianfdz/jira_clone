"use client";
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

const SprintList: React.FC<{ id: string; issues: IssueType[] }> = ({
  id,
  issues,
}) => {
  return (
    <Fragment>
      <Accordion
        className="rounded-lg bg-zinc-100 p-2"
        type="single"
        collapsible
      >
        <AccordionItem value={id}>
          <SprintListHeader sprintId={id} issues={issues} />
          <IssueList sprintId={id} issues={issues} />
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};

const SprintListHeader: React.FC<{ issues: IssueType[]; sprintId: string }> = ({
  issues,
  sprintId,
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
            <div className="text-semibold whitespace-nowrap">{sprintId}</div>
            <div className="text-semibold whitespace-nowrap">Sprint 5</div>
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
