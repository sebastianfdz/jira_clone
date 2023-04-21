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
  const { issue, setIssue } = useSelectedIssueContext();

  return (
    <Split
      sizes={issue ? [60, 40] : [100, 0]}
      gutterSize={issue ? 2 : 0}
      className="flex h-full"
      minSize={issue ? 100 : 0}
    >
      <ListGroup className={clsx(issue && "pr-4")} />
      {issue ? <IssueDetails setIssue={setIssue} issue={issue} /> : null}
    </Split>
  );
};

export { Backlog };
