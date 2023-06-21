import { useStrictModeDroppable } from "@/hooks/use-strictmode-droppable";
import { type IssueType } from "@/utils/types";
import { Droppable } from "react-beautiful-dnd";
import { Issue } from "./issue";
import clsx from "clsx";
import { statusMap } from "../issue/issue-select-status";
import { type IssueStatus } from "@prisma/client";
import { getPluralEnd } from "@/utils/helpers";

const IssueList: React.FC<{ status: IssueStatus; issues: IssueType[] }> = ({
  status,
  issues,
}) => {
  const [droppableEnabled] = useStrictModeDroppable();

  if (!droppableEnabled) {
    return null;
  }

  return (
    <div
      className={clsx(
        "mb-5 h-max min-h-fit w-[350px] rounded-md bg-gray-100 px-1.5  pb-3"
      )}
    >
      <h2 className="sticky top-0 -mx-1.5 -mt-1.5 mb-1.5 rounded-t-md bg-gray-100 px-2 py-3 text-xs text-gray-500">
        {statusMap[status]}{" "}
        {issues.filter((issue) => issue.status == status).length}
        {` ISSUE${getPluralEnd(issues).toUpperCase()}`}
      </h2>

      <Droppable droppableId={status}>
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            {...droppableProps}
            ref={innerRef}
            className=" h-fit min-h-[10px]"
          >
            {issues
              .sort((a, b) => a.boardPosition - b.boardPosition)
              .map((issue, index) => (
                <Issue key={issue.id} index={index} issue={issue} />
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export { IssueList };
