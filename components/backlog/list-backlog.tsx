"use client";
import { Fragment, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IssueList } from "./issue-list";
import { IssueStatusCount } from "../issue/issue-status-count";
import { type IssueType } from "@/utils/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const BacklogList: React.FC<{
  id: string;
  issues: IssueType[];
}> = ({ id, issues }) => {
  const [openAccordion, setOpenAccordion] = useState("");

  useEffect(() => {
    setOpenAccordion(`backlog`); // Open accordion on mount in order for DND to work.
  }, [id]);

  return (
    <Accordion
      className="rounded-md pb-20 pl-2"
      type="single"
      value={openAccordion}
      onValueChange={setOpenAccordion}
      collapsible
    >
      <AccordionItem value={`backlog`}>
        <BacklogListHeader issues={issues ?? []} />
        <IssueList sprintId={null} issues={issues ?? []} />
      </AccordionItem>
    </Accordion>
  );
};

const BacklogListHeader: React.FC<{ issues: IssueType[] }> = ({ issues }) => {
  const { createSprint } = useSprints();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleCreateSprint() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    createSprint();
  }

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
        <IssueStatusCount issues={issues} />
        <Button onClick={handleCreateSprint}>
          <span className="whitespace-nowrap">Create Sprint</span>
        </Button>
      </div>
    </div>
  );
};

export { BacklogList };
