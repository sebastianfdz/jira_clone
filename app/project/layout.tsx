"use client";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { FiltersProvider } from "@/hooks/useFilters";
import * as Tooltip from "@radix-ui/react-tooltip";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tooltip.Provider>
      <TopNavbar />
      <div className="flex h-[calc(100vh_-_3rem)] w-full">
        <Sidebar />
        <FiltersProvider>
          <main className="w-full">{children}</main>
        </FiltersProvider>
      </div>
    </Tooltip.Provider>
  );
};

export default ProjectLayout;
