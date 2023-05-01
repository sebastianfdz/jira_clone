"use client";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { MdClose, MdOutlineShare, MdRemoveRedEye } from "react-icons/md";
import { Button } from "../ui/button";
import { IssueDropdownMenu } from "../issue-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { NotImplemented } from "../not-implemented";
import { AiOutlineLike } from "react-icons/ai";
import { IssuePath } from "./issue-path";
import { LightningIcon } from "../icons";
import { IssueSelectStatus } from "../issue-select-status";
import { type Issue as IssueType } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { FaChevronUp } from "react-icons/fa";
import clsx from "clsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const IssueDetails: React.FC<{
  issueId: string | null;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
  className?: string;
}> = ({ issueId, setIssueId, className }) => {
  const { data: issues } = useQuery(["issues"], api.issues.getIssues, {
    onSuccess: (data) => {
      setIssueInfo(data.find((issue) => issue.id === issueId));
    },
  });
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  const [issueInfo, setIssueInfo] = useState(() =>
    issues?.find((issue) => issue.id === issueId)
  );

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.minHeight = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  useEffect(() => {
    setIssueInfo(issues?.find((issue) => issue.id === issueId));
  }, [issueId, issues]);

  if (!issueInfo) return <div />;

  return (
    <div
      ref={renderContainerRef}
      data-state={issueId ? "open" : "closed"}
      className={clsx(
        "z-10 flex w-full min-w-max flex-col overflow-y-auto pl-4 [&[data-state=closed]]:hidden",
        className
      )}
    >
      <IssueDetailsHeader issue={issueInfo} setIssueId={setIssueId} />
      <IssueDetailsInfo key={issueId} issue={issueInfo} />
    </div>
  );
};

const IssueDetailsHeader: React.FC<{
  issue: IssueType | undefined;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssueId }) => {
  if (!issue) return <div />;
  return (
    <div className="flex h-fit w-full items-center justify-between">
      <IssuePath issue={issue} setIssueId={setIssueId} />
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
          onClick={() => setIssueId(null)}
        >
          <MdClose className="text-2xl" />
        </Button>
      </div>
    </div>
  );
};

const IssueDetailsInfo: React.FC<{ issue: IssueType | undefined }> = ({
  issue,
}) => {
  if (!issue) return <div />;
  return (
    <Fragment>
      <h1>{issue.name}</h1>
      <div>[attach_button][add_child_button][link_issue_button]</div>
      <div className="relative flex items-center gap-x-3">
        <IssueSelectStatus currentStatus={issue.status} variant="lg" />
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
    </Fragment>
  );
};

const IssueDetailsInfoAccordion: React.FC<{ issue: IssueType }> = ({
  issue,
}) => {
  const { mutate: updateIssue } = useMutation(api.issues.patchIssue);

  const { user } = useUser();
  const queryClient = useQueryClient();

  function handleAutoAssign() {
    if (!user) {
      console.error("No user found");
      return;
    }
    updateIssue(
      {
        issue_key: issue.key,
        assignee: {
          id: user.id,
          name: user?.fullName ?? "",
          email: user?.emailAddresses[0]?.emailAddress ?? "",
          avatar: user?.profileImageUrl ?? "",
        },
      },
      {
        onSuccess: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          queryClient.invalidateQueries(["issues"]);
        },
      }
    );
  }
  return (
    <Accordion
      className="my-3 w-min min-w-full rounded-[3px] border"
      type="single"
      collapsible
    >
      <AccordionItem value={`details-${issue.id ?? 0}`}>
        <AccordionTrigger className="flex w-full items-center justify-between p-2 font-medium hover:bg-zinc-100 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:border-b">
          <div className="flex items-center gap-x-1">
            <span className="text-sm">Details</span>
            <span className="text-xs text-zinc-500">
              (Assignee, Sprint, Reporter)
            </span>
          </div>
          <FaChevronUp
            className="mr-2 text-xs text-black transition-transform"
            aria-hidden
          />
        </AccordionTrigger>
        <AccordionContent className="flex flex-col bg-white px-3 [&[data-state=open]]:py-2">
          <div
            data-state={issue.assignee ? "assigned" : "unassigned"}
            className="my-2 grid grid-cols-3 [&[data-state=assigned]]:items-center"
          >
            <span className="text-sm font-semibold text-zinc-600">
              Assignee
            </span>
            <div className="flex flex-col">
              <div className="flex items-center">
                <Image
                  width={20}
                  height={20}
                  src={
                    issue.assignee?.avatar ??
                    "https://www.gravatar.com/avatar?d=mp"
                  }
                  alt={`${issue.assignee?.name ?? "Unassigned"} avatar`}
                  className="mr-2 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="whitespace-nowrap text-sm">
                    {issue.assignee?.name ?? "Unassigned"}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleAutoAssign}
                data-state={issue.assignee ? "assigned" : "unassigned"}
                customColors
                customPadding
                className="mt-1 hidden text-sm text-blue-600 underline-offset-2 hover:underline [&[data-state=unassigned]]:flex"
              >
                Assign to me
              </Button>
            </div>
          </div>
          <div className="my-4 grid grid-cols-3 items-center">
            <span className="text-sm font-semibold text-zinc-600">Sprint</span>
            <div className="flex items-center">
              <span className="text-sm">{issue.sprintId ?? "None"}</span>
            </div>
          </div>
          <div className="my-2 grid grid-cols-3  items-center">
            <span className="text-sm font-semibold text-zinc-600">
              Reporter
            </span>
            <div className="flex items-center">
              <Image
                width={20}
                height={20}
                src={
                  issue.reporter?.avatar ??
                  "https://www.gravatar.com/avatar?d=mp"
                }
                alt={`${issue.reporter?.name ?? "Unassigned"} avatar`}
                className="mr-2 rounded-full"
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
