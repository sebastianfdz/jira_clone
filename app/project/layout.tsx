"use client";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { Fragment } from "react";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <TopNavbar />
      <div className="flex h-[calc(100vh_-_3rem)] w-full pb-5">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
    </Fragment>
  );
};

export default ProjectLayout;
