import { IssueIcon } from "../../issue-icon";
import { IssueTitle } from "../../issue-title";
import { Button } from "@/components/ui/button";
import { IssueContextMenu } from "../../issue-menu";
import { MdEdit } from "react-icons/md";
import { IssueSelectStatus } from "../../issue-select-status";
import { IssueAssigneeSelect } from "../../issue-select-assignee";
import clsx from "clsx";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { Fragment, useRef, useState } from "react";
import { ContextTrigger } from "@/components/ui/context-menu";
import { type IssueType } from "@/utils/types";
import { AiOutlinePlus } from "react-icons/ai";
import { EmtpyIssue } from "@/components/issue/issue-empty";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { ProgressBar } from "@/components/progress-bar";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const ChildIssueList: React.FC<{
  issues: IssueType[];
  parentIsEpic: boolean;
  parentId: IssueType["id"];
  isAddingChildIssue: boolean;
  setIsAddingChildIssue: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  issues,
  parentIsEpic,
  parentId,
  isAddingChildIssue,
  setIsAddingChildIssue,
}) => {
  const { createIssue, isCreating } = useIssues();
  const [isEditing, setIsEditing] = useState(isAddingChildIssue);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleCreateIssue({
    name,
    type,
    parentId,
  }: {
    name: string;
    type: IssueType["type"];
    parentId: IssueType["id"] | null;
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
        parentId,
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
      <div className="mt-3" />
      {issues
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((issue) => {
          return <ChildIssue key={issue.key} issue={issue} />;
        })}
      <EmtpyIssue
        data-state={isEditing || isAddingChildIssue ? "open" : "closed"}
        className="[&[data-state=closed]]:hidden"
        onCreate={({ name, type, parentId }) =>
          handleCreateIssue({ name, type, parentId })
        }
        onCancel={() => {
          setIsEditing(false);
          setIsAddingChildIssue(false);
        }}
        isCreating={isCreating}
        isSubtask={!parentIsEpic}
        parentId={parentId}
      />
    </Fragment>
  );
};

const ChildIssue: React.FC<{ issue: IssueType }> = ({ issue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setIssueKey, issueKey } = useSelectedIssueContext();
  return (
    <div
      key={issue.id}
      data-state={issueKey == issue.key ? "selected" : "not-selected"}
      onClick={() => setIssueKey(issue.key)}
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
          key={issue.id + issue.name}
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
          key={issue.id + issue.status}
          currentStatus={issue.status}
          issueId={issue.id}
        />
      </div>
    </div>
  );
};

export { ChildIssueList };
