"use client";
import { Fragment } from "react";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { Container } from "@/components/ui/container";
import { BacklogList } from "./backlog-list";
import { SprintList } from "./sprint-list";
import { useBrowser } from "@/hooks/useBrowser";
// import { moveItemWithinArray } from "@/utils/helpers";
// import { type RouterOutputs } from "@/utils/api";
import { type Project } from "@prisma/client";

export const Backlog: React.FC<{
  project: Project;
}> = ({ project }) => {
  const sprints = [{ id: "1" }, { id: "2" }, { id: "3" }];
  const { isBrowser } = useBrowser();
  console.log("project", project);

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
    <Container>
      <h1>Backlog</h1>
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
    </Container>
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
