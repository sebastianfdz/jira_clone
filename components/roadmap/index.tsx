"use client";
import React, { Fragment, useLayoutEffect, useRef } from "react";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import "@/styles/split.css";
import { RoadmapHeader } from "./header";
import { useProject } from "@/hooks/query-hooks/use-project";
import Split from "react-split";
import { IssueDetails } from "../issue/issue-details";
import { notFound } from "next/navigation";
import { EpicsTable } from "./epics-table";

const Roadmap: React.FC = () => {
  const { issueId, setIssueId } = useSelectedIssueContext();
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
          sizes={issueId ? [60, 40] : [100, 0]}
          gutterSize={issueId ? 2 : 0}
          className="flex max-h-full w-full"
          minSize={issueId ? 400 : 0}
        >
          <EpicsTable />
          <IssueDetails setIssueId={setIssueId} issueId={issueId} />
        </Split>
      </div>
    </Fragment>
  );
};

export { Roadmap };
