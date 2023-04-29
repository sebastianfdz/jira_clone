"use client";
import { Droppable } from "react-beautiful-dnd";
import { AccordionContent } from "../ui/accordion";
import { Fragment, useEffect, useRef, useState } from "react";
import { Issue, type IssueType } from "./issue";
import { Button } from "../ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { IssueSelectType } from "../issue-select-type";
import clsx from "clsx";

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
        onFinish={() => setIsCreating(false)}
        className="[&[data-state=closed]]:hidden"
      />
    </AccordionContent>
  );
};

const EmtpyIssue: React.FC<{ className?: string; onFinish: () => void }> = ({
  onFinish,
  className,
  ...props
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<IssueType["type"]>("TASK");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [props]);

  function handleCreateIssue(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onFinish();
      // createissue
    }
  }

  return (
    <div
      {...props}
      className={clsx(
        "relative flex items-center gap-x-2 border-2 border-blue-400 bg-white p-1.5",
        className
      )}
      // onBlur={() => onFinish()}
    >
      <IssueSelectType
        currentType={type}
        dropdownIcon
        onSelect={(type) => setType(type)}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="What needs to be done?"
        className="w-full px-2 text-sm focus:outline-none"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        onKeyDown={handleCreateIssue}
      />
    </div>
  );
};

export { IssueList };
