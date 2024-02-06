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
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { TooltipWrapper } from "../ui/tooltip";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

const IssuePath: React.FC<{
  issue: IssueType;
  setIssueKey: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssueKey }) => {
  if (isEpic(issue))
    return (
      <div className="flex items-center">
        <IssueIcon issueType={issue.type} />
        <TooltipWrapper text={`${issue.key}: ${issue.name}`} side="top">
          <Button
            onClick={() => setIssueKey(issue.key)}
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
      <ParentContainer issue={issue} setIssueKey={setIssueKey}>
        <IssueSelectEpic issue={issue} key={issue.id}>
          <IssueIcon issueType={issue.parent.type} />
        </IssueSelectEpic>
      </ParentContainer>
    );

  if (issue.parent)
    return (
      <ParentContainer issue={issue} setIssueKey={setIssueKey}>
        <IssueIcon issueType={issue.parent.type} />
      </ParentContainer>
    );

  return (
    <ParentContainer issue={issue} setIssueKey={setIssueKey}>
      <IssueSelectEpic issue={issue}>
        <AddEpic />
      </IssueSelectEpic>
    </ParentContainer>
  );
};

const ParentContainer: React.FC<{
  children: ReactNode;
  issue: IssueType;
  setIssueKey: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ children, issue, setIssueKey }) => {
  const { updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleSelectType(type: IssueType["type"]) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateIssue(
      {
        issueId: issue.id,
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
        <IssueLink issue={issue.parent} setIssueKey={setIssueKey} />
      </div>
      <span className="py-1.5 text-gray-500">/</span>
      <div className="relative flex items-center">
        <IssueSelectType
          key={issue.id + issue.type}
          currentType={issue.type}
          onSelect={handleSelectType}
        />
        <TooltipWrapper text={`${issue.key}: ${issue.name}`} side="top">
          <IssueLink issue={issue} setIssueKey={setIssueKey} />
        </TooltipWrapper>
      </div>
    </div>
  );
};

const IssueLink: React.FC<{
  issue: IssueType | IssueType["parent"] | null;
  setIssueKey: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssueKey }) => {
  if (!issue) return <div />;
  return (
    <TooltipWrapper text={`${issue.key}: ${issue.name}`} side="top">
      <Button
        onClick={() => setIssueKey(issue?.key ?? null)}
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
