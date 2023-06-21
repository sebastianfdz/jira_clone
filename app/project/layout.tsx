"use client";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { FiltersProvider } from "@/context/use-filters-context";
import { Fragment } from "react";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <TopNavbar />
      <main className="flex h-[calc(100vh_-_3rem)] w-full">
        <Sidebar />
        <FiltersProvider>
          <div className="w-full max-w-[calc(100vw_-_16rem)]">{children}</div>
        </FiltersProvider>
      </main>
    </Fragment>
  );
};

export default ProjectLayout;
