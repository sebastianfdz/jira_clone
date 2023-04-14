import { Fragment } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IssueIcon } from "../issue-icon";
import { Button } from "../ui/button";
import { MdEdit } from "react-icons/md";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { Avatar } from "@/components/avatar";
import { ChildrenTreeIcon } from "../icons";

export const Issue: React.FC<{
  id: string;
  index: number;
}> = ({ id, index }) => {
  return (
    <Fragment>
      <Draggable draggableId={id} index={index}>
        {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
          <div
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            className={clsx(
              isDragging ? "bg-blue-100" : "bg-white",
              "group flex items-center justify-between border border-gray-300  p-3 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center justify-between gap-x-2">
              <IssueIcon issueType="task" />
              <IssueIcon issueType="story" />
              <IssueIcon issueType="bug" />
              <div className="text-gray-600">SP2023-128</div>
              <div>Add environment variables in production</div>
              <Button className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200">
                <MdEdit className="text-sm" />
              </Button>
              <div className="spa rounded-[3px] bg-indigo-500 bg-opacity-30 px-2 text-sm font-bold tracking-wide text-indigo-700">
                EPIC-LABEL
              </div>
            </div>
            <div className="flex items-center justify-between">
              <ChildrenTreeIcon className="mx-2 text-gray-600" />
              <div>[status_dd_button]</div>
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
                className="mx-1"
              />
              <Button className="invisible ml-2 group-hover:visible ">
                <BsThreeDots className="sm:text-xl" />
              </Button>
            </div>
          </div>
        )}
      </Draggable>
    </Fragment>
  );
};
