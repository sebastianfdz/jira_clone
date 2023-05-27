"use client";
import { Button } from "../ui/button";
import { IssueSelectType } from "./issue-select-type";
import { type IssueType } from "@/utils/types";
import { IssueSelectEpic } from "./issue-select-epic";
import { toast } from "../toast";
import { IssueIcon } from "./issue-icon";
import { AiOutlinePlus } from "react-icons/ai";
import { isEpic } from "@/utils/helpers";
import { type ReactNode } from "react";
import { useIssues } from "@/hooks/query-hooks/useIssues";
import { TooltipWrapper } from "../ui/tooltip";

const IssuePath: React.FC<{
  issue: IssueType;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssueId }) => {
  if (isEpic(issue))
    return (
      <div className="flex items-center">
        <IssueIcon issueType={issue.type} />
        <TooltipWrapper text={`${issue.key}: ${issue.name}`} side="top">
          <Button
            onClick={() => setIssueId(issue.key)}
            customColors
            className=" bg-transparent text-xs text-gray-500 underline-offset-2 hover:underline"
          >
            <span className="whitespace-nowrap">{issue.key}</span>
          </Button>
        </TooltipWrapper>
      </div>
    );

  if (issue.parent && isEpic(issue.parent))
    return (
      <ParentContainer issue={issue} setIssueId={setIssueId}>
        <IssueSelectEpic issue={issue}>
          <IssueIcon issueType={issue.parent.type} />
        </IssueSelectEpic>
      </ParentContainer>
    );

  if (issue.parent)
    return (
      <ParentContainer issue={issue} setIssueId={setIssueId}>
        <IssueIcon issueType={issue.parent.type} />
      </ParentContainer>
    );

  return (
    <ParentContainer issue={issue} setIssueId={setIssueId}>
      <IssueSelectEpic issue={issue}>
        <AddEpic />
      </IssueSelectEpic>
    </ParentContainer>
  );
};

const ParentContainer: React.FC<{
  children: ReactNode;
  issue: IssueType;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ children, issue, setIssueId }) => {
  const { updateIssue } = useIssues();

  function handleSelectType(type: IssueType["type"]) {
    updateIssue(
      {
        issue_key: issue.key,
        type,
      },
      {
        onSuccess: (data) => {
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
        {children}
        <IssueLink issue={issue.parent} setIssueId={setIssueId} />
      </div>
      <span className="py-1.5 text-gray-500">/</span>
      <div className="relative flex items-center">
        <IssueSelectType
          key={issue.key + issue.type}
          currentType={issue.type}
          onSelect={handleSelectType}
        />
        <TooltipWrapper text={`${issue.key}: ${issue.name}`} side="top">
          <IssueLink issue={issue} setIssueId={setIssueId} />
        </TooltipWrapper>
      </div>
    </div>
  );
};

const IssueLink: React.FC<{
  issue: IssueType | IssueType["parent"] | null;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssueId }) => {
  if (!issue) return <div />;
  return (
    <TooltipWrapper text={`${issue.key}: ${issue.name}`} side="top">
      <Button
        onClick={() => setIssueId(issue?.key ?? null)}
        customColors
        className=" bg-transparent text-xs text-gray-500 underline-offset-2 hover:underline"
      >
        <span className="whitespace-nowrap">{issue?.key}</span>
      </Button>
    </TooltipWrapper>
  );
};

const AddEpic: React.FC = () => {
  return (
    <div className="flex items-center font-normal text-gray-500">
      <AiOutlinePlus className="text-sm" />
      <span>Add Epic</span>
    </div>
  );
};

export { IssuePath };
