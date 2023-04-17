import { Sidebar } from "@/components/sidebar";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full">{children}</main>
    </div>
  );
};

export default ProjectLayout;
