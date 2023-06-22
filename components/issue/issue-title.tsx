import React, { Fragment, useEffect, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { Button } from "../ui/button";
import { MdCheck, MdClose } from "react-icons/md";
import { type IssueType } from "@/utils/types";
import { TooltipWrapper } from "../ui/tooltip";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

type IssueTitleProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  issue: IssueType;
  className?: string;
  useTooltip?: boolean;
};

const IssueTitle = React.forwardRef<HTMLInputElement, IssueTitleProps>(
  ({ isEditing, setIsEditing, issue, className, useTooltip }, ref) => {
    const [currentTitle, setCurrentTitle] = useState(issue.name);
    useEffect(() => {
      if (isEditing) {
        (ref as React.RefObject<HTMLInputElement>).current?.focus();
      }
    }, [isEditing, ref]);

    const { updateIssue } = useIssues();
    const [isAuthenticated, openAuthModal] = useIsAuthenticated();

    function handleNameChange(e: React.SyntheticEvent) {
      e.stopPropagation();
      e.preventDefault();
      if (!isAuthenticated) {
        openAuthModal();
        return;
      }
      updateIssue({
        issueId: issue.id,
        name: currentTitle,
      });
      setIsEditing(false);
    }

    return (
      <Fragment>
        {isEditing ? (
          <div className="relative flex w-full">
            <label htmlFor="issue-title" className="sr-only">
              Issue title
            </label>
            <input
              type="text"
              ref={ref}
              id="issue-title"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="w-full min-w-max whitespace-pre-wrap px-1 py-1.5 outline-2 outline-blue-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNameChange(e);
                }
                if (e.key === "Escape") {
                  setIsEditing(false);
                }
              }}
            />
            <div className="absolute -bottom-10 right-0 z-10 flex gap-x-1">
              <Button
                className="mt-2 aspect-square bg-gray-50 p-2.5 shadow-md transition-all hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
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
            {useTooltip ? (
              <TooltipWrapper text={issue.name}>
                <p className={className}>{issue.name}</p>
              </TooltipWrapper>
            ) : (
              <p className={className}>{issue.name}</p>
            )}
          </div>
        )}
      </Fragment>
    );
  }
);

IssueTitle.displayName = "IssueTitle";

export { IssueTitle };
