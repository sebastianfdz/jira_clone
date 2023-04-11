import { Fragment } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./Issue";

export const SprintList: React.FC<{ id: string }> = ({ id }) => {
  const sprintId = "sprint-" + id;
  const issues = [{ id: "1" }];
  return (
    <Fragment>
      <div>Sprint List</div>
      <Droppable key={sprintId} droppableId={sprintId}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {issues.map((issue, index) => (
              <Issue key={issue.id} index={index} {...issue} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Fragment>
  );
};
