"use client";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useIssues } from "@/hooks/useIssues";
import { CgAttachment } from "react-icons/cg";
import { ChildrenTreeIcon } from "../icons";

import { BiLink } from "react-icons/bi";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { MdClose, MdOutlineShare, MdRemoveRedEye } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineLike } from "react-icons/ai";
import { FaChevronUp } from "react-icons/fa";
import { Button } from "../ui/button";
import { IssueDropdownMenu } from "../issue-menu";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { NotImplemented } from "../not-implemented";
import { IssuePath } from "./issue-path";
import { LightningIcon } from "../icons";
import { IssueTitle } from "../issue-title";
import { IssueSelectStatus } from "../issue-select-status";
import { type IssueType } from "@/utils/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { dateToLongString } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { Avatar } from "../avatar";
import { useKeydownListener } from "@/hooks/useKeydownListener";
import { Editor } from "../text-editor";

const IssueDetails: React.FC<{
  issueId: string | null;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issueId, setIssueId }) => {
  const { issues } = useIssues();
  const renderContainerRef = React.useRef<HTMLDivElement>(null);

  const getIssue = useCallback(
    (issueId: string | null) => {
      return issues?.find((issue) => issue.key === issueId);
    },
    [issues]
  );
  const [issueInfo, setIssueInfo] = useState(() => getIssue(issueId));

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop;
    renderContainerRef.current.style.minHeight = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  useEffect(() => {
    setIssueInfo(() => getIssue(issueId));
  }, [issueId, getIssue]);

  if (!issueInfo || !issues) return <div />;

  return (
    <div
      ref={renderContainerRef}
      data-state={issueId ? "open" : "closed"}
      className="z-10 flex w-full flex-col overflow-y-auto pl-4 pr-2 [&[data-state=closed]]:hidden"
    >
      <IssueDetailsHeader issue={issueInfo} setIssueId={setIssueId} />
      <IssueDetailsInfo key={issueId} issue={issueInfo} />
    </div>
  );
};

