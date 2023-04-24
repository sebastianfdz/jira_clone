import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { BacklogList } from "./list-backlog";
import { Fragment } from "react";
import { SprintList } from "./list-sprint";
import clsx from "clsx";
// import { moveItemWithinArray } from "@/utils/helpers";
import { issues, sprints } from "./mock-data";

const ListGroup: React.FC<{ className?: string }> = ({ className }) => {
  const onDragEnd = (result: DropResult) => {
    console.log("result", result);
    const {
      destination,
      source,
      // draggableId
    } = result;
    if (!positionHasChanged(source, destination)) return;
    if (source.droppableId === destination?.droppableId) {
      // const newOrder = moveItemWithinArray();
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
                issues={issues.filter((issue) => issue.sprint == sprint.id)}
              />
            </div>
          ))}
          <BacklogList
            id={"backlog"}
            issues={issues.filter((issue) => issue.sprint == null)}
          />
        </Fragment>
      </DragDropContext>
    </div>
  );
};

ListGroup.displayName = "ListGroup";

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

// function cloneAndReorder(
//   list: unknown[],
//   startIndex: number,
//   endIndex: number
// ) {
//   const listClone = [...list];
//   const [removed] = listClone.splice(startIndex, 1);
//   listClone.splice(endIndex, 0, removed);
//   return listClone;
// }

// function getSortedListIssues(issues, columnId) {
//   issues
//     .filter((issue) => issue.columnId === columnId)
//     .sort((a, b) => a.listPosition - b.listPosition);
// }

export { ListGroup };
