import { BacklogHeader } from "@/components/backlog/header";
import { Container } from "@/components/ui/container";

const BacklogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="h-full">
      <BacklogHeader />
      <main className="w-full">{children}</main>
    </Container>
  );
};

export default BacklogLayout;
