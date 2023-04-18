"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useLayoutEffect } from "react";
import { MdClose } from "react-icons/md";

const IssueDetails: React.FC<{
  issueId: string | null;
}> = ({ issueId }) => {
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.minHeight = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  return (
    <div ref={renderContainerRef} className="z-10 bg-white px-4">
      <Link
        href={{
          pathname,
          query: undefined,
        }}
      >
        <MdClose />
      </Link>
      Issue Details {issueId}
    </div>
  );
};

export { IssueDetails };
