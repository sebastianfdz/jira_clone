import { type IssueType } from "@/utils/types";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";

const Issue: React.FC<{ issue: IssueType; index: number }> = ({
  issue,
  index,
}) => {
  return (
    <Draggable draggableId={issue.key} index={index}>
      {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
        <div
          role="button"
          // data-state={issueId == issue.key ? "selected" : "not-selected"}
          // onClick={() => setIssueId(issue.key)}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={clsx(
            isDragging ? "bg-blue-100" : "bg-white",
            "group flex w-full max-w-full items-center justify-between border-[0.3px] border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 [&[data-state=selected]]:bg-blue-100"
          )}
        >
          {issue.name}
        </div>
      )}
    </Draggable>
  );
};

export { Issue };
