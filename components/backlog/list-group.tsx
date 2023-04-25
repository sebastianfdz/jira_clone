import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { BacklogList } from "./list-backlog";
import { Fragment, useState } from "react";
import { SprintList } from "./list-sprint";
import clsx from "clsx";
import { issues as _issues, sprints } from "./mock-data";
import { type IssueType } from "./issue";
import { insertItemIntoArray, moveItemWithinArray } from "@/utils/helpers";

const ListGroup: React.FC<{ className?: string }> = ({ className }) => {
  const [issues, setIssues] = useState(() => _issues);
  const onDragEnd = (result: DropResult) => {
    console.log("result", result);
    const { destination, source } = result;
    if (!positionHasChanged(source, destination)) return;
    if (source.droppableId === destination?.droppableId) {
      setIssues((prev) => {
        return moveIssueWithinColumn(
          prev,
          source.droppableId,
          source.index,
          destination.index
        );
      });
    } else if (destination) {
      setIssues((prev) => {
        return moveIssueBetweenColumns(
          prev,
          source.droppableId,
          destination.droppableId,
          source.index,
          destination.index
        );
      });
    }
  };
  return (
    <div className={clsx("h-full min-w-max", className)}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Fragment>
          {sprints.map((sprint) => (
            <div key={sprint.id} className="my-3">
              <SprintList
                {...sprint}
                issues={issues.filter((issue) => issue.sprint === sprint.id)}
              />
            </div>
          ))}
          <BacklogList
            id={"backlog"}
            issues={issues.filter((issue) => issue.sprint === null)}
          />
        </Fragment>
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
    (issue) => issue.sprint !== sprintId(columnId)
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
      issue.sprint !== sprintId(startColumnId) &&
      issue.sprint !== sprintId(endColumnId)
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
    .filter((issue) => issue.sprint === sprintId(listId))
    .sort((a, b) => a.listPosition - b.listPosition);
}

export { ListGroup };
