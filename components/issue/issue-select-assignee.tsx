import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import clsx from "clsx";
import { useProject } from "@/hooks/query-hooks/use-project";
import { type IssueType } from "@/utils/types";
import { Fragment, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { Avatar } from "../avatar";
import { toast } from "../toast";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { type DefaultUser } from "@prisma/client";

const IssueAssigneeSelect: React.FC<{
  issue: IssueType;
  avatarSize?: number;
  avatarOnly?: boolean;
}> = ({ issue, avatarSize, avatarOnly = false }) => {
  const { members } = useProject();
  const { updateIssue, isUpdating } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const unassigned = {
    id: "unassigned",
    name: "Unassigned",
    avatar: undefined,
    email: "",
  };
  const [selected, setSelected] = useState<DefaultUser["id"] | null>(
    issue.assignee?.id ?? null
  );
  function handleSelectChange(value: DefaultUser["id"]) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setSelected(value);
    updateIssue(
      {
        issueId: issue.id,
        assigneeId: value === "unassigned" ? null : value,
      },
      {
        onSuccess: (data) => {
          toast.success({
            message: `Issue assignee updated to ${
              data.assignee?.name ?? "Unassigned"
            }`,
            description: "Issue assignee changed",
          });
        },
      }
    );
  }
  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger
        onClick={(e) => e.stopPropagation()}
        disabled={isUpdating}
        className={clsx(
          avatarOnly
            ? "rounded-full transition-all duration-200 hover:brightness-75"
            : "-ml-2 rounded-[3px] py-1 pl-2 pr-8 hover:bg-gray-200",
          "flex w-fit items-center gap-x-1 whitespace-nowrap"
        )}
      >
        <SelectValue asChild>
          <Fragment>
            <Avatar
              size={avatarSize}
              src={issue.assignee?.avatar}
              alt={`${issue.assignee?.name ?? "Unassigned"}`}
            />
            {avatarOnly ? null : (
              <span className="rounded-md bg-opacity-30 px-2 text-sm">
                {issue.assignee?.name ?? "Unassigned"}
              </span>
            )}
          </Fragment>
        </SelectValue>
      </SelectTrigger>
      <SelectPortal className="z-50 w-full">
        <SelectContent position="popper">
          <SelectViewport className="w-full rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <SelectGroup>
              {members &&
                [...members, unassigned].map((member) => (
                  <SelectItem
                    key={member.id}
                    value={member.id}
                    data-state={member.id == selected ? "checked" : "unchecked"}
                    className={clsx(
                      "border-l-[3px] border-transparent py-2 pl-2 pr-8 text-sm hover:cursor-default hover:border-blue-600 hover:bg-gray-100 focus:outline-none [&[data-state=checked]]:border-blue-600"
                    )}
                  >
                    <div className="flex items-center">
                      <Avatar
                        src={member?.avatar}
                        alt={`${member?.name ?? "Unassigned"}`}
                      />
                      <span className="rounded-md bg-opacity-30 px-2 text-sm">
                        {member.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export { IssueAssigneeSelect };
