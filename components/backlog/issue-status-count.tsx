"use client";
import { getIssueCountByStatus } from "@/utils/helpers";
// import { type IssueCountType } from "@/utils/types";
import { type Issue as IssueType } from "@prisma/client";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";

const IssueStatusCount: React.FC<{ issues: IssueType[] }> = ({ issues }) => {
  const [statusCount, setStatusCount] = useState(() =>
    getIssueCountByStatus(issues ?? [])
  );

  useEffect(() => {
    setStatusCount(() => getIssueCountByStatus(issues ?? []));
  }, [issues]);

  return (
    <Fragment>
      {Object.entries(statusCount ?? {})?.map(([status, count]) => (
        <span
          key={status}
          className={clsx(
            status == "TODO" && "bg-zinc-300 text-black",
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
