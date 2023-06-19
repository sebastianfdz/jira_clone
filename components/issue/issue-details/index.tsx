"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { IssueDetailsHeader } from "./issue-details-header";
import { IssueDetailsInfo } from "./issue-details-info";
import { type IssueType } from "@/utils/types";

const IssueDetails: React.FC<{
  issueKey: string | null;
  setIssueKey: React.Dispatch<React.SetStateAction<IssueType["key"] | null>>;
}> = ({ issueKey, setIssueKey }) => {
  const { issues } = useIssues();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const [isInViewport, viewportRef] = useIsInViewport({ threshold: 1 });

  const getIssue = useCallback(
    (issueKey: string | null) => {
      return issues?.find((issue) => issue.key === issueKey);
    },
    [issues]
  );
  const [issueInfo, setIssueInfo] = useState(() => getIssue(issueKey));

  useEffect(() => {
    setIssueInfo(() => getIssue(issueKey));
    if (renderContainerRef.current) {
      renderContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [issueKey, getIssue]);

  if (!issueInfo || !issues) return <div />;

  return (
    <div
      ref={renderContainerRef}
      data-state={issueKey ? "open" : "closed"}
      className="relative z-10 flex w-full flex-col overflow-y-auto pl-4 pr-2 [&[data-state=closed]]:hidden"
    >
      <IssueDetailsHeader
        issue={issueInfo}
        setIssueKey={setIssueKey}
        isInViewport={isInViewport}
      />
      <IssueDetailsInfo issue={issueInfo} ref={viewportRef} />
    </div>
  );
};

export { IssueDetails };
