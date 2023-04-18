"use client";
import React, { Fragment, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { type Project } from "@prisma/client";
import Split from "react-split";
import "./index.css";
import { ListGroup } from "./list-group";
import { IssueDetails } from "./issue-details";

const Backlog: React.FC<{
  project: Project;
}> = ({ project }) => {
  console.log("project => ", project);

  const searchParams = useSearchParams();
  const selectedIssue = searchParams.get("selectedIssue");

  return (
    <Fragment>
      {selectedIssue ? (
        <IssueSplitScreen selectedIssue={selectedIssue}>
          <ListGroup />
        </IssueSplitScreen>
      ) : (
        <ListGroup />
      )}
    </Fragment>
  );
};

const IssueSplitScreen: React.FC<{
  children: ReactNode;
  selectedIssue: string;
}> = ({ children, selectedIssue }) => {
  return (
    <Split
      direction="horizontal"
      sizes={[80, 20]}
      gutterSize={2}
      gutterAlign="center"
      cursor="col-resize"
      className="flex h-full"
    >
      <div className="w-full pr-4">{children}</div>
      <IssueDetails issueId={selectedIssue} />
    </Split>
  );
};

export { Backlog };
