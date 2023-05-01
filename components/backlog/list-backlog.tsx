"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IssueList } from "./issue-list";
import { getIssueCountByStatus } from "@/utils/helpers";
import { IssueStatusCount } from "./issue-status-count";
import { api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Issue as IssueType } from "@prisma/client";

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
      className="rounded-md pl-2"
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
  const [statusCount] = useState(() => getIssueCountByStatus(issues ?? []));
  const queryClient = useQueryClient();
  const { mutate: createSprint } = useMutation(api.sprints.postSprint);

  function handleCreateSprint() {
    createSprint(undefined, {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["sprints"]);
      },
    });
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
        <IssueStatusCount statusCount={statusCount} />
        <Button onClick={handleCreateSprint}>
          <span className="whitespace-nowrap">Create Sprint</span>
        </Button>
      </div>
    </div>
  );
};

export { BacklogList };
