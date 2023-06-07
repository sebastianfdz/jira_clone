import { type IssueCountType } from "./types";
import { type IssueType } from "@/utils/types";
import type { User as ClerkUser } from "@clerk/nextjs/dist/api";
import { type User } from "@/server/db";
import { type Issue } from "@prisma/client";

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

export function moveIssueWithinBoardList(payload: {
  issueList: IssueType[];
  oldIndex: number;
  newIndex: number;
}) {
  const { issueList, oldIndex, newIndex } = payload;
  const issueListClone = [...issueList].sort((a, b) => {
    if (a.boardPosition == null) return 1;
    if (b.boardPosition == null) return -1;
    return a.boardPosition - b.boardPosition;
  });
  const [removedItem] = issueListClone.splice(oldIndex, 1);

  if (!removedItem) return issueListClone;

  issueListClone.splice(newIndex, 0, removedItem);

  return issueListClone.map((issue, index) => {
    return <IssueType>{
      ...issue,
      boardPosition: index,
    };
  });
}

export function moveIssueWithinBacklogList(payload: {
  issueList: IssueType[];
  oldIndex: number;
  newIndex: number;
}) {
  const { issueList, oldIndex, newIndex } = payload;

  const issueListClone = [...issueList].sort(
    (a, b) => a.sprintPosition - b.sprintPosition
  );

  const [removedItem] = issueListClone.splice(oldIndex, 1);

  if (!removedItem) return issueListClone;

  issueListClone.splice(newIndex, 0, removedItem);

  return issueListClone.map((issue, index) => {
    return <IssueType>{
      ...issue,
      sprintPosition: index,
    };
  });
}

export function insertIssueIntoBacklogList(payload: {
  issueList: IssueType[];
  issue: IssueType;
  index: number;
}) {
  const { issueList, issue, index } = payload;
  const issueListClone = [...issueList].sort(
    (a, b) => a.sprintPosition - b.sprintPosition
  );
  issueListClone.splice(index, 0, issue);
  return issueListClone.map((issue, index) => {
    return <IssueType>{
      ...issue,
      sprintPosition: index,
    };
  });
}

export function insertIssueIntoBoardList(payload: {
  issueList: IssueType[];
  issue: IssueType;
  index: number;
}) {
  const { issueList, issue, index } = payload;
  const issueListClone = [...issueList].sort((a, b) => {
    if (a.boardPosition == null) return 1;
    if (b.boardPosition == null) return -1;
    return a.boardPosition - b.boardPosition;
  });
  issueListClone.splice(index, 0, issue);
  return issueListClone.map((issue, index) => {
    return <IssueType>{
      ...issue,
      boardPosition: index,
    };
  });
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

export function filterUserForClient(user: ClerkUser) {
  return <User>{
    id: user.id,
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
    email: user?.emailAddresses[0]?.emailAddress ?? "",
    avatar: user.profileImageUrl,
  };
}

export function filterIssuesSearch(issue: IssueType, search: string) {
  return (
    issue.name.toLowerCase().includes(search.toLowerCase()) ||
    issue.assignee?.name.toLowerCase().includes(search.toLowerCase()) ||
    issue.key.toLowerCase().includes(search.toLowerCase())
  );
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
  users: User[],
  activeSprintIds?: string[]
) {
  // Construct map for faster lookup
  const userMap = new Map(users.map((user) => [user.id, user]));
  const parentMap = new Map(issues.map((issue) => [issue.key, issue]));

  const issuesForClient = issues.map((issue) => {
    const parent = parentMap.get(issue.parentKey ?? "") ?? null;
    const assignee = userMap.get(issue.assigneeId ?? "") ?? null;
    const reporter = userMap.get(issue.reporterId) ?? null;
    const children = issues.filter((i) => i.parentKey === issue.key);
    const sprintIsActive = activeSprintIds?.includes(issue.sprintId ?? "");
    return { ...issue, sprintIsActive, parent, assignee, reporter, children };
  });

  return issuesForClient as IssueType[];
}

export function calculateInsertPosition(issues: Issue[]) {
  return Math.max(...issues.map((issue) => issue.sprintPosition)) + 1;
}
