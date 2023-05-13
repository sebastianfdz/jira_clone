import { type IssueCountType } from "./types";
import { type IssueType } from "@/utils/types";

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export function getHeaders() {
  return {
    "Content-type": "application/json",
  };
}

export function moveItemWithinArray(
  arr: unknown[],
  oldIndex: number,
  newIndex: number
) {
  const arrClone = [...arr];
  arrClone.splice(newIndex, 0, arrClone.splice(oldIndex, 1)[0]);
  return arrClone;
}

export function insertItemIntoArray(
  arr: unknown[],
  item: unknown,
  index: number
) {
  // Snippet taken from https://github.com/oldboyxx/jira_clone
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeMany(str: string) {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function getIssueCountByStatus(issues: IssueType[]) {
  return issues.reduce(
    (acc, issue) => {
      acc[issue.status]++;
      return acc;
    },
    {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    } as IssueCountType
  );
}

export function isEpic(issue: IssueType | IssueType["parent"] | null) {
  if (!issue) return false;
  return issue.type == "EPIC";
}
