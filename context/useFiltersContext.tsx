"use client";
import { type IssueType } from "@/utils/types";
import { type Sprint } from "@prisma/client";
import { type ReactNode, createContext, useContext, useState } from "react";
import { type UserResource } from "@clerk/types";

type FiltersContextProps = {
  assignees: UserResource["id"][];
  setAssignees: React.Dispatch<React.SetStateAction<UserResource["id"][]>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  epics: IssueType["id"][];
  setEpics: React.Dispatch<React.SetStateAction<IssueType["id"][]>>;
  issueTypes: IssueType["type"][];
  setIssueTypes: React.Dispatch<React.SetStateAction<IssueType["type"][]>>;
  sprints: Sprint["id"][];
  setSprints: React.Dispatch<React.SetStateAction<Sprint["id"][]>>;
};

const FiltersContext = createContext<FiltersContextProps>({
  assignees: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAssignees: () => {},
  search: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSearch: () => {},
  epics: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setEpics: () => {},
  issueTypes: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIssueTypes: () => {},
  sprints: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSprints: () => {},
});

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [assignees, setAssignees] = useState<UserResource["id"][]>([]);
  const [search, setSearch] = useState<string>("");
  const [epics, setEpics] = useState<IssueType["id"][]>([]);
  const [issueTypes, setIssueTypes] = useState<IssueType["type"][]>([]);
  const [sprints, setSprints] = useState<Sprint["id"][]>([]);

  return (
    <FiltersContext.Provider
      value={{
        assignees,
        setAssignees,
        search,
        setSearch,
        epics,
        setEpics,
        issueTypes,
        setIssueTypes,
        sprints,
        setSprints,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFiltersContext = () => useContext(FiltersContext);
