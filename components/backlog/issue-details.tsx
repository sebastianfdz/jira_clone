"use client";
import React, { useLayoutEffect } from "react";
import { useSelectedIssueContext } from "@/hooks/useSelectedIssue";
import { MdClose } from "react-icons/md";
import { Button } from "../ui/button";

const IssueDetails: React.FC<{
  selectedIssue: string | null;
}> = ({ selectedIssue }) => {
  const renderContainerRef = React.useRef<HTMLDivElement>(null);
  const { setIssue } = useSelectedIssueContext();

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.minHeight = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  return (
    <div
      ref={renderContainerRef}
      data-state={selectedIssue ? "open" : "closed"}
      className="z-10 w-full bg-white px-4 [&[data-state=closed]]:hidden"
    >
      <Button onClick={() => setIssue(null)}>
        <MdClose />
      </Button>
      Issue Details {selectedIssue}
    </div>
  );
};

export { IssueDetails };
