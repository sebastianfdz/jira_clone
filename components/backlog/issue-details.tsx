"use client";
import React, { useLayoutEffect } from "react";
import { MdClose, MdOutlineShare, MdRemoveRedEye } from "react-icons/md";
import { Button } from "../ui/button";
import { IssueDropdownMenu } from "../issue-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { NotImplemented } from "../not-implemented";
import { AiOutlineLike } from "react-icons/ai";
import { IssuePath } from "./issue-path";
import { LightningIcon } from "../icons";
import { IssueStatusSelect } from "../issue-select-status";
import { type IssueType } from "./issue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { FaChevronUp } from "react-icons/fa";
import { Avatar } from "../avatar";

const IssueDetails: React.FC<{
  issue: string;
  setIssue: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssue }) => {
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  const issueInfo: IssueType = {
    id: issue,
    title: "My new issue",
    sprint: "Sprint 1",
    assignee: {
      id: "assignee_id",
      name: "Sebastian Garcia",
      email: "seb.gar@gmail.com",
      avatar: "https://avatars.githubusercontent.com/u/42552874?v=4",
    },
    reporter: {
      id: "reporter_id",
      name: "Sebastian Garcia",
      email: "seb.gar@gmail.com",
      avatar: "https://avatars.githubusercontent.com/u/42552874?v=4",
    },
    epic: "P-SEB20",
    type: "STORY",
    status: "IN_PROGRESS",
    description: "",
    comments: [],
    logs: [],
  };

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.minHeight = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  return (
    <div
      ref={renderContainerRef}
      data-state={issue ? "open" : "closed"}
      className="z-10 flex w-full flex-col bg-white  pl-4 [&[data-state=closed]]:hidden"
    >
      <IssueDetailsHeader issue={issueInfo} setIssue={setIssue} />
      <IssueDetailsInfo issue={issueInfo} />
    </div>
  );
};

const IssueDetailsHeader: React.FC<{
  issue: IssueType;
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

const IssueDetailsInfo: React.FC<{ issue: IssueType }> = ({ issue }) => {
  return (
    <div className="">
      <h1>{issue.title}</h1>
      <div>[attach_button][add_child_button][link_issue_button]</div>
      <div className="relative flex items-center gap-x-3">
        <IssueStatusSelect currentStatus={issue.status} variant="lg" />
        <NotImplemented>
          <Button customColors className="hover:bg-zinc-200">
            <div className="flex items-center">
              <LightningIcon className="mt-0.5" />
              <span>Actions</span>
            </div>
          </Button>
        </NotImplemented>
      </div>
      <h2>Description</h2>
      <div>[add_description]</div>
      <IssueDetailsInfoAccordion issue={issue} />
      <div>[meta]</div>
      <div>[activity]</div>
      <div>[add_comment ]</div>
    </div>
  );
};

const IssueDetailsInfoAccordion: React.FC<{ issue: IssueType }> = ({
  issue,
}) => {
  return (
    <Accordion className="my-3 rounded-[3px] border" type="single" collapsible>
      <AccordionItem value={`details-${issue.id ?? 0}`}>
        <AccordionTrigger className="flex w-full items-center justify-between p-2 font-medium hover:bg-zinc-100 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:border-b">
          <span className="text-sm">Details</span>
          <FaChevronUp
            className="mr-2 text-xs text-black transition-transform"
            aria-hidden
          />
        </AccordionTrigger>
        <AccordionContent className="flex flex-col bg-white px-3 [&[data-state=open]]:py-2">
          <div
            data-state={issue.assignee ? "assigned" : "unassigned"}
            className="my-2 flex [&[data-state=assigned]]:items-center"
          >
            <span className="w-1/3 text-sm font-semibold text-zinc-600">
              Assignee
            </span>
            <div className="flex flex-col">
              <div className="flex w-2/3 items-center">
                <Avatar
                  src={issue.assignee?.avatar ?? ""}
                  alt=""
                  size={20}
                  className="mr-2"
                />
                <div className="flex flex-col">
                  <span className="whitespace-nowrap text-sm">
                    {issue.assignee?.name ?? "Unassigned"}
                  </span>
                </div>
              </div>
              <Button
                data-state={issue.assignee ? "assigned" : "unassigned"}
                customColors
                customPadding
                className="mt-1 hidden text-sm text-blue-600 underline-offset-2 hover:underline [&[data-state=unassigned]]:flex"
              >
                Assign to me
              </Button>
            </div>
          </div>
          <div className="my-4 flex items-center">
            <span className="w-1/3 text-sm font-semibold text-zinc-600">
              Sprint
            </span>
            <div className="flex w-2/3 items-center">
              <span className="text-sm">{issue.sprint ?? "None"}</span>
            </div>
          </div>
          <div className="my-2 flex items-center">
            <span className="w-1/3 text-sm font-semibold text-zinc-600">
              Reporter
            </span>
            <div className="flex w-2/3 items-center">
              <Avatar
                src={issue.reporter?.avatar ?? null}
                alt=""
                size={20}
                className="mr-2"
              />
              <span className="whitespace-nowrap text-sm">
                {issue.reporter?.name}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export { IssueDetails };
