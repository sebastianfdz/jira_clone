"use client";
import React, { Fragment, useLayoutEffect, useRef } from "react";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import "@/styles/split.css";
import { RoadmapHeader } from "./header";
import { useProject } from "@/hooks/query-hooks/use-project";
import Split from "react-split";
import { IssueDetails } from "../issue/issue-details";
import { notFound } from "next/navigation";
import { EpicsTable } from "./epics-table";

const Roadmap: React.FC = () => {
  const { issueKey, setIssueKey } = useSelectedIssueContext();
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const { project } = useProject();

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!project) {
    return notFound();
  }

  return (
    <Fragment>
      <RoadmapHeader project={project} />
      <div ref={renderContainerRef} className="min-w-full max-w-max">
        <Split
          sizes={issueKey ? [60, 40] : [100, 0]}
          gutterSize={issueKey ? 2 : 0}
          className="flex max-h-full w-full"
          minSize={issueKey ? 400 : 0}
        >
          <EpicsTable />
          <IssueDetails setIssueKey={setIssueKey} issueKey={issueKey} />
        </Split>
      </div>
    </Fragment>
  );
};

export { Roadmap };
