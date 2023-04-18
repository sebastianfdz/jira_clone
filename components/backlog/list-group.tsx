import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { BacklogList } from "./list-backlog";
import { Fragment } from "react";
import { SprintList } from "./list-sprint";
import { useBrowser } from "@/hooks/useBrowser";

const ListGroup = () => {
  const sprints = [{ id: "1" }, { id: "2" }, { id: "3" }];
  const { isBrowser } = useBrowser();
  const onDragEnd = (result: DropResult) => {
    const {
      destination,
      source,
      //  draggableId
    } = result;
    if (!positionHasChanged(source, destination)) return;
    if (source.droppableId === destination?.droppableId) {
      // const column = moveItemWithinArray();
    }
  };
  return (
    <div className="h-full min-w-max">
      <DragDropContext onDragEnd={onDragEnd}>
        {isBrowser ? (
          <Fragment>
            {sprints.map((sprint) => (
              <div key={sprint.id} className="my-3">
                <SprintList {...sprint} />
              </div>
            ))}
            <BacklogList id={"backlog"} />
          </Fragment>
        ) : null}
      </DragDropContext>
    </div>
  );
};

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
