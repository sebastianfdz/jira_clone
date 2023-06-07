import { IssueIcon } from "../../issue-icon";
import { IssueTitle } from "../../issue-title";
import { Button } from "@/components/ui/button";
import { IssueContextMenu } from "../../issue-menu";
import { MdEdit } from "react-icons/md";
import { IssueSelectStatus } from "../../issue-select-status";
import { IssueAssigneeSelect } from "../../issue-select-assignee";
import clsx from "clsx";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ContextTrigger } from "@/components/ui/context-menu";
import { type IssueType } from "@/utils/types";
import { getIssueCountByStatus } from "@/utils/helpers";
import { TooltipWrapper } from "@/components/ui/tooltip";

import { AiOutlinePlus } from "react-icons/ai";
import { EmtpyIssue } from "@/components/backlog/issue-empty";
import { useIssues } from "@/hooks/query-hooks/use-issues";

const ChildIssueList: React.FC<{
  issues: IssueType[];
  parentIsEpic: boolean;
  parentKey: IssueType["key"];
  isAddingChildIssue: boolean;
  setIsAddingChildIssue: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  issues,
  parentIsEpic,
  parentKey,
  isAddingChildIssue,
  setIsAddingChildIssue,
}) => {
  const { createIssue, isCreating } = useIssues();
  const [isEditing, setIsEditing] = useState(isAddingChildIssue);

  function handleCreateIssue({
    name,
    type,
    parentKey,
  }: {
    name: string;
    type: IssueType["type"];
    parentKey: IssueType["key"] | null;
  }) {
    createIssue(
      {
        name,
        type,
        parentKey,
        sprintId: null,
        reporterId: null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setIsAddingChildIssue(false);
        },
      }
    );
  }
  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <h2>Child Issues</h2>
        <Button
          onClick={() => setIsEditing(true)}
          customColors
          customPadding
          className="p-1 hover:bg-gray-100"
        >
          <AiOutlinePlus />
        </Button>
      </div>
      {issues.length ? <ProgressBar issues={issues} /> : null}
      {issues.map((issue) => {
        return <ChildIssue key={issue.key} issue={issue} />;
      })}
      <EmtpyIssue
        data-state={isEditing || isAddingChildIssue ? "open" : "closed"}
        className="[&[data-state=closed]]:hidden"
        onCreate={({ name, type, parentKey }) =>
          handleCreateIssue({ name, type, parentKey })
        }
        onCancel={() => {
          setIsEditing(false);
          setIsAddingChildIssue(false);
        }}
        isCreating={isCreating}
        isSubtask={!parentIsEpic}
        parentKey={parentKey}
      />
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
        {statusCount.DONE ? (
          <TooltipWrapper
            text={`Done: ${statusCount.DONE} of ${issues.length} issues`}
          >
            <div
              style={{ width: `${(statusCount.DONE / issues.length) * 100}%` }}
              className="float-left h-full bg-done"
            />
          </TooltipWrapper>
        ) : null}
        {statusCount.IN_PROGRESS ? (
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
        ) : null}
        {statusCount.TODO ? (
          <TooltipWrapper
            text={`To Do: ${statusCount.TODO} of ${issues.length} issues`}
          >
            <div
              style={{ width: `${(statusCount.TODO / issues.length) * 100}%` }}
              className="float-left h-full bg-todo"
            />
          </TooltipWrapper>
        ) : null}
      </div>
      <div className=" whitespace-nowrap text-sm text-gray-500">
        {((statusCount.DONE / issues.length) * 100).toFixed(0)}% Done
      </div>
    </div>
  );
};

export { ChildIssueList };
