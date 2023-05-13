"use client";
import { useIssues } from "@/hooks/useIssues";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { api } from "@/utils/api";
import { BacklogList } from "./list-backlog";
import { SprintList } from "./list-sprint";
import { type IssueType } from "@/utils/types";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { isNullish, sprintId } from "@/utils/helpers";

const ListGroup: React.FC<{ className?: string }> = ({ className }) => {
  const { issues, updateIssue } = useIssues();
  const { data: sprints } = useQuery(["sprints"], api.sprints.getSprints);

  const onDragEnd = (result: DropResult) => {
    const { destination } = result;
    if (isNullish(destination)) return;
    updateIssue({
      issue_key: result.draggableId,
      sprintId: sprintId(destination.droppableId),
      listPosition: destination.index,
    });
  };

  if (!issues || !sprints) return <div />;
  return (
    <div className={clsx("min-h-full min-w-max overflow-y-auto", className)}>
      <DragDropContext onDragEnd={onDragEnd}>
        {sprints.map((sprint) => (
          <div key={sprint.id} className="my-3">
            <SprintList
              sprint={sprint}
              issues={filterOutEpics(issues, sprint.id)}
            />
          </div>
        ))}
        <BacklogList id="backlog" issues={filterOutEpics(issues, null)} />
      </DragDropContext>
    </div>
  );
};

ListGroup.displayName = "ListGroup";

function filterOutEpics(issues: IssueType[], sprintId: string | null) {
  return issues.filter(
    (issue) => issue.sprintId === sprintId && issue.type !== "EPIC"
  );
}

export { ListGroup };
