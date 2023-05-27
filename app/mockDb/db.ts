import { type StatusObject } from "@/components/issue/issue-select-status";

export const statuses: StatusObject[] = [
  {
    value: "TODO",
    smBgColor: "#d4d4d8",
    lgBgColor: "#d4d4d8",
    smTextColor: "#4b5563",
    lgTextColor: "#4b5563",
  },
  {
    value: "IN_PROGRESS",
    smBgColor: "#e0ecfc",
    lgBgColor: "#0854cc",
    smTextColor: "#0854cc",
    lgTextColor: "#fff",
  },
  {
    value: "DONE",
    smBgColor: "#e8fcec",
    lgBgColor: "#08845c",
    smTextColor: "#08845c",
    lgTextColor: "#fff",
  },
];
