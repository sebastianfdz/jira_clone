import { useCallback, useEffect, useState } from "react";
import { getIssueCountByStatus } from "@/utils/helpers";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { type IssueType } from "@/utils/types";
import clsx from "clsx";

const ProgressBar: React.FC<{
  issues: IssueType[];
  variant?: "sm" | "lg";
}> = ({ issues, variant = "lg" }) => {
  const memoizedCount = useCallback(getIssueCountByStatus, []);
  const [statusCount, setStatusCount] = useState(() =>
    memoizedCount(issues ?? [])
  );

  useEffect(() => {
    setStatusCount(() => memoizedCount(issues ?? []));
  }, [issues, memoizedCount]);
  return (
    <div className="flex items-center gap-x-5">
      <div
        style={{ width: "100%" }}
        className={clsx(
          variant === "sm" ? "h-1" : "h-2.5",
          "flex  gap-x-0.5 overflow-hidden rounded-full bg-white"
        )}
      >
        {statusCount.DONE ? (
          <TooltipWrapper
            text={`Done: ${statusCount.DONE} of ${issues.length} issues`}
          >
            <div
              style={{ width: `${(statusCount.DONE / issues.length) * 100}%` }}
              className="float-left h-full bg-done"
            />
          </TooltipWrapper>
        ) : null}
        {statusCount.IN_PROGRESS ? (
          <TooltipWrapper
            text={`In Progress: ${statusCount.IN_PROGRESS} of ${issues.length} issues`}
          >
            <div
              style={{
                width: `${(statusCount.IN_PROGRESS / issues.length) * 100}%`,
              }}
              className="float-left h-full bg-inprogress"
            />
          </TooltipWrapper>
        ) : null}
        {statusCount.TODO ? (
          <TooltipWrapper
            text={`To Do: ${statusCount.TODO} of ${issues.length} issues`}
          >
            <div
              style={{ width: `${(statusCount.TODO / issues.length) * 100}%` }}
              className="float-left h-full bg-todo"
            />
          </TooltipWrapper>
        ) : null}
      </div>
      {variant === "lg" ? (
        <div className="whitespace-nowrap text-sm text-gray-500">
          {((statusCount.DONE / issues.length) * 100).toFixed(0)}% Done
        </div>
      ) : null}
    </div>
  );
};

export { ProgressBar };
