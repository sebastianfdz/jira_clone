"use client";
import { useIssues } from "@/hooks/query-hooks/useIssues";
import clsx from "clsx";
import { BacklogList } from "./list-backlog";
import { SprintList } from "./list-sprint";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { type IssueType } from "@/utils/types";
import { useCallback } from "react";
import { useFiltersContext } from "@/context/useFiltersContext";
import {
  filterIssuesSearch,
  isEpic,
  isNullish,
  sprintId,
} from "@/utils/helpers";
import { useSprints } from "@/hooks/query-hooks/useSprints";

const ListGroup: React.FC<{ className?: string }> = ({ className }) => {
  const { issues, updateIssue } = useIssues();
  const { search, assignees, isseTypes, epics } = useFiltersContext();
  const { sprints } = useSprints();

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined, sprintId: string | null) => {
      if (!issues) return [];
      let sprintIssues = issues.filter(
        (issue) => issue.sprintId === sprintId && !isEpic(issue)
      );
      if (search.length) {
        sprintIssues = sprintIssues.filter((issue) =>
          filterIssuesSearch(issue, search)
        );
      }
      if (assignees.length) {
        sprintIssues = sprintIssues.filter((issue) =>
          assignees.includes(issue.assignee?.id ?? "unassigned")
        );
      }
      if (epics.length) {
        sprintIssues = sprintIssues.filter(
          (issue) => issue.parentKey && epics.includes(issue.parentKey)
        );
      }
      if (isseTypes.length) {
        sprintIssues = sprintIssues.filter((issue) =>
          isseTypes.includes(issue.type)
        );
      }
      return sprintIssues;
    },
    [search, assignees, epics, isseTypes]
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;
    updateIssue({
      issue_key: result.draggableId,
      sprintId: sprintId(destination.droppableId),
      listPosition: destination.index,
    });
  };

  if (!sprints) return <div />;
  return (
    <div
      className={clsx(
        "min-h-full w-full max-w-full overflow-y-auto",
        className
      )}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {sprints.map((sprint) => (
          <div key={sprint.id} className="my-3">
            <SprintList
              sprint={sprint}
              issues={filterIssues(issues, sprint.id)}
            />
          </div>
        ))}
        <BacklogList id="backlog" issues={filterIssues(issues, null)} />
      </DragDropContext>
    </div>
  );
};

ListGroup.displayName = "ListGroup";

export { ListGroup };
