import { Sidebar } from "@/components/sidebar";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="flex h-12 w-full items-center justify-center border-b">
        top nav bar
      </div>
      <div className="flex">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
};

export default ProjectLayout;
