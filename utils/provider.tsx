"use client";

import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  //  QueryClient
} from "@tanstack/react-query";
// import { getQueryClient } from "./get-query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function Providers({ children }: React.PropsWithChildren) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setIsBrowser(true);
  }, []);

  const [client] = useState(
    () => new QueryClient()
    // getQueryClient()
    // new QueryClient()
    // { defaultOptions: { queries: { staleTime: 1000 } } }
  );

  if (!isBrowser) return null;
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default Providers;
