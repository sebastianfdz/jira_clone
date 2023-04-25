"use client";
import React from "react";
import { type Project } from "@prisma/client";
import Split from "react-split";
import { ListGroup } from "./list-group";
import { IssueDetails } from "./issue-details";
import { useSelectedIssueContext } from "@/hooks/useSelectedIssue";
import "@/styles/split.css";
import clsx from "clsx";

const Backlog: React.FC<{
  project: Project;
}> = ({}) => {
  const { issueId, setIssueId } = useSelectedIssueContext();

  return (
    <Split
      sizes={issueId ? [50, 50] : [100, 0]}
      gutterSize={issueId ? 2 : 0}
      className="flex h-full w-full overflow-y-auto "
      minSize={0}
    >
      <ListGroup
        className={clsx(issueId && "max-h-[80vh] overflow-y-auto  pr-4")}
      />
      {issueId ? (
        <IssueDetails
          className="max-h-[80vh] w-full overflow-y-auto "
          setIssueId={setIssueId}
          issueId={issueId}
        />
      ) : null}
    </Split>
  );
};

export { Backlog };
