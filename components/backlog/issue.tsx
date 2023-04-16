import React, {
  Fragment,
  type ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { Draggable } from "react-beautiful-dnd";
import { IssueIcon } from "../issue-icon";
import { Button } from "../ui/button";
import { MdCheck, MdClose, MdEdit } from "react-icons/md";
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
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownPortal,
  DropdownTrigger,
} from "../ui/dropdown-menu";
import {
  Context,
  ContextContent,
  ContextGroup,
  ContextItem,
  ContextLabel,
  ContextPortal,
  ContextTrigger,
} from "../ui/context-menu";

export type IssueType = {
  id: string;
  name: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  type: "TASK" | "STORY" | "BUG";
  assignee?: string;
};

const StatusSelect: React.FC<{ currentStatus: IssueType["status"] }> = ({
  currentStatus,
}) => {
  const statuses = [
    { value: "TODO", color: "#52525b" },
    { value: "IN PROGRESS", color: "#1e40af" },
    { value: "DONE", color: "#15803d" },
  ];
  const [selected, setSelected] = useState(currentStatus ?? "TODO");
  return (
    <Select
      onValueChange={
        setSelected as React.Dispatch<React.SetStateAction<string>>
      }
    >
      <SelectTrigger
        style={{
          backgroundColor:
            statuses.find((status) => status.value == selected)?.color ??
            "#1e40af",
        }}
        className="mx-2 flex items-center gap-x-1 rounded-md bg-opacity-30 px-1.5 py-0.5 text-xs font-semibold text-white focus:ring-2"
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
                      "rounded-md bg-opacity-30 px-2 text-xs font-semibold"
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

const IssueDropdownMenu: React.FC<{ children: ReactNode }> = ({ children }) => {
  const menuOptions = {
    actions: [
      { id: "add-flag", label: "Add Flag" },
      { id: "change-parent", label: "Change Parent" },
      { id: "copy-issue-link", label: "Copy Issue Link" },
      { id: "split-issue", label: "Split Issue" },
      { id: "delete", label: "Delete" },
    ],
    moveTo: [],
  };
  return (
    <Dropdown>
      {children}
      <DropdownPortal>
        <DropdownContent
          side="top"
          sideOffset={5}
          align="end"
          className="w-fit rounded-md border border-gray-300 bg-white pt-2 shadow-md"
        >
          <DropdownLabel className="p-2 text-xs font-normal text-zinc-400">
            ACTIONS
          </DropdownLabel>
          <DropdownGroup>
            {menuOptions.actions.map((action) => (
              <DropdownItem
                key={action.id}
                textValue={action.label}
                className={clsx(
                  "border-transparent p-2 text-sm hover:cursor-default hover:bg-zinc-100"
                )}
              >
                <span className={clsx("pr-2 text-sm")}>{action.label}</span>
              </DropdownItem>
            ))}
          </DropdownGroup>
          <DropdownLabel className="p-2 text-xs font-normal text-zinc-400">
            MOVE TO
          </DropdownLabel>
          <DropdownGroup>
            {menuOptions.actions.map((action) => (
              <DropdownItem
                key={action.id}
                textValue={action.label}
                className={clsx(
                  "border-transparent p-2 text-sm hover:cursor-default hover:bg-zinc-100"
                )}
              >
                <span className={clsx("rounded-md bg-opacity-30 pr-2 text-sm")}>
                  {action.label}
                </span>
              </DropdownItem>
            ))}
          </DropdownGroup>
        </DropdownContent>
      </DropdownPortal>
    </Dropdown>
  );
};
const IssueContextMenu: React.FC<{
  children: ReactNode;
  isEditing: boolean;
}> = ({ children, isEditing }) => {
  const menuOptions = {
    actions: [
      { id: "add-flag", label: "Add Flag" },
      { id: "change-parent", label: "Change Parent" },
      { id: "copy-issue-link", label: "Copy Issue Link" },
      { id: "split-issue", label: "Split Issue" },
      { id: "delete", label: "Delete" },
    ],
    moveTo: [],
  };
  return (
    <div
      data-state={isEditing ? "editing" : "not-editing"}
      className="flex w-full [&[data-state=editing]]:hidden"
    >
      <Context>
        {children}
        <ContextPortal>
          <ContextContent className="w-fit rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <ContextLabel className="p-2 text-xs font-normal text-zinc-400">
              ACTIONS
            </ContextLabel>
            <ContextGroup>
              {menuOptions.actions.map((action) => (
                <ContextItem
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent p-2 text-sm hover:cursor-default hover:bg-zinc-100"
                  )}
                >
                  <span className={clsx("pr-2 text-sm")}>{action.label}</span>
                </ContextItem>
              ))}
            </ContextGroup>
            <ContextLabel className="p-2 text-xs font-normal text-zinc-400">
              MOVE TO
            </ContextLabel>
            <ContextGroup>
              {menuOptions.actions.map((action) => (
                <ContextItem
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent p-2 text-sm hover:cursor-default hover:bg-zinc-100"
                  )}
                >
                  <span
                    className={clsx("rounded-md bg-opacity-30 pr-2 text-sm")}
                  >
                    {action.label}
                  </span>
                </ContextItem>
              ))}
            </ContextGroup>
          </ContextContent>
        </ContextPortal>
      </Context>
    </div>
  );
};

type IssueTitleProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const IssueTitle = React.forwardRef<HTMLInputElement, IssueTitleProps>(
  ({ isEditing, setIsEditing, title }, ref) => {
    const [currentTitle, setCurrentTitle] = useState(title);
    useEffect(() => {
      if (isEditing) {
        (ref as React.RefObject<HTMLInputElement>).current?.focus();
      }
    }, [isEditing, ref]);
    return (
      <Fragment>
        {isEditing ? (
          <div
            data-state={isEditing ? "editing" : "not-editing"}
            className="relative flex w-fit [&[data-state=editing]]:w-full"
          >
            <input
              type="text"
              ref={ref}
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="h-7 w-full min-w-[500px] px-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                }
              }}
            />
            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="absolute -bottom-10 right-0 z-10 hidden gap-x-1 [&[data-state=editing]]:flex"
            >
              <Button
                className="aspect-square shadow-md"
                onClick={() => setIsEditing(false)}
              >
                <MdClose className="text-sm" />
              </Button>
              <Button
                className="aspect-square shadow-md"
                onClick={() => setIsEditing(false)}
              >
                <MdCheck className="text-sm" />
              </Button>
            </div>
          </div>
        ) : (
          <div className=" whitespace-nowrap">{title}</div>
        )}
      </Fragment>
    );
  }
);

IssueTitle.displayName = "IssueTitle";

export const Issue: React.FC<{
  id: string;
  type: IssueType["type"];
  status: IssueType["status"];
  index: number;
}> = ({ id, index, type, status }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
              "group flex w-full min-w-max items-center justify-between border-[0.3px] border-gray-300  px-3  py-1.5 text-sm hover:bg-gray-50"
            )}
          >
            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="flex w-fit items-center gap-x-2 [&[data-state=editing]]:w-full"
            >
              <IssueIcon issueType={type} />
              <div className="whitespace-nowrap text-gray-600">SP2023-128</div>
              <IssueTitle
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                title="Issue title goes here"
                ref={inputRef}
              />
              <div
                data-state={isEditing ? "editing" : "not-editing"}
                className="flex items-center gap-x-1 [&[data-state=editing]]:hidden"
              >
                <Button
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                  className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200 "
                >
                  <MdEdit className="text-sm" />
                </Button>
                <div className="whitespace-nowrap rounded-[3px] bg-indigo-500 bg-opacity-30 px-2 text-xs font-bold text-indigo-700">
                  EPIC-LABEL
                </div>
              </div>
            </div>
            <IssueContextMenu isEditing={isEditing}>
              <ContextTrigger className="h-8 w-full" />
            </IssueContextMenu>
            <div className="relative flex items-center justify-between">
              <NotImplemented feature="child issues">
                <button>
                  <ChildrenTreeIcon className="mx-2 text-gray-600" />
                </button>
              </NotImplemented>
              <StatusSelect currentStatus={status} />
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
                className="mx-1"
              />
              <IssueDropdownMenu>
                <DropdownTrigger
                  asChild
                  className="rounded-m flex w-16 items-center gap-x-1 bg-opacity-30 px-1.5 py-0.5 text-xs font-semibold text-white focus:ring-2 "
                >
                  <div className="invisible rounded-sm px-2 py-1.5 text-zinc-700 group-hover:visible group-hover:bg-zinc-200 group-hover:hover:bg-zinc-300 [&[data-state=open]]:visible [&[data-state=open]]:bg-slate-700 [&[data-state=open]]:text-white">
                    <BsThreeDots className="sm:text-xl" />
                  </div>
                </DropdownTrigger>
              </IssueDropdownMenu>
            </div>
          </div>
        )}
      </Draggable>
    </Fragment>
  );
};
