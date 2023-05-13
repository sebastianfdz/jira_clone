import { type ReactNode } from "react";
import { useIssues } from "@/hooks/useIssues";
import { type IssueType } from "@/utils/types";
import { type MenuOptionType } from "@/utils/types";
import clsx from "clsx";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownPortal,
} from "@/components/ui/dropdown-menu";
import {
  Context,
  ContextContent,
  ContextGroup,
  ContextItem,
  ContextLabel,
  ContextPortal,
} from "@/components/ui/context-menu";

type MenuOptionsType = {
  actions: MenuOptionType[];
  moveTo: MenuOptionType[];
};

const IssueDropdownMenu: React.FC<{
  children: ReactNode;
  issue: IssueType;
}> = ({ children, issue }) => {
  const menuOptions: MenuOptionsType = {
    actions: [
      { id: "add-flag", label: "Add Flag" },
      { id: "change-parent", label: "Change Parent" },
      { id: "copy-issue-link", label: "Copy Issue Link" },
      { id: "split-issue", label: "Split Issue" },
      { id: "delete", label: "Delete" },
    ],
    moveTo: [],
  };

  const { deleteIssue } = useIssues();

  const handleIssueAction = (
    id: MenuOptionType["id"],
    e: React.SyntheticEvent
  ) => {
    e.stopPropagation();
    if (id == "delete") {
      deleteIssue({ issue_key: issue.key });
    }
  };
  return (
    <Dropdown>
      {children}
      <DropdownPortal>
        <DropdownContent
          side="top"
          sideOffset={5}
          align="end"
          className="z-10 w-fit rounded-md border border-gray-300 bg-white pt-2 shadow-md"
        >
          <DropdownLabel className="p-2 text-xs font-normal text-gray-400">
            ACTIONS
          </DropdownLabel>
          <DropdownGroup>
            {menuOptions.actions.map((action) => (
              <DropdownItem
                onClick={(e) => handleIssueAction(action.id, e)}
                key={action.id}
                textValue={action.label}
                className={clsx(
                  "border-transparent p-2 text-sm hover:cursor-default hover:bg-gray-100"
                )}
              >
                <span className={clsx("pr-2 text-sm")}>{action.label}</span>
              </DropdownItem>
            ))}
          </DropdownGroup>
          <DropdownLabel className="p-2 text-xs font-normal text-gray-400">
            MOVE TO
          </DropdownLabel>
          <DropdownGroup>
            {menuOptions.moveTo.map((action) => (
              <DropdownItem
                onClick={(e) => handleIssueAction(action.id, e)}
                key={action.id}
                textValue={action.label}
                className={clsx(
                  "border-transparent p-2 text-sm hover:cursor-default hover:bg-gray-100"
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
  const menuOptions: MenuOptionsType = {
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
            <ContextLabel className="p-2 text-xs font-normal text-gray-400">
              ACTIONS
            </ContextLabel>
            <ContextGroup>
              {menuOptions.actions.map((action) => (
                <ContextItem
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent p-2 text-sm hover:cursor-default hover:bg-gray-100"
                  )}
                >
                  <span className={clsx("pr-2 text-sm")}>{action.label}</span>
                </ContextItem>
              ))}
            </ContextGroup>
            <ContextLabel className="p-2 text-xs font-normal text-gray-400">
              MOVE TO
            </ContextLabel>
            <ContextGroup>
              {menuOptions.moveTo.map((action) => (
                <ContextItem
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent p-2 text-sm hover:cursor-default hover:bg-gray-100"
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

export { IssueDropdownMenu, IssueContextMenu };
