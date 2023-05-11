import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { type IssueStatus, type Issue as IssueType } from "@prisma/client";
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
import { capitalizeMany } from "@/utils/helpers";
import { statuses } from "@/app/mockDb/db";

export type StatusObject = {
  value: IssueType["status"];
  smBgColor: string;
  smTextColor: string;
  lgBgColor: string;
  lgTextColor: string;
};
type StatusMap = {
  [key in IssueStatus]: string;
};

const IssueSelectStatus: React.FC<{
  currentStatus: IssueType["status"];
  issueId: string;
  variant?: "sm" | "lg";
}> = ({ currentStatus, issueId, variant = "sm" }) => {
  const [selected, setSelected] = useState<StatusObject>(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      statuses.find((status) => status.value == currentStatus) ?? statuses[0]!
  );

  const statusMap: StatusMap = {
    DONE: "DONE",
    IN_PROGRESS: "IN PROGRESS",
    TODO: "TO DO",
  };

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const newStatus = statuses.find((status) => status.value == value)!;
    setSelected(newStatus);
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
            variant == "sm" ? selected.smBgColor : selected.lgBgColor,
          color: variant == "sm" ? selected.smTextColor : selected.lgTextColor,
        }}
        className={clsx(
          variant == "sm" &&
            "mx-2 bg-opacity-20 px-1.5 py-0.5 text-xs font-bold",
          variant == "lg" && "my-2 px-3 py-1.5 text-[16px] font-semibold",
          "flex items-center gap-x-1 whitespace-nowrap rounded-[3px] focus:ring-2"
        )}
      >
        <SelectValue className="w-full whitespace-nowrap bg-transparent text-white">
          {variant == "sm"
            ? statusMap[selected.value]
            : capitalizeMany(statusMap[selected.value])}
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
                  data-state={
                    status.value == selected.value ? "checked" : "unchecked"
                  }
                  className={clsx(
                    "border-l-[3px] border-transparent py-1 pl-2 text-sm hover:cursor-default hover:border-blue-600 hover:bg-gray-100 [&[data-state=checked]]:border-blue-600"
                  )}
                >
                  <span
                    style={{
                      color: status.smTextColor,
                    }}
                    className={clsx(
                      "rounded-md bg-opacity-30 px-2 text-xs font-semibold"
                    )}
                  >
                    {statusMap[status.value]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator className="mt-2 h-[1px] bg-gray-300" />
            <NotImplemented feature="workflow">
              <button className="w-full border py-4 pl-5 text-left text-sm font-medium hover:cursor-default hover:bg-gray-100">
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
