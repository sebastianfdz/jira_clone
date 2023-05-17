"use client";
import { useIssues } from "@/hooks/useIssues";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { api } from "@/utils/api";
import { BacklogList } from "./list-backlog";
import { SprintList } from "./list-sprint";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { isEpic, isNullish, sprintId } from "@/utils/helpers";
import { type IssueType } from "@/utils/types";
import { useCallback } from "react";

const ListGroup: React.FC<{ search: string; className?: string }> = ({
  search,
  className,
}) => {
  const { issues, updateIssue } = useIssues();
  const { data: sprints } = useQuery(["sprints"], api.sprints.getSprints);

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined, sprintId: string | null) => {
      if (!issues) return [];
      const sprintIssues = issues.filter(
        (issue) => issue.sprintId === sprintId && !isEpic(issue)
      );
      if (search === "") return sprintIssues;
      else {
        return sprintIssues.filter(
          (issue) =>
            issue.name.toLowerCase().includes(search.toLowerCase()) ||
            issue.assignee?.name.toLowerCase().includes(search.toLowerCase()) ||
            issue.key.toLowerCase().includes(search.toLowerCase())
        );
      }
    },
    [search]
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
    <div className={clsx("min-h-full min-w-max overflow-y-auto", className)}>
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
