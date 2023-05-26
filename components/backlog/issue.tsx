"use client";
import React, { useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IssueIcon } from "../issue-icon";
import { Button } from "../ui/button";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { Avatar } from "../avatar";
import { ChildrenTreeIcon } from "../svgs";
import { NotImplemented } from "../not-implemented";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { ContextTrigger } from "../ui/context-menu";
import { IssueContextMenu, IssueDropdownMenu } from "../issue-menu";
import { IssueSelectStatus } from "../issue-select-status";
import { MdEdit } from "react-icons/md";
import { IssueTitle } from "../issue-title";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import { type IssueType } from "@/utils/types";
import { isEpic } from "@/utils/helpers";

const Issue: React.FC<{
  issue: IssueType;
  index: number;
}> = ({ index, issue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setIssueId, issueId } = useSelectedIssueContext();

  return (
    <Draggable draggableId={issue.key} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
        <div
          role="button"
          data-state={issueId == issue.key ? "selected" : "not-selected"}
          onClick={() => setIssueId(issue.key)}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={clsx(
            isDragging ? "bg-blue-100" : "bg-white",
            "group flex w-full max-w-full items-center justify-between border-[0.3px] border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 [&[data-state=selected]]:bg-blue-100"
          )}
        >
          <div
            data-state={isEditing ? "editing" : "not-editing"}
            className="flex w-fit items-center gap-x-2 [&[data-state=editing]]:w-full [&[data-state=not-editing]]:overflow-x-hidden"
          >
            <IssueIcon issueType={issue.type} />
            <div
              data-state={issue.status}
              className="whitespace-nowrap text-gray-500 [&[data-state=DONE]]:line-through"
            >
              {issue.key}
            </div>

            <IssueTitle
              key={issue.key + issue.name}
              className="truncate py-1.5 hover:cursor-pointer hover:underline"
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              issue={issue}
              useTooltip={true}
              ref={inputRef}
            />

            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="flex items-center gap-x-1 [&[data-state=editing]]:hidden"
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(!isEditing);
                }}
                className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200 "
              >
                <MdEdit className="text-sm" />
              </Button>
              {isEpic(issue.parent) ? <EpicName issue={issue.parent} /> : null}
            </div>
          </div>
          <IssueContextMenu isEditing={isEditing} className="flex-auto">
            <ContextTrigger className="h-8 w-full" />
          </IssueContextMenu>
          <div className="relative ml-2 flex min-w-fit items-center justify-end gap-x-2">
            <NotImplemented feature="child issues">
              <button>
                <ChildrenTreeIcon className="text-gray-600" />
              </button>
            </NotImplemented>
            <IssueSelectStatus
              key={issue.key + issue.status}
              currentStatus={issue.status}
              issueId={issue.key}
            />
            <Avatar
              src={issue.assignee?.avatar ?? null}
              alt={
                issue.assignee
                  ? `Assignee: ${issue.assignee?.name}`
                  : "Unassigned"
              }
            />
            <IssueDropdownMenu issue={issue}>
              <DropdownTrigger
                asChild
                className="rounded-m flex items-center gap-x-2 bg-opacity-30 px-1.5 text-xs font-semibold focus:ring-2 "
              >
                <div className="invisible rounded-sm px-1.5 py-1.5 text-gray-700 group-hover:visible group-hover:bg-gray-200 group-hover:hover:bg-gray-300 [&[data-state=open]]:visible [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white">
                  <BsThreeDots className="sm:text-xl" />
                </div>
              </DropdownTrigger>
            </IssueDropdownMenu>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const EpicName: React.FC<{ issue: IssueType["parent"] }> = ({ issue }) => {
  return (
    <div className="whitespace-nowrap rounded-[3px] bg-[#ece4fc] px-2 text-xs font-bold text-indigo-900">
      {issue.name.toUpperCase()}
    </div>
  );
};

export { Issue };
