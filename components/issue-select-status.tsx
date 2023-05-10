import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { type Issue as IssueType } from "@prisma/client";
import { NotImplemented } from "@/components/not-implemented";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";

const IssueSelectStatus: React.FC<{
  currentStatus: IssueType["status"];
  issueId: string;
  variant?: "sm" | "lg";
}> = ({ currentStatus, issueId, variant = "sm" }) => {
  const statuses: { value: IssueType["status"]; color: string }[] = [
    { value: "TODO", color: "#52525b" },
    { value: "IN_PROGRESS", color: "#1e40af" },
    { value: "DONE", color: "#15803d" },
  ];
  const [selected, setSelected] = useState<IssueType["status"]>(currentStatus);

  const queryClient = useQueryClient();

  const { mutate: updateIssue } = useMutation(api.issues.patchIssue, {
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryClient.invalidateQueries(["issues"]);
    },
    onMutate: (data) => {
      // Optimistic update
      queryClient.setQueryData(["issues"], (old: IssueType[] | undefined) => {
        return old?.map((issue) => {
          if (issue.key == data.issue_key && data.status) {
            return {
              ...issue,
              status: data.status,
            };
          }
          return issue;
        });
      });
    },
  });

  function handleSelectChange(value: IssueType["status"]) {
    setSelected(value);
    updateIssue({
      issue_key: issueId,
      status: value,
    });
  }

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor:
            statuses.find((status) => status.value == selected)?.color ??
            "#1e40af",
        }}
        className={clsx(
          variant == "sm" && "mx-2 px-1.5 py-0.5 text-xs",
          variant == "lg" && "my-2 px-3 py-2 text-[13px]",
          "flex items-center gap-x-1 rounded-[3px] bg-opacity-30  text-xs font-semibold text-white focus:ring-2"
        )}
      >
        <SelectValue className="w-full whitespace-nowrap bg-transparent text-white">
          {selected}
        </SelectValue>
        <SelectIcon>
          <FaChevronDown className="text-xs" />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal className="z-10">
        <SelectContent>
          <SelectViewport className="top-10 w-60 rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <SelectGroup>
              {statuses.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className={clsx(
                    "border-l-[3px] border-transparent py-1 pl-2 text-sm hover:cursor-default hover:border-blue-600 hover:bg-zinc-50 [&[data-state=checked]]:border-blue-600"
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

export { IssueSelectStatus };
