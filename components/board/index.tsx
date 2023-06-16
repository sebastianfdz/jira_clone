"use client";
import React, { Fragment, useLayoutEffect, useRef } from "react";
import { type Sprint, type IssueStatus } from "@prisma/client";
// import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import "@/styles/split.css";
import { BoardHeader } from "./header";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { type IssueType } from "@/utils/types";
import {
  insertItemIntoArray,
  isNullish,
  moveItemWithinArray,
} from "@/utils/helpers";
import { IssueList } from "./issue-list";
import { IssueDetailsModal } from "../modals/board-issue-details";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { useProject } from "@/hooks/query-hooks/use-project";

const STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const Board: React.FC = () => {
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const { issues } = useIssues();
  const { sprints } = useSprints();
  const { project } = useProject();

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

  if (!issues || !sprints || !project) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;

    updateIssue({
      issue_key: result.draggableId,
      status: destination.droppableId as IssueStatus,
      boardPosition: calculateIssueBoardPosition({
        activeIssues: issues.filter((issue) => issue.sprintIsActive),
        destination,
        source,
        droppedIssueId: result.draggableId,
      }),
    });
  };

  return (
    <Fragment>
      <IssueDetailsModal />
      <BoardHeader project={project} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          ref={renderContainerRef}
          className="flex min-h-max w-full max-w-full gap-x-4 overflow-y-auto"
        >
          {STATUSES.map((status) => (
            <IssueList
              key={status}
              status={status}
              issues={issues.filter((issue) =>
                filterIssuesBySprintAndStatus({
                  issue,
                  status,
                  sprints: sprints,
                })
              )}
            />
          ))}
        </div>
      </DragDropContext>
    </Fragment>
  );
};

type IssueListPositionProps = {
  activeIssues: IssueType[];
  destination: DraggableLocation;
  source: DraggableLocation;
  droppedIssueId: string;
};

function calculateIssueBoardPosition(props: IssueListPositionProps) {
  const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(props);
  let position: number;

  if (isNullish(prevIssue) && isNullish(nextIssue)) {
    position = 1;
  } else if (isNullish(prevIssue) && nextIssue) {
    position = nextIssue.boardPosition - 1;
  } else if (isNullish(nextIssue) && prevIssue) {
    position = prevIssue.boardPosition + 1;
  } else if (prevIssue && nextIssue) {
    position =
      prevIssue.boardPosition +
      (nextIssue.boardPosition - prevIssue.boardPosition) / 2;
  } else {
    throw new Error("Invalid position");
  }
  return position;
}

function getAfterDropPrevNextIssue(props: IssueListPositionProps) {
  const { activeIssues, destination, source, droppedIssueId } = props;
  const beforeDropDestinationIssues = getSortedBoardIssues({
    activeIssues,
    status: destination.droppableId as IssueStatus,
  });
  const droppedIssue = activeIssues.find(
    (issue) => issue.key === droppedIssueId
  );

  if (!droppedIssue) {
    throw new Error("dropped issue not found");
  }
  const isSameList = destination.droppableId === source.droppableId;

  const afterDropDestinationIssues = isSameList
    ? moveItemWithinArray(
        beforeDropDestinationIssues,
        droppedIssue,
        destination.index
      )
    : insertItemIntoArray(
        beforeDropDestinationIssues,
        droppedIssue,
        destination.index
      );

  return {
    prevIssue: afterDropDestinationIssues[destination.index - 1],
    nextIssue: afterDropDestinationIssues[destination.index + 1],
  };
}

function getSortedBoardIssues({
  activeIssues,
  status,
}: {
  activeIssues: IssueType[];
  status: IssueStatus;
}) {
  return activeIssues
    .filter((issue) => issue.status === status)
    .sort((a, b) => a.boardPosition - b.boardPosition);
}

export { Board };
