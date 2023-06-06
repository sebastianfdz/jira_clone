"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type ReactNode, useState } from "react";

const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setIsBrowser(true);
  }, []);

  if (!isBrowser) return null;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { ClientProvider };
