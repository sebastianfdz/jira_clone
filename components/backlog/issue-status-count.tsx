"use client";
import { type IsseCountType } from "@/utils/types";
import clsx from "clsx";
import { Fragment } from "react";

const IssueStatusCount: React.FC<{ statusCount: IsseCountType }> = ({
  statusCount,
}) => {
  return (
    <Fragment>
      {Object.entries(statusCount ?? {})?.map(([status, count]) => (
        <span
          key={status}
          className={clsx(
            status == "TODO" && "bg-gray-300 text-black",
            status == "IN_PROGRESS" && "bg-blue-700 text-white",
            status == "DONE" && "bg-green-700 text-white",
            "flex h-5 items-center justify-center rounded-full px-1.5 py-0.5 text-sm font-semibold"
          )}
        >
          {count}
        </span>
      ))}
    </Fragment>
  );
};

export { IssueStatusCount };
