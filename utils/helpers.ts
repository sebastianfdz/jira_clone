import { type IssueCountType } from "./types";
import { type IssueType } from "@/utils/types";
import { type clerkClient } from "@clerk/nextjs";
import { type DefaultUser, type Issue } from "@prisma/client";

type Value<T> = T extends Promise<infer U> ? U : T;

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

export function isSubtask(issue: IssueType | null) {
  if (!issue) return false;
  return issue.type == "SUBTASK";
}

export function hasChildren(issue: IssueType | IssueType["parent"] | null) {
  if (!issue) return false;
  return issue.children.length > 0;
}

export function sprintId(id: string | null | undefined) {
  return id == "backlog" ? null : id;
}

export function isNullish<T>(
  value: T | null | undefined
): value is null | undefined {
  return value == null || value == undefined;
}

export function filterUserForClient(
  user: Value<ReturnType<Awaited<typeof clerkClient.users.getUser>>>
) {
  return <DefaultUser>{
    id: user.id,
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
    email: user?.emailAddresses[0]?.emailAddress ?? "",
    avatar: user.imageUrl,
  };
}

export function issueNotInSearch({
  issue,
  search,
}: {
  issue: IssueType;
  search: string;
}) {
  return (
    search.length &&
    !(
      issue.name.toLowerCase().includes(search.toLowerCase()) ||
      issue.assignee?.name.toLowerCase().includes(search.toLowerCase()) ||
      issue.key.toLowerCase().includes(search.toLowerCase())
    )
  );
}

export function assigneeNotInFilters({
  issue,
  assignees,
}: {
  issue: IssueType;
  assignees: string[];
}) {
  return (
    assignees.length && !assignees.includes(issue.assignee?.id ?? "unassigned")
  );
}

export function epicNotInFilters({
  issue,
  epics,
}: {
  issue: IssueType;
  epics: string[];
}) {
  return epics.length && (!issue.parentId || !epics.includes(issue.parentId));
}

export function issueTypeNotInFilters({
  issue,
  issueTypes,
}: {
  issue: IssueType;
  issueTypes: string[];
}) {
  return issueTypes.length && !issueTypes.includes(issue.type);
}

export function issueSprintNotInFilters({
  issue,
  sprintIds,
  excludeBacklog = false,
}: {
  issue: IssueType;
  sprintIds: string[];
  excludeBacklog?: boolean;
}) {
  if (isNullish(issue.sprintId)) {
    if (sprintIds.length && excludeBacklog) return true;
    return false;
  }
  return sprintIds.length && !sprintIds.includes(issue.sprintId);
}

export function dateToLongString(date: Date) {
  const dateString = new Date(date).toDateString();
  const timeStirng = new Date(date).toLocaleTimeString();

  return dateString + " at " + timeStirng;
}

export function isDone(issue: IssueType) {
  return issue.status == "DONE";
}

export function hexToRgba(hex: string | null, opacity?: number) {
  if (!hex) return "rgba(0, 0, 0, 0)";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity ?? 1})`;
}

export function generateIssuesForClient(
  issues: Issue[],
  users: DefaultUser[],
  activeSprintIds?: string[]
) {
  // Maps are used to make lookups faster
  const userMap = new Map(users.map((user) => [user.id, user]));
  const parentMap = new Map(issues.map((issue) => [issue.id, issue]));

  const issuesForClient = issues.map((issue) => {
    const parent = parentMap.get(issue.parentId ?? "") ?? null;
    const assignee = userMap.get(issue.assigneeId ?? "") ?? null;
    const reporter = userMap.get(issue.reporterId) ?? null;
    const children = issues
      .filter((i) => i.parentId === issue.id)
      .map((issue) => {
        const assignee = userMap.get(issue.assigneeId ?? "") ?? null;
        return Object.assign(issue, { assignee });
      });
    const sprintIsActive = activeSprintIds?.includes(issue.sprintId ?? "");
    return { ...issue, sprintIsActive, parent, assignee, reporter, children };
  });

  return issuesForClient as IssueType[];
}

export function calculateInsertPosition(issues: Issue[]) {
  return Math.max(...issues.map((issue) => issue.sprintPosition), 0) + 1;
}

export function moveItemWithinArray<T>(arr: T[], item: T, newIndex: number) {
  const arrClone = [...arr];
  const oldIndex = arrClone.indexOf(item);
  const oldItem = arrClone.splice(oldIndex, 1)[0];
  if (oldItem) arrClone.splice(newIndex, 0, oldItem);
  return arrClone;
}

export function insertItemIntoArray<T>(arr: T[], item: T, index: number) {
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
}

export function getPluralEnd<T>(arr: T[]) {
  if (arr.length == 0) return "s";
  return arr.length > 1 ? "s" : "";
}
