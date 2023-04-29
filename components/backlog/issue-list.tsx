"use client";
import { Droppable } from "react-beautiful-dnd";
import { AccordionContent } from "../ui/accordion";
import { Fragment, useState } from "react";
import { Issue, type IssueType } from "./issue";
import { Button } from "../ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { EmtpyIssue } from "./issue-empty";

const IssueList: React.FC<{ sprintId: string; issues: IssueType[] }> = ({
  sprintId,
  issues,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  return (
    <AccordionContent className="pt-2">
      <Droppable key={sprintId} droppableId={sprintId}>
        {({ droppableProps, innerRef, placeholder }) => (
          <Fragment>
            <div {...droppableProps} ref={innerRef}>
              {issues
                .sort((a, b) => a.listPosition - b.listPosition)
                .map((issue, index) => (
                  <Issue key={issue.id} index={index} issue={issue} />
                ))}
            </div>
            {placeholder}
          </Fragment>
        )}
      </Droppable>

      <Button
        onClick={() => setIsCreating(true)}
        data-state={isCreating ? "closed" : "open"}
        customColors
        className="my-1 flex w-full bg-transparent hover:bg-zinc-200 [&[data-state=closed]]:hidden"
      >
        <AiOutlinePlus className="text-sm" />
        <span className="text-sm">Create Issue</span>
      </Button>

      <EmtpyIssue
        data-state={isCreating ? "open" : "closed"}
        className="[&[data-state=closed]]:hidden"
        onCreate={() => setIsCreating(false)}
        onCancel={() => setIsCreating(false)}
      />
    </AccordionContent>
  );
};

export { IssueList };
