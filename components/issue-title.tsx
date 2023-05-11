import React, { Fragment, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MdCheck, MdClose } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Issue as IssueType } from "@prisma/client";
import { api } from "@/utils/api";
import clsx from "clsx";

type IssueTitleProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  issue: IssueType;
  className?: string;
};

const IssueTitle = React.forwardRef<HTMLInputElement, IssueTitleProps>(
  ({ isEditing, setIsEditing, issue, className }, ref) => {
    const [currentTitle, setCurrentTitle] = useState(issue.name);
    useEffect(() => {
      if (isEditing) {
        (ref as React.RefObject<HTMLInputElement>).current?.focus();
      }
    }, [isEditing, ref]);

    const queryClient = useQueryClient();

    const { mutate: updateIssue } = useMutation(api.issues.patchIssue, {
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        queryClient.invalidateQueries(["issues"]);
      },
      onMutate: (data) => {
        // Optimistic update
        queryClient.setQueryData(["issues"], (old: IssueType[] | undefined) => {
          return old?.map((issue) => {
            if (issue.key == data.issue_key && data.name) {
              return {
                ...issue,
                name: data.name,
              };
            }
            return issue;
          });
        });
      },
    });

    function handleNameChange(e: React.SyntheticEvent) {
      e.stopPropagation();
      setIsEditing(false);
      updateIssue({
        issue_key: issue.key,
        name: currentTitle,
      });
    }

    return (
      <Fragment>
        {isEditing ? (
          <div
            data-state={isEditing ? "editing" : "not-editing"}
            className="relative flex w-fit [&[data-state=editing]]:w-full"
          >
            <input
              type="text"
              ref={ref}
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className={clsx(
                "border-box box-content w-full min-w-max px-1",
                className
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNameChange(e);
                }
              }}
            />
            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="absolute -bottom-10 right-0 z-10 hidden gap-x-1 [&[data-state=editing]]:flex"
            >
              <Button
                className="mt-2 aspect-square bg-zinc-50 p-2.5 shadow-md transition-all hover:bg-zinc-100"
                onClick={handleNameChange}
                customColors
                customPadding
              >
                <MdClose className="text-sm" />
              </Button>
              <Button
                className="mt-2 aspect-square bg-zinc-50 p-2.5 shadow-md transition-all hover:bg-zinc-100"
                onClick={handleNameChange}
                customColors
                customPadding
              >
                <MdCheck className="text-sm" />
              </Button>
            </div>
          </div>
        ) : (
          <div className={clsx("whitespace-nowrap ", className)}>
            {issue.name}
          </div>
        )}
      </Fragment>
    );
  }
);

IssueTitle.displayName = "IssueTitle";

export { IssueTitle };
