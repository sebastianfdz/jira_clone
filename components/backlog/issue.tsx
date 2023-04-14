import { Fragment } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IssueIcon } from "../issue-icon";
import { Button } from "../ui/button";
import { MdEdit } from "react-icons/md";

export const Issue: React.FC<{
  id: string;
  index: number;
}> = ({ id, index }) => {
  return (
    <Fragment>
      <Draggable draggableId={id + id} index={index}>
        {({ innerRef, dragHandleProps, draggableProps }) => (
          <div
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            className="group flex items-center justify-between border border-gray-300 bg-white p-3 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between gap-x-2">
              <IssueIcon issueType="task" />
              <IssueIcon issueType="story" />
              <IssueIcon issueType="bug" />
              <div className="text-gray-600">SP2023-128</div>
              <div>Add environment variables in production</div>

              <Button className="invisible w-0 bg-transparent px-0 hover:bg-gray-200 group-hover:visible group-hover:w-fit group-hover:px-1.5">
                <MdEdit className="text-sm" />
              </Button>

              <div className="spa rounded-md bg-indigo-500 bg-opacity-30 px-2 text-sm font-bold tracking-wide text-indigo-700">
                EPIC-LABEL
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>[children_icon]</div>
              <div>[status_dd_button]</div>
              <div>[assignee_avatar]</div>
              <div>[ellipsis_hover]</div>
            </div>
          </div>
        )}
      </Draggable>
    </Fragment>
  );
};
