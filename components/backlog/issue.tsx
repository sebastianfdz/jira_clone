import { Fragment, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IssueIcon } from "../issue-icon";
import { Button } from "../ui/button";
import { MdEdit } from "react-icons/md";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { Avatar } from "@/components/avatar";
import { ChildrenTreeIcon } from "../icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaChevronDown } from "react-icons/fa";
import { SelectSeparator, SelectViewport } from "@radix-ui/react-select";
import { NotImplemented } from "@/components/not-implemented";

const StatusSelect = () => {
  const statuses = [
    { value: "TODO", color: "#52525b" },
    { value: "IN PROGRESS", color: "#1e40af" },
    { value: "DONE", color: "#15803d" },
  ];
  const [selected, setSelected] = useState("TODO");
  return (
    <Select onValueChange={setSelected}>
      <SelectTrigger
        style={{
          backgroundColor:
            statuses.find((status) => status.value == selected)?.color ??
            "#1e40af",
        }}
        className="mx-2 flex items-center gap-x-1 rounded-md bg-opacity-30 px-1.5 text-sm font-semibold text-white focus:ring-2"
      >
        <SelectValue className="w-full bg-transparent text-white">
          {selected}
        </SelectValue>
        <SelectIcon>
          <FaChevronDown className="text-xs" />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal className="">
        <SelectContent>
          <SelectViewport className="top-10 w-60 rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <SelectGroup>
              {statuses.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className={clsx(
                    "border-l-[3px] border-transparent py-1 pl-2 text-sm hover:cursor-default hover:border-blue-600 hover:bg-zinc-50"
                  )}
                >
                  <span
                    style={{ color: status.color }}
                    className={clsx(
                      "rounded-md bg-opacity-30 px-2 font-semibold"
                    )}
                  >
                    {status.value}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator className="mt-2 h-[1px] bg-gray-300" />
            <NotImplemented feature="workflow">
              <button className="w-full border py-4 pl-5 text-left text-sm font-medium hover:cursor-default hover:bg-zinc-100">
                View Workflow
              </button>
            </NotImplemented>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

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
              "group flex items-center justify-between border border-gray-300  px-3 py-1.5 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center justify-between gap-x-2">
              <IssueIcon issueType={index % 2 == 0 ? "task" : "story"} />
              {/* <IssueIcon issueType="story" />
              <IssueIcon issueType="bug" /> */}
              <div className="text-gray-600">SP2023-128</div>
              <div>Add environment variables in production</div>
              <Button className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200">
                <MdEdit className="text-sm" />
              </Button>
              <div className="rounded-[3px] bg-indigo-500 bg-opacity-30 px-2 text-xs font-bold text-indigo-700">
                EPIC-LABEL
              </div>
            </div>
            <div className="relative flex items-center justify-between">
              <NotImplemented feature="child issues">
                <button>
                  <ChildrenTreeIcon className="mx-2 text-gray-600" />
                </button>
              </NotImplemented>
              <StatusSelect />
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
