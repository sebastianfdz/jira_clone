"use client";
import { Fragment, useEffect, useState } from "react";
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
import { SprintDropdownMenu } from "./sprint-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";

const SprintList: React.FC<{
  sprint: Sprint;
  issues: IssueType[];
}> = ({ sprint, issues }) => {
  const [openAccordion, setOpenAccordion] = useState("");
  useEffect(() => {
    setOpenAccordion(sprint.id); // Open accordion on mount in order for DND to work.
  }, [sprint.id]);

  return (
    <Accordion
      onValueChange={setOpenAccordion}
      value={openAccordion}
      className="rounded-lg bg-gray-100 p-2"
      type="single"
      collapsible
    >
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

        <SprintDropdownMenu sprint={sprint}>
          <DropdownTrigger
            asChild
            className="rounded-m flex items-center gap-x-1 px-1.5 py-0.5 text-xs font-semibold focus:ring-2"
          >
            <div className="rounded-sm bg-gray-200 px-1.5 py-1.5 text-gray-600 hover:cursor-pointer hover:bg-gray-300 [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
              <BsThreeDots className="sm:text-xl" />
            </div>
          </DropdownTrigger>
        </SprintDropdownMenu>
      </div>
    </div>
  );
};

export { SprintList };
