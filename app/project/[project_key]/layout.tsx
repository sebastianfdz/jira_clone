import { Fragment } from "react";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="flex h-screen w-72 items-center justify-center border bg-blue-100">
        Sidebar
      </div>
      <main>{children}</main>
    </div>
  );
};

export default ProjectLayout;
