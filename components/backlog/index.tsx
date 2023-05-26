"use client";
import React, { Fragment, useLayoutEffect } from "react";
import { type Project } from "@prisma/client";
import Split from "react-split";
import { ListGroup } from "./list-group";
import { IssueDetails } from "./issue-details";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import "@/styles/split.css";
import clsx from "clsx";
import { BacklogHeader } from "./header";

const Backlog: React.FC<{
  project: Project;
}> = ({ project }) => {
  const { issueId, setIssueId } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  return (
    <Fragment>
      <BacklogHeader project={project} />
      <div ref={renderContainerRef} className="min-w-full max-w-max">
        <Split
          sizes={issueId ? [60, 40] : [100, 0]}
          gutterSize={issueId ? 2 : 0}
          className="flex max-h-full w-full"
          minSize={issueId ? 400 : 0}
        >
          <ListGroup className={clsx(issueId && "pb-5 pr-4")} />
          <IssueDetails setIssueId={setIssueId} issueId={issueId} />
        </Split>
      </div>
    </Fragment>
  );
};

export { Backlog };
