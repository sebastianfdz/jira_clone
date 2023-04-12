import { Fragment } from "react";
import { Draggable } from "react-beautiful-dnd";

export const Issue: React.FC<{
  id: string;
  index: number;
}> = ({ id, index }) => {
  return (
    <Fragment>
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="border bg-gray-500"
          >
            <h3>Issue</h3>
            {snapshot.isDragging ? "Dragging" : "Not dragging"}
          </div>
        )}
      </Draggable>
    </Fragment>
  );
};
