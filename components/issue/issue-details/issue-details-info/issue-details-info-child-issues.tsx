import { useIssues } from "@/hooks/query-hooks/useIssues";
import { IssueIcon } from "../../issue-icon";
import { IssueTitle } from "../../issue-title";
import { Button } from "@/components/ui/button";
import { IssueContextMenu } from "../../issue-menu";
import { MdEdit } from "react-icons/md";
import { NotImplemented } from "@/components/not-implemented";
import { ChildrenTreeIcon } from "@/components/svgs";
import { IssueSelectStatus } from "../../issue-select-status";
import { IssueAssigneeSelect } from "../../issue-select-assignee";
import clsx from "clsx";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ContextTrigger } from "@/components/ui/context-menu";
import { type IssueType } from "@/utils/types";
import { getIssueCountByStatus } from "@/utils/helpers";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { Issue } from "@prisma/client";

const ChildIssueList: React.FC<{
  issues: IssueType[];
}> = ({ issues }) => {
  return (
    <Fragment>
      <h2>Child Issues</h2>
      <ProgressBar issues={issues} />
      {issues.map((issue) => {
        return <ChildIssue key={issue.key} issue={issue} />;
      })}
    </Fragment>
  );
};

const ChildIssue: React.FC<{ issue: IssueType }> = ({ issue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setIssueId, issueId } = useSelectedIssueContext();
  return (
    <div
      key={issue.key}
      data-state={issueId == issue.key ? "selected" : "not-selected"}
      onClick={() => setIssueId(issue.key)}
      className={clsx(
        "group flex w-full max-w-full items-center justify-between border-[0.3px] border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 [&[data-state=selected]]:bg-blue-100"
      )}
    >
      <div
        data-state={isEditing ? "editing" : "not-editing"}
        className="flex w-fit items-center gap-x-2 [&[data-state=editing]]:w-full [&[data-state=not-editing]]:overflow-x-hidden"
      >
        <IssueIcon issueType={issue.type} />
        <div
          data-state={issue.status}
          className="whitespace-nowrap text-sm text-gray-500 [&[data-state=DONE]]:line-through"
        >
          {issue.key}
        </div>

        <IssueTitle
          key={issue.key + issue.name}
          className="truncate py-1.5 text-sm hover:cursor-pointer hover:underline"
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          issue={issue}
          useTooltip={true}
          ref={inputRef}
        />

        <div
          data-state={isEditing ? "editing" : "not-editing"}
          className="flex items-center gap-x-1 [&[data-state=editing]]:hidden"
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200 "
          >
            <MdEdit className="text-sm" />
          </Button>
        </div>
      </div>
      <IssueContextMenu isEditing={isEditing} className="flex-auto">
        <ContextTrigger className="h-8 w-full" />
      </IssueContextMenu>
      <div className="relative ml-2 flex min-w-fit items-center justify-end gap-x-2">
        <NotImplemented feature="child issues">
          <button>
            <ChildrenTreeIcon className="text-gray-600" />
          </button>
        </NotImplemented>
        <IssueAssigneeSelect issue={issue} avatarSize={20} avatarOnly />
        <IssueSelectStatus
          key={issue.key + issue.status}
          currentStatus={issue.status}
          issueId={issue.key}
        />
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ issues: IssueType[] }> = ({ issues }) => {
  const memoizedCount = useCallback(getIssueCountByStatus, []);
  const [statusCount, setStatusCount] = useState(() =>
    memoizedCount(issues ?? [])
  );

  useEffect(() => {
    setStatusCount(() => memoizedCount(issues ?? []));
  }, [issues, memoizedCount]);
  return (
    <div className="mb-3 flex items-center gap-x-5">
      <div
        style={{ width: "100%" }}
        className="flex h-2.5 gap-x-0.5 overflow-hidden rounded-full bg-white"
      >
        <TooltipWrapper
          text={`Done: ${statusCount.DONE} of ${issues.length} issues`}
        >
          <div
            style={{ width: `${(statusCount.DONE / issues.length) * 100}%` }}
            className="float-left h-full bg-done"
          />
        </TooltipWrapper>
        <TooltipWrapper
          text={`In Progress: ${statusCount.IN_PROGRESS} of ${issues.length} issues`}
        >
          <div
            style={{
              width: `${(statusCount.IN_PROGRESS / issues.length) * 100}%`,
            }}
            className="float-left h-full bg-inprogress"
          />
        </TooltipWrapper>
        <TooltipWrapper
          text={`To Do: ${statusCount.TODO} of ${issues.length} issues`}
        >
          <div
            style={{ width: `${(statusCount.TODO / issues.length) * 100}%` }}
            className="float-left h-full bg-todo"
          />
        </TooltipWrapper>
      </div>
      <div className=" whitespace-nowrap text-sm text-gray-500">
        {(statusCount.DONE / issues.length) * 100}% Done
      </div>
    </div>
  );
};

export { ChildIssueList };
