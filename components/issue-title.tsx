import React, { Fragment, useEffect, useState } from "react";
import { useIssues } from "@/hooks/useIssues";
import clsx from "clsx";
import { Button } from "./ui/button";
import { MdCheck, MdClose } from "react-icons/md";
import { type IssueType } from "@/utils/types";

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

    const { updateIssue } = useIssues();

    function handleNameChange(e: React.SyntheticEvent) {
      e.stopPropagation();
      updateIssue({
        issue_key: issue.key,
        name: currentTitle,
      });
      setIsEditing(false);
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
                "border-box box-content w-full min-w-max px-1 outline-2 outline-blue-400",
                className
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNameChange(e);
                }
                if (e.key === "Escape") {
                  setIsEditing(false);
                }
              }}
            />
            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="absolute -bottom-10 right-0 z-10 hidden gap-x-1 [&[data-state=editing]]:flex"
            >
              <Button
                className="mt-2 aspect-square bg-gray-50 p-2.5 shadow-md transition-all hover:bg-gray-100"
                onClick={handleNameChange}
                customColors
                customPadding
              >
                <MdClose className="text-sm" />
              </Button>
              <Button
                className="mt-2 aspect-square bg-gray-50 p-2.5 shadow-md transition-all hover:bg-gray-100"
                onClick={handleNameChange}
                customColors
                customPadding
              >
                <MdCheck className="text-sm" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-hidden">
            <p className={clsx("truncate", className)}>{issue.name}</p>
          </div>
        )}
      </Fragment>
    );
  }
);

IssueTitle.displayName = "IssueTitle";

export { IssueTitle };
