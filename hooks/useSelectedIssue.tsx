"use client";

import { useSearchParams } from "next/navigation";
import { type ReactNode, createContext, useContext, useState } from "react";

type SelectedIssueContextProps = {
  issueId: string | null;
  setIssueId: React.Dispatch<React.SetStateAction<string | null>>;
};

const SelectedIssueContext = createContext<SelectedIssueContextProps>({
  issueId: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIssueId: () => {},
});

export const SelectedIssueProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const searchParams = useSearchParams();
  const [issueId, setIssueId] = useState<string | null>(
    searchParams.get("selectedIssue")
  );

  return (
    <SelectedIssueContext.Provider value={{ issueId, setIssueId }}>
      {children}
    </SelectedIssueContext.Provider>
  );
};

export const useSelectedIssueContext = () => useContext(SelectedIssueContext);
