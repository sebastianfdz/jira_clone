import { Container } from "@/components/ui/container";
import { SelectedIssueProvider } from "@/context/use-selected-issue-context";

const BacklogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="h-full">
      <main className="w-full">
        <SelectedIssueProvider>{children}</SelectedIssueProvider>
      </main>
    </Container>
  );
};

export default BacklogLayout;
