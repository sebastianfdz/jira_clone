"use client";
import { useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { Droppable } from "react-beautiful-dnd";
import { AccordionContent } from "../ui/accordion";
import { Issue } from "./issue";
import { Button } from "../ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { EmtpyIssue } from "../issue/issue-empty";
import { type IssueType } from "@/utils/types";
import clsx from "clsx";
import { useUser } from "@clerk/clerk-react";
import { useStrictModeDroppable } from "@/hooks/use-strictmode-droppable";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const IssueList: React.FC<{ sprintId: string | null; issues: IssueType[] }> = ({
  sprintId,
  issues,
}) => {
  const { createIssue, isCreating } = useIssues();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [droppableEnabled] = useStrictModeDroppable();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  if (!droppableEnabled) {
    return null;
  }

  function handleCreateIssue({
    name,
    type,
  }: {
    name: string;
    type: IssueType["type"];
  }) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!name) {
      return;
    }

    createIssue(
      {
        name,
        type,
        parentId: null,
        sprintId,
        reporterId: user?.id ?? null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }
  return (
    <AccordionContent className="pt-2">
      <Droppable droppableId={sprintId ?? "backlog"}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            {...droppableProps}
            ref={innerRef}
            className={clsx(issues.length == 0 && "min-h-[1px]")}
          >
            <div
              className={clsx(issues.length && "border-[0.3px]", "divide-y ")}
            >
              {issues
                .sort((a, b) => a.sprintPosition - b.sprintPosition)
                .map((issue, index) => (
                  <Issue key={issue.id} index={index} issue={issue} />
                ))}
            </div>
            {placeholder}
          </div>
        )}
      </Droppable>

      <Button
        onClick={() => setIsEditing(true)}
        data-state={isEditing ? "closed" : "open"}
        customColors
        className="my-1 flex w-full bg-transparent hover:bg-gray-200 [&[data-state=closed]]:hidden"
      >
        <AiOutlinePlus className="text-sm" />
        <span className="text-sm">Create Issue</span>
      </Button>

      <EmtpyIssue
        data-state={isEditing ? "open" : "closed"}
        className="[&[data-state=closed]]:hidden"
        onCreate={({ name, type }) => handleCreateIssue({ name, type })}
        onCancel={() => setIsEditing(false)}
        isCreating={isCreating}
      />
    </AccordionContent>
  );
};

export { IssueList };
