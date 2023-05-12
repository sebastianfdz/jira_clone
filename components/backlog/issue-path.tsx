"use client";
import { Button } from "../ui/button";
import { IssueSelectType } from "../issue-select-type";
import { type Issue as IssueType } from "@prisma/client";
import { IssueSelectEpic } from "../issue-select-epic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { toast } from "../toast";
import { IssueIcon } from "../issue-icon";
import { AiOutlinePlus } from "react-icons/ai";

const IssuePath: React.FC<{
  issue: IssueType;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssueId }) => {
  const queryClient = useQueryClient();

  const { mutate: updateIssue } = useMutation(api.issues.patchIssue, {
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

  function handleSelectType(type: IssueType["type"]) {
    updateIssue(
      {
        issue_key: issue.key,
        type,
      },
      {
        onSuccess: (data) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          queryClient.invalidateQueries(["issues"]);
          toast.success({
            message: `Issue type updated to ${data.type}`,
            description: "Issue type changed",
          });
        },
      }
    );
  }

  return (
    <div className="flex gap-x-3">
      <div className="flex items-center">
        <IssueSelectEpic issue={issue}>
          {issue.parentKey ? <IssueIcon issueType="EPIC" /> : <AddEpic />}
        </IssueSelectEpic>
        <Button
          onClick={() => setIssueId(issue.parentKey)}
          customColors
          className=" bg-transparent text-xs text-gray-500 underline-offset-2 hover:underline"
        >
          <span className="whitespace-nowrap">{issue.parentKey}</span>
        </Button>
      </div>
      <span className="py-1.5 text-gray-500">/</span>
      <div className="relative flex items-center">
        <IssueSelectType
          key={issue.key + issue.type}
          currentType={issue.type}
          onSelect={handleSelectType}
        />
        <Button
          customColors
          className="bg-transparent text-xs text-gray-500 underline-offset-2 hover:underline"
        >
          <span className="whitespace-nowrap">{issue.key.toUpperCase()}</span>
        </Button>
      </div>
    </div>
  );
};

const AddEpic: React.FC = () => {
  return (
    <div className="flex items-center p-1.5 font-normal text-gray-500">
      <AiOutlinePlus className="text-sm" />
      <span>Add Epic</span>
    </div>
  );
};

export { IssuePath };
