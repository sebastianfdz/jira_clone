"use client";
import React, { Fragment, useLayoutEffect, useRef } from "react";
import {
  type Sprint,
  type IssueStatus,
  //  type Project
} from "@prisma/client";
// import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import "@/styles/split.css";
import { BoardHeader } from "./header";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { type IssueType } from "@/utils/types";

import { isNullish } from "@/utils/helpers";
import { IssueList } from "./issue-list";
import { IssueDetailsModal } from "../modals/board-issue-details";
// import { useQuery } from "@tanstack/react-query";
// import { api } from "@/utils/api";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { useProject } from "@/hooks/query-hooks/use-project";

const STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const Board: React.FC =
  // <{
  //   project: Project;
  //   issues: IssueType[];
  //   sprints: Sprint[];
  // }>
  () =>
    // { project, issues, sprints }
    {
      // const { issueId, setIssueId } = useSelectedIssueContext();
      const renderContainerRef = useRef<HTMLDivElement>(null);
      // Set initial data for queries
      // const issuesQuery = useQuery(
      //   ["issues"],
      //   api.issues.getIssues
      //   //  {
      //   //   initialData: issues,
      //   // }
      // );
      // const sprintsQuery = useQuery(
      //   ["sprints"],
      //   api.sprints.getSprints
      //   //  {
      //   //   initialData: sprints,
      //   // }
      // );
      // useQuery(
      //   ["project"],
      //   api.project.getProject
      //   // { initialData: project }
      // );

      const { issues } = useIssues();
      const { sprints } = useSprints();
      const { project } = useProject();

      function filterIssuesBySprintAndStatus({
        issue,
        sprints,
        status,
      }: {
        issue: IssueType;
        sprints: Sprint[];
        status: IssueStatus;
      }) {
        const sprint = sprints.find((sprint) => sprint.id == issue.sprintId);
        if (!sprint) return false;
        return issue.status == status && sprint.status == "ACTIVE";
      }

      const { updateIssue } = useIssues();
      useLayoutEffect(() => {
        if (!renderContainerRef.current) return;
        const calculatedHeight = renderContainerRef.current.offsetTop;
        renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
      }, []);

      if (!issues || !sprints || !project) {
        return null;
      }

      const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;
        if (isNullish(destination) || isNullish(source)) return;
        console.log({
          issue_key: result.draggableId,
          status: destination.droppableId as IssueStatus,
          boardPosition: destination.index,
        });
        updateIssue({
          issue_key: result.draggableId,
          status: destination.droppableId as IssueStatus,
          boardPosition: destination.index,
        });
      };

      return (
        <Fragment>
          <IssueDetailsModal />
          <BoardHeader project={project} />
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              ref={renderContainerRef}
              className="flex min-h-max w-full max-w-full gap-x-4 overflow-y-auto"
            >
              {STATUSES.map((status) => (
                <IssueList
                  key={status}
                  status={status}
                  issues={issues.filter((issue) =>
                    filterIssuesBySprintAndStatus({
                      issue,
                      status,
                      sprints: sprints,
                    })
                  )}
                />
              ))}
            </div>
          </DragDropContext>
        </Fragment>
      );
    };

export { Board };
