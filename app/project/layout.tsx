"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { FiltersProvider } from "@/context/useFiltersContext";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (typeof window !== "undefined") setIsBrowser(true);
  }, []);

  if (!isBrowser) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        containerStyle={{
          height: "92vh",
          marginLeft: "3vw",
        }}
      />
      <TopNavbar />
      <main className="flex h-[calc(100vh_-_3rem)] w-full">
        <Sidebar />
        <FiltersProvider>
          <div className="w-full max-w-[calc(100vw_-_16rem)]">{children}</div>
        </FiltersProvider>
      </main>
    </QueryClientProvider>
  );
};

export default ProjectLayout;
