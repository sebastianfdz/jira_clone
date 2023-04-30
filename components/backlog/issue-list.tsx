"use client";
import { Droppable } from "react-beautiful-dnd";
import { AccordionContent } from "../ui/accordion";
import { Fragment, useState } from "react";
import { Issue, type IssueType } from "./issue";
import { Button } from "../ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { EmtpyIssue } from "./issue-empty";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { type PostIssueBody } from "@/app/api/issues/route";

const IssueList: React.FC<{ sprintId: string; issues: IssueType[] }> = ({
  sprintId,
  issues,
}) => {
  const { mutate: createIssue, isLoading } = useMutation(
    ["issues"],
    api.issues.postIssue
  );
  const [isEditing, setIsEditing] = useState(false);
  // const [isCreating, setIsCreating] = useState(false);

  function handleCreateIssue({
    name,
    type,
  }: {
    name: string;
    type: PostIssueBody["type"];
  }) {
    const reporter = "guest_user"; // TODO: get from auth
    createIssue(
      { name, type, sprintId, reporter },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }
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
        onClick={() => setIsEditing(true)}
        data-state={isEditing ? "closed" : "open"}
        customColors
        className="my-1 flex w-full bg-transparent hover:bg-zinc-200 [&[data-state=closed]]:hidden"
      >
        <AiOutlinePlus className="text-sm" />
        <span className="text-sm">Create Issue</span>
      </Button>

      <EmtpyIssue
        data-state={isEditing ? "open" : "closed"}
        className="[&[data-state=closed]]:hidden"
        onCreate={({ name, type }) => handleCreateIssue({ name, type })}
        onCancel={() => setIsEditing(false)}
        isCreating={isLoading}
      />
    </AccordionContent>
  );
};

export { IssueList };
