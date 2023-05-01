"use client";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { BacklogList } from "./list-backlog";
import { SprintList } from "./list-sprint";
import clsx from "clsx";
import { insertItemIntoArray, moveItemWithinArray } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { type Issue as IssueType } from "@prisma/client";

const ListGroup: React.FC<{ className?: string }> = ({ className }) => {
  const { data: issues } = useQuery(["issues"], api.issues.getIssues);
  const { data: sprints } = useQuery(["sprints"], api.sprints.getSprints);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!positionHasChanged(source, destination)) return;
    if (source.droppableId === destination?.droppableId) {
      // setIssues((prev) => {
      //   return moveIssueWithinColumn(
      //     prev,
      //     source.droppableId,
      //     source.index,
      //     destination.index
      //   );
      // });
    } else if (destination) {
      // setIssues((prev) => {
      //   return moveIssueBetweenColumns(
      //     prev,
      //     source.droppableId,
      //     destination.droppableId,
      //     source.index,
      //     destination.index
      //   );
      // });
    }
  };

  if (!issues || !sprints) return <div />;
  return (
    <div className={clsx("min-h-full min-w-max overflow-y-auto", className)}>
      <DragDropContext onDragEnd={onDragEnd}>
        {sprints.map((sprint) => (
          <div key={sprint.id} className="my-3">
            <SprintList
              sprint={sprint}
              issues={issues.filter((issue) => issue.sprintId === sprint.id)}
            />
          </div>
        ))}
        <BacklogList
          id="backlog"
          issues={issues.filter((issue) => issue.sprintId === null)}
        />
      </DragDropContext>
    </div>
  );
};

ListGroup.displayName = "ListGroup";

function sprintId(id: string) {
  return id == "backlog" ? null : id;
}

function moveIssueWithinColumn(
  issues: IssueType[],
  columnId: string,
  startIndex: number,
  endIndex: number
) {
  const unaffectedIssues = issues.filter(
    (issue) => issue.sprintId !== sprintId(columnId)
  );
  const affectedIssues = getSortedListIssues(issues, columnId);
  const reordered = moveItemWithinArray(
    affectedIssues,
    startIndex,
    endIndex
  ) as IssueType[];

  return [
    ...unaffectedIssues,
    ...reordered.map((issue, index) => ({ ...issue, listPosition: index })),
  ];
}

function moveIssueBetweenColumns(
  issues: IssueType[],
  startColumnId: string,
  endColumnId: string,
  startIndex: number,
  endIndex: number
) {
  // TODO
  const unaffectedIssues = issues.filter(
    (issue) =>
      issue.sprintId !== sprintId(startColumnId) &&
      issue.sprintId !== sprintId(endColumnId)
  );

  const startColumn = getSortedListIssues(issues, startColumnId);
  const itemToInsert = {
    ...startColumn[startIndex],
    sprint: sprintId(endColumnId),
  };
  startColumn.splice(startIndex, 1);

  const endColumn = getSortedListIssues(issues, endColumnId);
  const newEndColumn = insertItemIntoArray(
    endColumn,
    itemToInsert,
    endIndex
  ) as IssueType[];

  return [
    ...unaffectedIssues,
    ...startColumn.map((issue, index) => ({
      ...issue,
      listPosition: index,
    })),
    ...newEndColumn.map((issue, index) => ({ ...issue, listPosition: index })),
  ] as IssueType[];
}

function positionHasChanged(
  source: DraggableLocation,
  destination: DraggableLocation | null | undefined
) {
  // Snippet taken from https://github.com/oldboyxx/jira_clone
  if (!destination) return false;
  const isSameList = destination.droppableId === source.droppableId;
  const isSamePosition = destination.index === source.index;
  return !isSameList || !isSamePosition;
}

function getSortedListIssues(issues: IssueType[], listId: string) {
  const clone = [...issues];
  return clone
    .filter((issue) => issue.sprintId === sprintId(listId))
    .sort((a, b) => a.listPosition - b.listPosition);
}

export { ListGroup };
