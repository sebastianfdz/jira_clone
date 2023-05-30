"use client";
import { Container } from "@/components/ui/container";
import { SelectedIssueProvider } from "@/context/useSelectedIssueContext";

const BoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="h-full">
      <main className="w-full">
        <SelectedIssueProvider>{children}</SelectedIssueProvider>
      </main>
    </Container>
  );
};

export default BoardLayout;
