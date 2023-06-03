import { useStrictModeDroppable } from "@/hooks/useStrictModeDroppable";
import { isNullish } from "@/utils/helpers";
import { type IssueType } from "@/utils/types";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";
import clsx from "clsx";

const IssueList: React.FC<{ status: string; issues: IssueType[] }> = ({
  status,
  issues,
}) => {
  const [droppableEnabled] = useStrictModeDroppable();

  if (!droppableEnabled) {
    return null;
  }

  return (
    <Droppable droppableId={status}>
      {({ droppableProps, innerRef, placeholder }) => (
        <div
          className={clsx("min-h-full w-[300px] rounded-md bg-gray-100 p-1")}
        >
          <h2 className="mb-4 mt-3 px-2 text-xs text-gray-600">
            {status} {issues.filter((issue) => issue.status == status).length}
          </h2>
          <div
            {...droppableProps}
            ref={innerRef}
            className="-mt-10 h-full pt-10"
          >
            {issues
              .sort((a, b) => {
                if (
                  !isNullish(a.boardPosition) &&
                  !isNullish(b.boardPosition)
                ) {
                  return a.boardPosition - b.boardPosition;
                } else {
                  return a.sprintPosition - b.sprintPosition;
                }
              })
              .map((issue, index) => (
                <Issue key={issue.key} index={index} issue={issue} />
              ))}
            {placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export { IssueList };
