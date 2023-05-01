import { Sidebar } from "@/components/sidebar";
import { Fragment } from "react";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <div className="flex h-12 w-full items-center justify-center border-b">
        top nav bar
      </div>
      <div className="flex h-[calc(100vh_-_3rem)] w-full pb-5">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
    </Fragment>
  );
};

export default ProjectLayout;
