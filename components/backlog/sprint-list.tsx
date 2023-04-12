import { Fragment } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";

export const SprintList: React.FC<{ id: string }> = ({ id }) => {
  const issues = [{ id: "1" }];
  return (
    <Fragment>
      <div>Sprint List</div>
      <Droppable key={id} droppableId={id}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            {...droppableProps}
            ref={innerRef}
            className="border bg-gray-200"
          >
            {issues.map((issue, index) => (
              <Issue key={issue.id} index={index} {...issue} />
            ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </Fragment>
  );
};
