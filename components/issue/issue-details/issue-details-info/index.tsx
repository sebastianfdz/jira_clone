import { NotImplemented } from "@/components/not-implemented";
import { LightningIcon } from "@/components/svgs";
import { IssueTitle } from "../../issue-title";
import { IssueSelectStatus } from "../../issue-select-status";
import { CgAttachment } from "react-icons/cg";
import { ChildrenTreeIcon } from "@/components/svgs";
import { BiLink } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import React, { Fragment, useRef, useState } from "react";
import { type IssueType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Comments } from "./issue-details-info-comments";
import { IssueMetaInfo } from "./issue-details-info-meta";
import { Description } from "./issue-details-info-description";
import { IssueDetailsInfoAccordion } from "./issue-details-info-accordion";

const IssueDetailsInfo = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType | undefined }
>(({ issue }, ref) => {
  const { issueId } = useSelectedIssueContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  if (!issue) return <div />;
  return (
    <Fragment>
      <h1
        ref={ref}
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
      <Description issue={issue} key={String(issueId) + issue.key} />
      <IssueDetailsInfoAccordion issue={issue} />
      <IssueMetaInfo issue={issue} />
      <Comments issue={issue} />
    </Fragment>
  );
});

IssueDetailsInfo.displayName = "IssueDetailsInfo";

export { IssueDetailsInfo };
