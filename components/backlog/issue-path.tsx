"use client";
import { Button } from "../ui/button";
import { IssueSelectType } from "../issue-select-type";
import { type Issue as IssueType } from "@prisma/client";
import { IssueSelectEpic } from "../issue-select-epic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";

const IssuePath: React.FC<{
  issue: IssueType;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssueId }) => {
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
          if (issue.key == data.issue_key && data.type) {
            return {
              ...issue,
              type: data.type,
            };
          }
          return issue;
        });
      });
    },
  });

  return (
    <div className="flex gap-x-3">
      <div
        data-state={issue.parentId ? "epic" : "not-epic"}
        className="flex items-center [&[data-state=not-epic]]:hidden"
      >
        <IssueSelectEpic
          currentEpic={{ key: "P-SEBB-1", title: "Epic title 1" }}
        />
        <Button
          onClick={() => setIssueId(issue.parentId)}
          customColors
          className=" bg-transparent text-xs text-zinc-500 underline-offset-2 hover:underline"
        >
          <span className="whitespace-nowrap">{issue.parentId}</span>
        </Button>
      </div>
      <span className="py-1.5 text-zinc-500">/</span>
      <div className="relative flex items-center">
        <IssueSelectType
          currentType="TASK"
          onSelect={(type) =>
            updateIssue({
              issue_key: issue.key,
              type,
            })
          }
        />
        <Button
          customColors
          className="bg-transparent text-xs text-zinc-500 underline-offset-2 hover:underline"
        >
          <span className="whitespace-nowrap">{issue.key.toUpperCase()}</span>
        </Button>
      </div>
    </div>
  );
};

export { IssuePath };
