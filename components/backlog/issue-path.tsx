import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { IssueIcon } from "../issue-icon";
import { Button } from "../ui/button";
import { IssueTypeSelect } from "../issue-select-type";

const IssuePath: React.FC<{
  issue: string | null;
  setIssue: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssue }) => {
  const [showEditButton, setShowEditButton] = useState(false);

  const issueInfo = {
    id: issue,
    sprint: "Sprint 1",
    epic: "P-SEB20",
    type: "Story",
    status: "In Progress",
    description: "",
    comments: [],
    logs: [],
  };
  return (
    <div className="flex gap-x-3">
      <div
        data-state={issueInfo.epic ? "epic" : "not-epic"}
        className="flex items-center [&[data-state=not-epic]]:hidden"
      >
        <Button
          onMouseEnter={() => setShowEditButton(true)}
          onMouseLeave={() => setShowEditButton(false)}
          customColors
          className=" bg-transparent hover:bg-zinc-200"
        >
          {showEditButton ? <MdEdit /> : <IssueIcon issueType="EPIC" />}
        </Button>
        <Button
          onMouseEnter={() => setShowEditButton(true)}
          onMouseLeave={() => setShowEditButton(false)}
          onClick={() => setIssue(issueInfo.epic)}
          customColors
          className=" bg-transparent text-xs text-zinc-500 underline-offset-2 hover:underline"
        >
          <span className="whitespace-nowrap">{issueInfo.epic}</span>
        </Button>
      </div>
      <span className="py-1.5 text-zinc-500">/</span>
      <div className="relative flex items-center">
        <IssueTypeSelect currentType="TASK" />
        <Button
          customColors
          className="bg-transparent text-xs text-zinc-500 underline-offset-2 hover:underline"
        >
          <span className="whitespace-nowrap">{issue?.toUpperCase()}</span>
        </Button>
      </div>
    </div>
  );
};

export { IssuePath };
