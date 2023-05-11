import { useEffect, type ReactNode } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { toast } from "../toast";

const SprintDropdownMenu: React.FC<{
  children: ReactNode;
  sprint: SprintType;
}> = ({ children, sprint }) => {
  const menuOptions: MenuOptionType[] = [
    { id: "edit", label: "Edit Sprint" },
    { id: "delete", label: "Delete Sprint" },
  ];

  const queryClient = useQueryClient();

  const { mutate: updateSprint, error } = useMutation(api.sprints.patchSprint, {
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries(["sprints"]);
      toast.success({
        message: `Deleted sprint ${sprint.name}`,
        description: "Sprint deleted",
      });
    },
  });

  useEffect(() => {
    console.log(error);
    if (error) {
      toast.error({
        message: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  }, [error]);

  const handleSprintAction = (id: MenuOptionType["id"]) => {
    if (id == "delete") {
      updateSprint({ sprintId: sprint.id, isDeleted: true });
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
                onSelect={() => handleSprintAction(action.id)}
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
};

export { SprintDropdownMenu };