const IssueDetailsHeader: React.FC<{
  issue: IssueType;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ issue, setIssueId }) => {
  if (!issue) return <div />;
  return (
    <div className="flex h-fit w-full items-center justify-between p-0.5">
      <IssuePath issue={issue} setIssueId={setIssueId} />
      <div className="relative flex items-center gap-x-0.5">
        <NotImplemented feature="watch">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <MdRemoveRedEye className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="like">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <AiOutlineLike className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="share">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <MdOutlineShare className="text-xl" />
          </Button>
        </NotImplemented>
        <IssueDropdownMenu issue={issue}>
          <DropdownTrigger
            asChild
            className="rounded-m flex items-center gap-x-1 bg-opacity-30 p-2 text-xs font-semibold focus:ring-2 [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white"
          >
            <div className="rounded-[3px] text-gray-800 hover:bg-gray-200">
              <BsThreeDots className="sm:text-xl" />
            </div>
          </DropdownTrigger>
        </IssueDropdownMenu>
        <Button
          customColors
          className="bg-transparent hover:bg-gray-200"
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
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  if (!issue) return <div />;
  return (
    <Fragment>
      <h1
        role="button"
        onClick={() => setIsEditing(true)}
        data-state={isEditing ? "editing" : "notEditing"}
        className="transition-all [&[data-state=notEditing]]:hover:bg-gray-100"
      >
        <IssueTitle
          className="mr-1 py-1"
          key={issue.key + issue.name}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          issue={issue}
          ref={nameRef}
        />
      </h1>
      <div className="flex gap-x-2 text-gray-700">
        <NotImplemented feature="attachment">
          <Button customColors className="bg-gray-100 hover:bg-gray-200">
            <CgAttachment className="rotate-45 text-xl" />
          </Button>
        </NotImplemented>
        <Button customColors className="bg-gray-100 hover:bg-gray-200">
          <ChildrenTreeIcon />
        </Button>
        <NotImplemented feature="link">
          <Button customColors className="bg-gray-100 hover:bg-gray-200">
            <BiLink className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="add apps">
          <Button customColors className="bg-gray-100 hover:bg-gray-200">
            <BsThreeDots className="text-xl" />
          </Button>
        </NotImplemented>
      </div>
      <div className="relative flex items-center gap-x-3">
        <IssueSelectStatus
          key={issue.key + issue.status}
          currentStatus={issue.status}
          issueId={issue.key}
          variant="lg"
        />
        <NotImplemented>
          <Button customColors className="hover:bg-gray-200">
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
      <IssueMetaInfo issue={issue} />
      <Comments />
    </Fragment>
  );
};

const Comments: React.FC = () => {
  const scrollRef = useRef(null);
  const [showTextEditor, setShowTextEditor] = useState(false);
  useKeydownListener(scrollRef, ["m", "M"], handleEdit);
  function handleEdit(ref: React.RefObject<HTMLElement>) {
    setShowTextEditor(true);
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }
  return (
    <Fragment>
      <h2>Comments</h2>
      <div className="mb-10 mt-2 flex w-full gap-x-2">
        {showTextEditor ? (
          <div>
            <Editor />
            <div className="my-3">
              <Button
                onClick={() => setShowTextEditor(false)}
                customColors
                customPadding
                className="bg-inprogress px-4 py-1.5 text-sm font-medium text-white"
              >
                Save
              </Button>
              <Button
                onClick={() => setShowTextEditor(false)}
                customColors
                customPadding
                className="px-4 py-1.5 text-sm font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <AddComment onAddComment={() => handleEdit(scrollRef)} />
        )}
        <div ref={scrollRef} id="dummy-scroll-div" />
      </div>
    </Fragment>
  );
};

const AddComment: React.FC<{
  onAddComment: () => void;
}> = ({ onAddComment }) => {
  const { user } = useUser();
  return (
    <div className="flex w-full gap-x-2">
      <Avatar
        className="mt-2"
        src={user?.profileImageUrl ?? "https://www.gravatar.com/avatar?d=mp"}
        alt={
          user ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}` : "Guest"
        }
      />
      <div className="w-full">
        <input
          onClick={onAddComment}
          placeholder="Add a comment..."
          className="w-full rounded-[3px] border border-gray-300 px-4 py-2 placeholder:text-sm"
        />
        <p className="my-2 text-xs text-gray-500">
          <span className="font-bold">Pro tip:</span>
          <span> press </span>
          <span className="rounded-[3px] bg-gray-300 px-1 py-0.5 font-bold">
            M
          </span>
          <span> to comment </span>
        </p>
      </div>
    </div>
  );
};

const IssueMetaInfo: React.FC<{ issue: IssueType }> = ({ issue }) => {
  return (
    <div className="mb-3 flex flex-col gap-y-3">
      <span className="text-xs text-gray-500">
        {"Created " + dateToLongString(issue.createdAt)}
      </span>
      <span className="text-xs text-gray-500">
        {"Updated " + dateToLongString(issue.updatedAt)}
      </span>
    </div>
  );
};

const IssueDetailsInfoAccordion: React.FC<{ issue: IssueType }> = ({
  issue,
}) => {
  const { updateIssue } = useIssues();
  const { data: sprints } = useQuery(["sprints"], api.sprints.getSprints);
  const { user } = useUser();
  const [openAccordion, setOpenAccordion] = useState("details");

  function handleAutoAssign() {
    if (!user) {
      console.error("No user found");
      return;
    }
    updateIssue({
      issue_key: issue.key,
      assigneeId: user.id,
    });
  }
  return (
    <Accordion
      onValueChange={setOpenAccordion}
      value={openAccordion}
      className="my-3 w-min min-w-full rounded-[3px] border"
      type="single"
      collapsible
    >
      <AccordionItem value={"details"}>
        <AccordionTrigger className="flex w-full items-center justify-between p-2 font-medium hover:bg-gray-100 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:border-b">
          <div className="flex items-center gap-x-1">
            <span className="text-sm">Details</span>
            <span className="text-xs text-gray-500">
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
            <span className="text-sm font-semibold text-gray-600">
              Assignee
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-x-3">
                <Image
                  width={20}
                  height={20}
                  src={
                    issue.assignee?.avatar ??
                    "https://www.gravatar.com/avatar?d=mp"
                  }
                  alt={`${issue.assignee?.name ?? "Unassigned"} avatar`}
                  className="rounded-full"
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
            <span className="text-sm font-semibold text-gray-600">Sprint</span>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                {sprints?.find((sprint) => sprint?.id == issue.sprintId)
                  ?.name ?? "None"}
              </span>
            </div>
          </div>
          <div className="my-2 grid grid-cols-3  items-center">
            <span className="text-sm font-semibold text-gray-600">
              Reporter
            </span>
            <div className="flex items-center gap-x-3 ">
              <Image
                width={20}
                height={20}
                src={
                  issue.reporter?.avatar ??
                  "https://www.gravatar.com/avatar?d=mp"
                }
                alt={`${issue.reporter?.name ?? "Unassigned"} avatar`}
                className="rounded-full"
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
