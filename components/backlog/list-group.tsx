"use client";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import clsx from "clsx";
import { BacklogList } from "./list-backlog";
import { SprintList } from "./list-sprint";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { type IssueType } from "@/utils/types";
import { useCallback } from "react";
import { useFiltersContext } from "@/context/use-filters-context";
import {
  assigneeNotInFilters,
  epicNotInFilters,
  insertItemIntoArray,
  isEpic,
  isNullish,
  isSubtask,
  issueNotInSearch,
  issueTypeNotInFilters,
  moveItemWithinArray,
  sprintId,
} from "@/utils/helpers";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { type Sprint } from "@prisma/client";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const ListGroup: React.FC<{ className?: string }> = ({ className }) => {
  const { issues, updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { search, assignees, issueTypes, epics } = useFiltersContext();
  const { sprints } = useSprints();

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined, sprintId: string | null) => {
      if (!issues) return [];
      const filteredIssues = issues.filter((issue) => {
        if (
          issue.sprintId === sprintId &&
          !isEpic(issue) &&
          !isSubtask(issue)
        ) {
          if (issueNotInSearch({ issue, search })) return false;
          if (assigneeNotInFilters({ issue, assignees })) return false;
          if (epicNotInFilters({ issue, epics })) return false;
          if (issueTypeNotInFilters({ issue, issueTypes })) return false;
          return true;
        }
        return false;
      });

      return filteredIssues;
    },
    [search, assignees, epics, issueTypes]
  );

  const onDragEnd = (result: DropResult) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;
    updateIssue({
      issueId: result.draggableId,
      sprintId: sprintId(destination.droppableId),
      sprintPosition: calculateIssueSprintPosition({
        activeIssues: issues ?? [],
        destination,
        source,
        droppedIssueId: result.draggableId,
      }),
    });
  };

  if (!sprints) return <div />;
  return (
    <div
      className={clsx(
        "min-h-full w-full max-w-full overflow-y-auto",
        className
      )}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {sprints.map((sprint) => (
          <div key={sprint.id} className="my-3">
            <SprintList
              sprint={sprint}
              issues={filterIssues(issues, sprint.id)}
            />
          </div>
        ))}
        <BacklogList id="backlog" issues={filterIssues(issues, null)} />
      </DragDropContext>
    </div>
  );
};

function calculateIssueSprintPosition(props: IssueListPositionProps) {
  const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(props);
  let position: number;

  if (isNullish(prevIssue) && isNullish(nextIssue)) {
    position = 1;
  } else if (isNullish(prevIssue) && nextIssue) {
    position = nextIssue.sprintPosition - 1;
  } else if (isNullish(nextIssue) && prevIssue) {
    position = prevIssue.sprintPosition + 1;
  } else if (prevIssue && nextIssue) {
    position =
      prevIssue.sprintPosition +
      (nextIssue.sprintPosition - prevIssue.sprintPosition) / 2;
  } else {
    throw new Error("Invalid position");
  }
  return position;
}

type IssueListPositionProps = {
  activeIssues: IssueType[];
  destination: DraggableLocation;
  source: DraggableLocation;
  droppedIssueId: string;
};

function getAfterDropPrevNextIssue(props: IssueListPositionProps) {
  const { activeIssues, destination, source, droppedIssueId } = props;
  const beforeDropDestinationIssues = getSortedSprintIssues({
    activeIssues,
    sprintId: destination.droppableId,
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

function getSortedSprintIssues({
  activeIssues,
  sprintId,
}: {
  activeIssues: IssueType[];
  sprintId: Sprint["id"] | null;
}) {
  return activeIssues
    .filter((issue) => issue.sprintId === sprintId)
    .sort((a, b) => a.sprintPosition - b.sprintPosition);
}

ListGroup.displayName = "ListGroup";

export { ListGroup };
