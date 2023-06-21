"use client";
import React, { Fragment, useLayoutEffect } from "react";
import Split from "react-split";
import { ListGroup } from "./list-group";
import { IssueDetails } from "../issue/issue-details";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import "@/styles/split.css";
import clsx from "clsx";
import { BacklogHeader } from "./header";
import { useProject } from "@/hooks/query-hooks/use-project";

const Backlog: React.FC = () => {
  const { project } = useProject();
  const { issueKey, setIssueKey } = useSelectedIssueContext();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!project) return null;

  return (
    <Fragment>
      <BacklogHeader project={project} />
      <div ref={renderContainerRef} className="min-w-full max-w-max">
        <Split
          sizes={issueKey ? [60, 40] : [100, 0]}
          gutterSize={issueKey ? 2 : 0}
          className="flex max-h-full w-full"
          minSize={issueKey ? 400 : 0}
        >
          <ListGroup className={clsx(issueKey && "pb-5 pr-4")} />
          <IssueDetails setIssueKey={setIssueKey} issueKey={issueKey} />
        </Split>
      </div>
    </Fragment>
  );
};

export { Backlog };
