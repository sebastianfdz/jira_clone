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
import clsx from "clsx";

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
          <div className="flex items-center gap-x-2">
            <Fragment>
              {[2, 32, 5].map((el, index) => (
                <span
                  key={index}
                  className={clsx(
                    index == 0 && "bg-zinc-300 text-black",
                    index == 1 && "bg-blue-700 text-white",
                    index == 2 && "bg-green-700 text-white",
                    "flex h-5 items-center justify-center rounded-full px-1.5 py-0.5 text-sm font-semibold"
                  )}
                >
                  {el}
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
          <Fragment>
            <div {...droppableProps} ref={innerRef}>
              {issues.map((issue, index) => (
                <Issue key={issue.id} index={index} {...issue} />
              ))}
            </div>
            {placeholder}
          </Fragment>
        )}
      </Droppable>
    </AccordionContent>
  );
};

export const SprintList: React.FC<{ id: string }> = ({ id }) => {
  const issues = [1, 2, 3, 4, 5].map((num) => ({ id: `issue-${id}-${num}` }));
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
