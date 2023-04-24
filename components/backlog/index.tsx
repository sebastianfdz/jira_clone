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
      sizes={issueId ? [60, 40] : [100, 0]}
      gutterSize={issueId ? 2 : 0}
      className="flex h-full"
      minSize={issueId ? 100 : 0}
    >
      <ListGroup className={clsx(issueId && "pr-4")} />
      {issueId ? (
        <IssueDetails setIssueId={setIssueId} issueId={issueId} />
      ) : null}
    </Split>
  );
};

export { Backlog };
