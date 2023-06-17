"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

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
  const pathname = usePathname();
  const [issueId, setIssueId] = useState<string | null>(null);

  const setSelectedIssueUrl = useCallback(
    (id: string | null) => {
      const urlWithQuery = pathname + (id ? `?selectedIssue=${id}` : "");
      window.history.pushState(null, "", urlWithQuery);
    },
    [pathname]
  );

  useEffect(() => {
    setIssueId(searchParams.get("selectedIssue"));
  }, [searchParams]);

  useEffect(() => {
    setSelectedIssueUrl(issueId);
  }, [issueId, setSelectedIssueUrl]);

  return (
    <SelectedIssueContext.Provider value={{ issueId, setIssueId }}>
      {children}
    </SelectedIssueContext.Provider>
  );
};

export const useSelectedIssueContext = () => useContext(SelectedIssueContext);
