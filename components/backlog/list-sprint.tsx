"use client";
import { Fragment, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { IssueList } from "./issue-list";
import { IssueStatusCount } from "./issue-status-count";
import { type Sprint } from "@prisma/client";
import { type IssueType } from "@/utils/types";
import { SprintDropdownMenu } from "./sprint-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StartSprintModal } from "@/components/modals/start-sprint";
import { CompleteSprintModal } from "../modals/complete-sprint";

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
      className="overflow-hidden rounded-lg bg-gray-100 p-2"
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
  // function getSprintAction(sprint: Sprint) {
  //   if (sprint.status === "ACTIVE") {
  //     return "Complete Sprint";
  //   } else {
  //     return "Start Sprint";
  //   }
  // }

  function getFormattedDateRange(
    startDate: Date | undefined | null,
    endDate: Date | undefined | null
  ) {
    if (!startDate || !endDate) {
      return "";
    }
    return `${new Date(startDate).toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    })} - ${new Date(endDate).toLocaleDateString("en", {
      day: "numeric",
      month: "short",
    })}`;
  }

  return (
    <div className="flex w-full min-w-max items-center justify-between pl-2 text-sm">
      <AccordionTrigger className="flex w-full items-center font-medium [&[data-state=open]>svg]:rotate-90">
        <Fragment>
          <FaChevronRight
            className="mr-2 text-xs text-black transition-transform"
            aria-hidden
          />
          <div className="flex items-center gap-x-2">
            <div className="text-semibold whitespace-nowrap">{sprint.name}</div>
            <div className="flex items-center gap-x-3 whitespace-nowrap font-normal text-gray-500">
              <span>
                {getFormattedDateRange(sprint.startDate, sprint.endDate)}
              </span>
              <span>({issues.length} issues)</span>
            </div>
          </div>
        </Fragment>
      </AccordionTrigger>
      <div className="flex items-center gap-x-2">
        <IssueStatusCount issues={issues} />
        <SprintActionButton sprint={sprint} issues={issues} />
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

const SprintActionButton: React.FC<{ sprint: Sprint; issues: IssueType[] }> = ({
  sprint,
  issues,
}) => {
  if (sprint.status === "ACTIVE") {
    return (
      <CompleteSprintModal issues={issues} sprint={sprint}>
        <Button>
          <span className="whitespace-nowrap">Complete sprint</span>
        </Button>
      </CompleteSprintModal>
    );
  }

  if (sprint.status === "PENDING") {
    return (
      <StartSprintModal issueCount={issues.length} sprint={sprint}>
        <Button>
          <span className="whitespace-nowrap">Start sprint</span>
        </Button>
      </StartSprintModal>
    );
  }

  return null;
};

export { SprintList };
