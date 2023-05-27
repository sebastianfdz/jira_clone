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
import { type Sprint as SprintType } from "@prisma/client";
import { type MenuOptionType } from "@/utils/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "../toast";
import { useSprints } from "@/hooks/query-hooks/useSprints";

type SprintDropdownMenuProps = {
  children: ReactNode;
  sprint: SprintType;
};

const SprintDropdownMenu = React.forwardRef<
  HTMLButtonElement,
  SprintDropdownMenuProps
>(({ children, sprint }, modalRef) => {
  const menuOptions: MenuOptionType[] = [
    { id: "edit", label: "Edit Sprint" },
    { id: "delete", label: "Delete Sprint" },
  ];

  const queryClient = useQueryClient();
  const { deleteSprint } = useSprints();

  const handleSprintAction = (
    id: MenuOptionType["id"],
    e: React.SyntheticEvent
  ) => {
    e.stopPropagation();
    if (id == "delete") {
      deleteSprint(
        { sprintId: sprint.id },
        {
          onSuccess: () => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            queryClient.invalidateQueries(["issues"]);
            toast.success({
              message: `Deleted sprint ${sprint.name}`,
              description: "Sprint deleted",
            });
          },
        }
      );
    } else if (id == "edit") {
      if (modalRef) {
        (modalRef as React.RefObject<HTMLInputElement>).current?.click();
      }
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
  );
});

SprintDropdownMenu.displayName = "SprintDropdownMenu";

export { SprintDropdownMenu };
