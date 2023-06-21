import React, { Fragment, useRef, useState } from "react";
import { NotImplemented } from "@/components/not-implemented";
import { LightningIcon } from "@/components/svgs";
import { IssueTitle } from "../../issue-title";
import { IssueSelectStatus } from "../../issue-select-status";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { type IssueType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Comments } from "./issue-details-info-comments";
import { IssueMetaInfo } from "./issue-details-info-meta";
import { Description } from "./issue-details-info-description";
import { IssueDetailsInfoAccordion } from "./issue-details-info-accordion";
import { IssueDetailsInfoActions } from "./issue-details-info-actions";
import { ChildIssueList } from "./issue-details-info-child-issues";
import { hasChildren, isEpic } from "@/utils/helpers";
import { ColorPicker } from "@/components/color-picker";
import { useContainerWidth } from "@/hooks/use-container-width";
import Split from "react-split";
import "@/styles/split.css";

const IssueDetailsInfo = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType | undefined }
>(({ issue }, ref) => {
  const [parentRef, parentWidth] = useContainerWidth();

  if (!issue) return <div />;
  return (
    <div ref={parentRef}>
      {!parentWidth ? null : parentWidth > 800 ? (
        <LargeIssueDetails issue={issue} ref={ref} />
      ) : (
        <SmallIssueDetailsInfo issue={issue} ref={ref} />
      )}
    </div>
  );
});

IssueDetailsInfo.displayName = "IssueDetailsInfo";

const SmallIssueDetailsInfo = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType }
>(({ issue }, ref) => {
  const { issueKey } = useSelectedIssueContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChildIssue, setIsAddingChildIssue] = useState(false);

  return (
    <Fragment>
      <div className="flex items-center gap-x-2">
        {isEpic(issue) ? <ColorPicker issue={issue} /> : null}
        <h1
          ref={ref}
          role="button"
          onClick={() => setIsEditing(true)}
          data-state={isEditing ? "editing" : "notEditing"}
          className="w-full transition-all [&[data-state=notEditing]]:hover:bg-gray-100"
        >
          <IssueTitle
            className="mr-1 py-1"
            key={issue.id + issue.name}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            issue={issue}
            ref={nameRef}
          />
        </h1>
      </div>

      <IssueDetailsInfoActions
        onAddChildIssue={() => setIsAddingChildIssue(true)}
      />
      <div className="relative flex items-center gap-x-3">
        <IssueSelectStatus
          key={issue.id + issue.status}
          currentStatus={issue.status}
          issueId={issue.id}
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
      <Description issue={issue} key={String(issueKey) + issue.id} />
      {hasChildren(issue) || isAddingChildIssue ? (
        <ChildIssueList
          issues={issue.children}
          parentIsEpic={isEpic(issue)}
          parentId={issue.id}
          isAddingChildIssue={isAddingChildIssue}
          setIsAddingChildIssue={setIsAddingChildIssue}
        />
      ) : null}
      <IssueDetailsInfoAccordion issue={issue} />
      <IssueMetaInfo issue={issue} />
      <Comments issue={issue} />
    </Fragment>
  );
});

SmallIssueDetailsInfo.displayName = "SmallIssueDetailsInfo";

const LargeIssueDetails = React.forwardRef<
  HTMLDivElement,
  { issue: IssueType }
>(({ issue }, ref) => {
  const { issueKey } = useSelectedIssueContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChildIssue, setIsAddingChildIssue] = useState(false);

  return (
    <Split
      sizes={[60, 40]}
      gutterSize={2}
      className="flex max-h-[70vh] w-full overflow-hidden"
      minSize={300}
    >
      <div className="overflow-y-auto pr-3">
        <div className="flex items-center gap-x-2">
          {isEpic(issue) ? <ColorPicker issue={issue} /> : null}
          <h1
            ref={ref}
            role="button"
            onClick={() => setIsEditing(true)}
            data-state={isEditing ? "editing" : "notEditing"}
            className="w-full transition-all [&[data-state=notEditing]]:hover:bg-gray-100"
          >
            <IssueTitle
              className="mr-1 py-1"
              key={issue.id + issue.name}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              issue={issue}
              ref={nameRef}
            />
          </h1>
        </div>
        <IssueDetailsInfoActions
          onAddChildIssue={() => setIsAddingChildIssue(true)}
          variant={"lg"}
        />
        <Description issue={issue} key={String(issueKey) + issue.id} />
        {hasChildren(issue) || isAddingChildIssue ? (
          <ChildIssueList
            issues={issue.children}
            parentIsEpic={isEpic(issue)}
            parentId={issue.id}
            isAddingChildIssue={isAddingChildIssue}
            setIsAddingChildIssue={setIsAddingChildIssue}
          />
        ) : null}
        <Comments issue={issue} />
      </div>

      <div className="mt-4 bg-white pl-3">
        <div className="relative flex items-center gap-x-3">
          <IssueSelectStatus
            key={issue.id + issue.status}
            currentStatus={issue.status}
            issueId={issue.id}
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

        <IssueDetailsInfoAccordion issue={issue} />
        <IssueMetaInfo issue={issue} />
      </div>
    </Split>
  );
});

LargeIssueDetails.displayName = "LargeIssueDetails";

export { IssueDetailsInfo };
