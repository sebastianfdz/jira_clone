import { type ReactNode, useState } from "react";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { IssueIcon } from "./issue-icon";
import { type Issue as IssueType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

const IssueSelectEpic: React.FC<{
  issue: IssueType;
  children: ReactNode;
  className?: string;
}> = ({ issue, children, className }) => {
  // const epics: { key: string; title: string }[] = Array.from(
  //   Array(10).keys()
  // ).map((el) => {
  //   return { key: `P-SEBB-${el}`, title: `Epic title ${el}` };
  // });

  const { data: issues } = useQuery(["issues"], api.issues.getIssues);
  const { mutate: updateIssue } = useMutation(api.issues.patchIssue, {
    onMutate: (data) => {
      // Optimistic update
      queryClient.setQueryData(["issues"], (old: IssueType[] | undefined) => {
        return old?.map((issue) => {
          if (issue.key == data.issue_key && data.parentKey !== undefined) {
            return {
              ...issue,
              parentKey: data.parentKey,
            };
          }
          return issue;
        });
      });
    },
  });

  const [selected, setSelected] = useState<string | null>(issue.parentKey);
  const queryClient = useQueryClient();
  function handleSelect(key: string | null) {
    updateIssue(
      {
        issue_key: issue.key,
        parentKey: key,
      },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          queryClient.invalidateQueries(["issues"]);
        },
      }
    );
    setSelected(key);
  }
  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-x-1 rounded-[3px] text-xs font-semibold text-white hover:bg-gray-200 focus:ring-2"
      >
        <SelectValue defaultValue={selected ?? undefined} className={className}>
          {children}
        </SelectValue>
      </SelectTrigger>
      <SelectPortal className="z-10">
        <SelectContent position="popper">
          <SelectViewport className="w-60 rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <span className="pl-3 text-xs text-gray-500">EPICS</span>
            <SelectGroup>
              {issues
                ?.filter((issue) => issue.type == "EPIC")
                .map((issue) => (
                  <SelectItem
                    key={issue.key}
                    value={issue.key}
                    className={clsx(
                      "border-l-[3px] border-transparent py-2 pl-3 text-sm hover:cursor-pointer  hover:bg-gray-50 [&[data-state=checked]]:bg-gray-200"
                    )}
                  >
                    <div className="flex">
                      <IssueIcon issueType="EPIC" />
                      <span
                        className={clsx(
                          "rounded-md bg-opacity-30 pl-4 text-sm"
                        )}
                      >
                        {issue.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectSeparator className="mt-2 h-[1px] bg-gray-300" />
            <button
              onClick={() => handleSelect(null)}
              className="w-full py-3 pl-4 text-left text-sm text-gray-500 hover:bg-gray-100"
            >
              Unlink parent
            </button>
            <button className="w-full py-3 pl-4 text-left text-sm text-gray-500 hover:bg-gray-100">
              View all epics
            </button>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export { IssueSelectEpic };
