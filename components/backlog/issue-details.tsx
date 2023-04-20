"use client";
import React, { useLayoutEffect } from "react";
import { useSelectedIssueContext } from "@/hooks/useSelectedIssue";
import { MdClose, MdOutlineShare, MdRemoveRedEye } from "react-icons/md";
import { Button } from "../ui/button";
import { IssueDropdownMenu } from "../issue-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { NotImplemented } from "../not-implemented";
import { AiOutlineLike } from "react-icons/ai";
import { IssuePath } from "./issue-path";

const IssueDetails: React.FC<{ issue: string | null }> = ({ issue }) => {
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
      data-state={issue ? "open" : "closed"}
      className="z-10 flex w-full justify-between bg-white  pl-4 [&[data-state=closed]]:hidden"
    >
      <IssueDetailsHeader issue={issue} setIssue={setIssue} />
    </div>
  );
};

const IssueDetailsHeader: React.FC<{
  issue: string | null;
  setIssue: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssue }) => {
  return (
    <div className="flex h-fit w-full items-center justify-between">
      <IssuePath issue={issue} setIssue={setIssue} />
      <div className="relative flex items-center gap-x-0.5">
        <NotImplemented feature="watch">
          <Button customColors className="bg-transparent hover:bg-zinc-200">
            <MdRemoveRedEye className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="like">
          <Button customColors className="bg-transparent hover:bg-zinc-200">
            <AiOutlineLike className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="share">
          <Button customColors className="bg-transparent hover:bg-zinc-200">
            <MdOutlineShare className="text-xl" />
          </Button>
        </NotImplemented>
        <IssueDropdownMenu>
          <DropdownTrigger
            asChild
            className="rounded-m flex items-center gap-x-1 bg-opacity-30 p-2 text-xs font-semibold text-white focus:ring-2 [&[data-state=open]]:bg-slate-700 [&[data-state=open]]:text-white"
          >
            <div className="rounded-[3px] text-zinc-800 hover:bg-zinc-200">
              <BsThreeDots className="sm:text-xl" />
            </div>
          </DropdownTrigger>
        </IssueDropdownMenu>
        <Button
          customColors
          className="bg-transparent hover:bg-zinc-200"
          onClick={() => setIssue(null)}
        >
          <MdClose className="text-2xl" />
        </Button>
      </div>
    </div>
  );
};

export { IssueDetails };
