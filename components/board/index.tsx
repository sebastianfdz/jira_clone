"use client";
import React, { Fragment, useLayoutEffect } from "react";
import { type Sprint, type IssueStatus, type Project } from "@prisma/client";
// import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import "@/styles/split.css";
import { BoardHeader } from "./header";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import clsx from "clsx";
import { useIssues } from "@/hooks/query-hooks/useIssues";
import { useSprints } from "@/hooks/query-hooks/useSprints";
import { type IssueType } from "@/utils/types";

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

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!issues || !sprints) return <div />;

  return (
    <Fragment>
      <BoardHeader project={project} />
      <DragDropContext onDragEnd={() => true}>
        <div className="flex min-h-full w-full max-w-full gap-x-4 overflow-y-auto">
          {STATUSES.map((status) => (
            <div key={status} className="w-[300px]">
              <Droppable droppableId={status}>
                {({ droppableProps, innerRef, placeholder }) => (
                  <div
                    {...droppableProps}
                    ref={innerRef}
                    // className={clsx(issues.length == 0 && "min-h-[1px]")}
                  >
                    <h2 className="text-xs text-gray-400">
                      {status}{" "}
                      {issues.filter((issue) => issue.status == status).length}
                    </h2>
                    <Fragment>
                      {issues
                        .sort((a, b) => a.listPosition - b.listPosition)
                        .filter((issue) =>
                          filterIssuesBySprintAndStatus({
                            issue,
                            sprints,
                            status,
                          })
                        )
                        .map((issue, index) => (
                          <Draggable
                            key={issue.key}
                            draggableId={issue.key}
                            index={index}
                          >
                            {(
                              { innerRef, dragHandleProps, draggableProps },
                              { isDragging }
                            ) => (
                              <div
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
                        ))}
                    </Fragment>
                    {placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </Fragment>
  );
};

export { Board };
