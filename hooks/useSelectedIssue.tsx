"use client";

import { useSearchParams } from "next/navigation";
import { type ReactNode, createContext, useContext, useState } from "react";

type SelectedIssueContextProps = {
  issue: string | null;
  setIssue: React.Dispatch<React.SetStateAction<string | null>>;
};

const SelectedIssueContext = createContext<SelectedIssueContextProps>({
  issue: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIssue: () => {},
});

export const SelectedIssueProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const searchParams = useSearchParams();
  const [issue, setIssue] = useState<string | null>(
    searchParams.get("selectedIssue")
  );

  return (
    <SelectedIssueContext.Provider value={{ issue, setIssue }}>
      {children}
    </SelectedIssueContext.Provider>
  );
};

export const useSelectedIssueContext = () => useContext(SelectedIssueContext);
