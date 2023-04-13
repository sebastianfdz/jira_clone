import { Fragment } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { RxChevronDown } from "react-icons/rx";

export const SprintList: React.FC<{ id: string }> = ({ id }) => {
  const issues = [{ id: id }];
  return (
    <Fragment>
      <Accordion className="bg-zinc-100" type="single" collapsible>
        <AccordionItem value={`sprint-${id}`}>
          <AccordionTrigger className="flex font-bold">
            <div>Sprint List</div>
            <RxChevronDown
              className="text-md text-black transition-transform"
              aria-hidden
            />
          </AccordionTrigger>
          <AccordionContent>
            <Droppable key={id} droppableId={id}>
              {({ droppableProps, innerRef, placeholder }) => (
                <div
                  {...droppableProps}
                  ref={innerRef}
                  className="border bg-gray-200"
                >
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
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};
