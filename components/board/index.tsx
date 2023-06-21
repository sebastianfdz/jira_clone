"use client";
import React, { Fragment, useCallback, useLayoutEffect, useRef } from "react";
import { type IssueStatus } from "@prisma/client";
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
  assigneeNotInFilters,
  epicNotInFilters,
  insertItemIntoArray,
  isEpic,
  isNullish,
  isSubtask,
  issueNotInSearch,
  issueSprintNotInFilters,
  issueTypeNotInFilters,
  moveItemWithinArray,
} from "@/utils/helpers";
import { IssueList } from "./issue-list";
import { IssueDetailsModal } from "../modals/board-issue-details";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { useProject } from "@/hooks/query-hooks/use-project";
import { useFiltersContext } from "@/context/use-filters-context";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const Board: React.FC = () => {
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const { issues } = useIssues();
  const { sprints } = useSprints();
  const { project } = useProject();
  const {
    search,
    assignees,
    issueTypes,
    epics,
    sprints: filterSprints,
  } = useFiltersContext();

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined, status: IssueStatus) => {
      if (!issues) return [];
      const filteredIssues = issues.filter((issue) => {
        if (
          issue.status === status &&
          issue.sprintIsActive &&
          !isEpic(issue) &&
          !isSubtask(issue)
        ) {
          if (issueNotInSearch({ issue, search })) return false;
          if (assigneeNotInFilters({ issue, assignees })) return false;
          if (epicNotInFilters({ issue, epics })) return false;
          if (issueTypeNotInFilters({ issue, issueTypes })) return false;
          if (issueSprintNotInFilters({ issue, sprintIds: filterSprints })) {
            return false;
          }
          return true;
        }
        return false;
      });

      return filteredIssues;
    },
    [search, assignees, epics, issueTypes, filterSprints]
  );

  const { updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop + 20;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!issues || !sprints || !project) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;

    updateIssue({
      issueId: result.draggableId,
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
          className="relative flex w-full max-w-full gap-x-4 overflow-y-auto"
        >
          {STATUSES.map((status) => (
            <IssueList
              key={status}
              status={status}
              issues={filterIssues(issues, status)}
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
    (issue) => issue.id === droppedIssueId
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
