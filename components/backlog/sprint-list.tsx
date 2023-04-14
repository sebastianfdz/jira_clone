import { Fragment } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { FaChevronRight } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "@/components/ui/button";

const SprintListHeader = () => {
  return (
    <AccordionTrigger className="flex w-full items-center justify-between p-2 font-medium [&[data-state=open]>svg]:rotate-90">
      <Fragment>
        <FaChevronRight
          className="mr-2 text-sm text-black transition-transform"
          aria-hidden
        />
        <div className="flex w-full items-center justify-between ">
          <div className="flex items-center">
            <div className="text-semibold">SP2023</div>
            <div className="text-semibold">Sprint 5</div>
            <div className="ml-3 font-normal text-gray-500">
              10 Mar - 17 Mar (20 issues)
            </div>
          </div>
          <div className="flex items-center gap-x-3">
            <Fragment>
              {[2, 4, 2].map((num, index) => (
                <span
                  key={index}
                  className="flex h-5 items-center justify-center rounded-full bg-blue-500 px-1.5 py-0.5 text-sm font-semibold text-white"
                >
                  {num}
                </span>
              ))}
            </Fragment>
            <Button>Complete Sprint</Button>
            <Button>
              <BsThreeDots className="sm:text-xl" />
            </Button>
          </div>
        </div>
      </Fragment>
    </AccordionTrigger>
  );
};

type Issue = {
  id: string;
};

const SprintListIssues: React.FC<{ sprintId: string; issues: Issue[] }> = ({
  sprintId,
  issues,
}) => {
  return (
    <AccordionContent>
      <Droppable key={sprintId} droppableId={sprintId}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div {...droppableProps} ref={innerRef}>
            {issues.map((issue, index) => (
              <Fragment key={issue.id}>
                <Issue index={index} {...issue} />
                {placeholder}
              </Fragment>
            ))}
          </div>
        )}
      </Droppable>
    </AccordionContent>
  );
};

export const SprintList: React.FC<{ id: string }> = ({ id }) => {
  const issues = [{ id: id }];
  return (
    <Fragment>
      <Accordion
        className="rounded-md bg-zinc-100 px-3 py-2"
        type="single"
        collapsible
      >
        <AccordionItem value={`sprint-${id}`}>
          <SprintListHeader />
          <SprintListIssues sprintId={id} issues={issues} />
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};
