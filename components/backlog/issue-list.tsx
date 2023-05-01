"use client";
import { Droppable } from "react-beautiful-dnd";
import { AccordionContent } from "../ui/accordion";
import { Fragment, useState } from "react";
import { Issue } from "./issue";
import { Button } from "../ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { EmtpyIssue } from "./issue-empty";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { type Issue as IssueType } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

const IssueList: React.FC<{ sprintId: string | null; issues: IssueType[] }> = ({
  sprintId,
  issues,
}) => {
  const { user } = useUser();
  const { mutate: createIssue, isLoading } = useMutation(api.issues.postIssue);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  function handleCreateIssue({
    name,
    type,
  }: {
    name: string;
    type: IssueType["type"];
  }) {
    const reporter = {
      id: user?.id ?? "1",
      name: user?.fullName ?? "John Doe",
      email: user?.emailAddresses[0]?.emailAddress ?? "jon@doe.com",
      avatar:
        user?.profileImageUrl ??
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    }; // TODO: get from auth
    const listPosition =
      issues.filter((issue) => issue.sprintId === sprintId).length + 1;
    createIssue(
      { name, type, sprintId, reporter, listPosition },
      {
        onSuccess: () => {
          setIsEditing(false);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          queryClient.invalidateQueries(["issues"]);
        },
        onError: (error) => {
          console.error("Eroror => ", error);
        },
      }
    );
  }
  return (
    <AccordionContent className="pt-2">
      <Droppable key={sprintId} droppableId={sprintId ?? "backlog"}>
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
