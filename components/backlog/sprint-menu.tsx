import React, { type ReactNode } from "react";
import clsx from "clsx";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownPortal,
} from "@/components/ui/dropdown-menu";
import { type MenuOptionType } from "@/utils/types";

type SprintDropdownMenuProps = {
  children: ReactNode;

  setUpdateModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SprintDropdownMenu: React.FC<SprintDropdownMenuProps> = ({
  children,

  setUpdateModalIsOpen,
  setDeleteModalIsOpen,
}) => {
  const menuOptions: MenuOptionType[] = [
    { id: "edit", label: "Edit Sprint" },
    { id: "delete", label: "Delete Sprint" },
  ];

  const handleSprintAction = (
    id: MenuOptionType["id"],
    e: React.SyntheticEvent
  ) => {
    e.stopPropagation();
    if (id == "delete") {
      setDeleteModalIsOpen(true);
    } else if (id == "edit") {
      setUpdateModalIsOpen(true);
    }
  };

  return (
    <div>
      <Dropdown modal={false}>
        {children}
        <DropdownPortal>
          <DropdownContent
            side="top"
            sideOffset={5}
            align="end"
            className="z-10 w-fit rounded-md border border-gray-300 bg-white shadow-md"
          >
            <DropdownLabel className="sr-only">ACTIONS</DropdownLabel>
            <DropdownGroup>
              {menuOptions.map((action) => (
                <DropdownItem
                  onClick={(e) => handleSprintAction(action.id, e)}
                  key={action.id}
                  textValue={action.label}
                  className={clsx(
                    "border-transparent px-4 py-2 text-sm hover:cursor-default hover:bg-gray-100"
                  )}
                >
                  <span className={clsx("pr-2 text-sm")}>{action.label}</span>
                </DropdownItem>
              ))}
            </DropdownGroup>
          </DropdownContent>
        </DropdownPortal>
      </Dropdown>
    </div>
  );
};

SprintDropdownMenu.displayName = "SprintDropdownMenu";

export { SprintDropdownMenu };
