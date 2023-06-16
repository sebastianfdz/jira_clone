"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { IssueDetailsHeader } from "./issue-details-header";
import { IssueDetailsInfo } from "./issue-details-info";

const IssueDetails: React.FC<{
  issueId: string | null;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issueId, setIssueId }) => {
  const { issues } = useIssues();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const [isInViewport, viewportRef] = useIsInViewport({ threshold: 1 });

  const getIssue = useCallback(
    (issueId: string | null) => {
      return issues?.find((issue) => issue.key === issueId);
    },
    [issues]
  );
  const [issueInfo, setIssueInfo] = useState(() => getIssue(issueId));

  useEffect(() => {
    setIssueInfo(() => getIssue(issueId));
    if (renderContainerRef.current) {
      renderContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [issueId, getIssue]);

  if (!issueInfo || !issues) return <div />;

  return (
    <div
      ref={renderContainerRef}
      data-state={issueId ? "open" : "closed"}
      className="relative z-10 flex w-full flex-col overflow-y-auto pl-4 pr-2 [&[data-state=closed]]:hidden"
    >
      <IssueDetailsHeader
        issue={issueInfo}
        setIssueId={setIssueId}
        isInViewport={isInViewport}
      />
      <IssueDetailsInfo issue={issueInfo} ref={viewportRef} />
    </div>
  );
};

export { IssueDetails };
