import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { FiltersProvider } from "@/context/useFiltersContext";
import Toaster from "@/components/toast";
import { ClientProvider } from "@/app/(project)/project/query-client";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClientProvider>
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
    </ClientProvider>
  );
};

export default ProjectLayout;
