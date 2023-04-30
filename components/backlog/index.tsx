"use client";
import React, { useLayoutEffect } from "react";
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

  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  return (
    <div ref={renderContainerRef} className="overflow-y-auto">
      <Split
        sizes={issueId ? [80, 20] : [100, 0]}
        gutterSize={issueId ? 2 : 0}
        className="flex w-full overflow-y-auto "
        minSize={0}
      >
        <ListGroup
          className={clsx(
            issueId && "max-h-[80vh] w-full overflow-y-auto pb-5 pr-4"
          )}
        />
        {issueId ? (
          <IssueDetails
            className="max-h-[80vh] w-full overflow-y-auto"
            setIssueId={setIssueId}
            issueId={issueId}
          />
        ) : null}
      </Split>
    </div>
  );
};

export { Backlog };
