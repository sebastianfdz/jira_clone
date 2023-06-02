"use client";
import React, { Fragment, useLayoutEffect } from "react";
import { type Sprint, type IssueStatus, type Project } from "@prisma/client";
// import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import "@/styles/split.css";
import { BoardHeader } from "./header";
import {
  DragDropContext,
  Draggable,
  type DropResult,
  Droppable,
} from "react-beautiful-dnd";
import clsx from "clsx";
import { useIssues } from "@/hooks/query-hooks/useIssues";
import { useSprints } from "@/hooks/query-hooks/useSprints";
import { type IssueType } from "@/utils/types";
import { useStrictModeDroppable } from "@/hooks/useStrictModeDroppable";
import { isNullish } from "@/utils/helpers";

const STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const Board: React.FC<{
  project: Project;
}> = ({ project }) => {
  // const { issueId, setIssueId } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const { issues } = useIssues();
  const { sprints } = useSprints();

  function filterIssuesBySprintAndStatus({
    issue,
    sprints,
    status,
  }: {
    issue: IssueType;
    sprints: Sprint[];
    status: IssueStatus;
  }) {
    const sprint = sprints.find((sprint) => sprint.id == issue.sprintId);
    if (!sprint) return false;
    return issue.status == status && sprint.status == "ACTIVE";
  }

  const { updateIssue } = useIssues();
  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!issues || !sprints) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;
    console.log({
      issue_key: result.draggableId,
      status: destination.droppableId as IssueStatus,
      boardPosition: destination.index,
    });
    updateIssue({
      issue_key: result.draggableId,
      status: destination.droppableId as IssueStatus,
      boardPosition: destination.index,
    });
  };

  return (
    <div>
      <BoardHeader project={project} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex min-h-full w-full max-w-full gap-x-4 overflow-y-auto">
          {STATUSES.map((status) => (
            <div key={status} className="w-[300px]">
              <h2 className="text-xs text-gray-400">
                {status}{" "}
                {issues.filter((issue) => issue.status == status).length}
              </h2>
              <Column
                status={status}
                issues={issues.filter((issue) =>
                  filterIssuesBySprintAndStatus({ issue, status, sprints })
                )}
              />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const Column: React.FC<{ status: string; issues: IssueType[] }> = ({
  status,
  issues,
}) => {
  const [droppableEnabled] = useStrictModeDroppable();

  if (!droppableEnabled) {
    return null;
  }

  return (
    <Droppable droppableId={status}>
      {({ droppableProps, innerRef, placeholder }) => (
        <div
          {...droppableProps}
          ref={innerRef}
          className={clsx(issues.length == 0 && "min-h-[1px]")}
        >
          <Fragment>
            {issues
              .sort((a, b) => {
                if (
                  !isNullish(a.boardPosition) &&
                  !isNullish(b.boardPosition)
                ) {
                  return a.boardPosition - b.boardPosition;
                } else {
                  return a.sprintPosition - b.sprintPosition;
                }
              })
              .map((issue, index) => (
                <Issue key={issue.key} index={index} issue={issue} />
              ))}
          </Fragment>
          {placeholder}
        </div>
      )}
    </Droppable>
  );
};

const Issue: React.FC<{ issue: IssueType; index: number }> = ({
  issue,
  index,
}) => {
  return (
    <Draggable draggableId={issue.key} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
        <div
          role="button"
          // data-state={issueId == issue.key ? "selected" : "not-selected"}
          // onClick={() => setIssueId(issue.key)}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={clsx(
            isDragging ? "bg-blue-100" : "bg-white",
            "group flex w-full max-w-full items-center justify-between border-[0.3px] border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 [&[data-state=selected]]:bg-blue-100"
          )}
        >
          {issue.name}
        </div>
      )}
    </Draggable>
  );
};

export { Board };
