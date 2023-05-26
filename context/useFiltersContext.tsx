"use client";
import { type ReactNode, createContext, useContext, useState } from "react";

type FiltersContextProps = {
  assignees: string[];
  setAssignees: React.Dispatch<React.SetStateAction<string[]>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const FiltersContext = createContext<FiltersContextProps>({
  assignees: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAssignees: () => {},
  search: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSearch: () => {},
});

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [assignees, setAssignees] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  return (
    <FiltersContext.Provider
      value={{ assignees, setAssignees, search, setSearch }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFiltersContext = () => useContext(FiltersContext);
