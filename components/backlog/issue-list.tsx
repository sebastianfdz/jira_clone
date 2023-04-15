import { Droppable } from "react-beautiful-dnd";
import { AccordionContent } from "../ui/accordion";
import { Fragment } from "react";
import { Issue, type IssueType } from "./issue";
import { Button } from "../ui/button";
import { AiOutlinePlus } from "react-icons/ai";

const IssueList: React.FC<{ sprintId: string; issues: IssueType[] }> = ({
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
      <Button
        customColors
        className="my-1 flex w-full bg-transparent hover:bg-zinc-200"
      >
        <AiOutlinePlus className="text-sm" />
        <span className="text-sm">Create Issue</span>
      </Button>
    </AccordionContent>
  );
};

export { IssueList };
