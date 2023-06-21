"use client";

import { type IssueType } from "@/utils/types";
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
  issueKey: IssueType["key"] | null;
  setIssueKey: React.Dispatch<React.SetStateAction<IssueType["key"] | null>>;
};

const SelectedIssueContext = createContext<SelectedIssueContextProps>({
  issueKey: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIssueKey: () => {},
});

export const SelectedIssueProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [issueKey, setIssueKey] = useState<IssueType["key"] | null>(null);

  const setSelectedIssueUrl = useCallback(
    (key: IssueType["key"] | null) => {
      const urlWithQuery = pathname + (key ? `?selectedIssue=${key}` : "");
      window.history.pushState(null, "", urlWithQuery);
    },
    [pathname]
  );

  useEffect(() => {
    setIssueKey(searchParams.get("selectedIssue"));
  }, [searchParams]);

  useEffect(() => {
    setSelectedIssueUrl(issueKey);
  }, [issueKey, setSelectedIssueUrl]);

  return (
    <SelectedIssueContext.Provider value={{ issueKey, setIssueKey }}>
      {children}
    </SelectedIssueContext.Provider>
  );
};

export const useSelectedIssueContext = () => useContext(SelectedIssueContext);
