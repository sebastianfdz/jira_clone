import { DragDropContext } from "react-beautiful-dnd";
import { Container } from "@/components/shared/Container";
import { BacklogList } from "./BacklogList";
import { SprintList } from "./SprintList";

export const Backlog: React.FC = () => {
  const sprints = [{ id: "1" }, { id: "2" }, { id: "3" }];
  return (
    <Container>
      <h1>Backlog component</h1>
      <DragDropContext onDragEnd={() => null}>
        {sprints.map((sprint) => (
          <SprintList key={sprint.id} {...sprint} />
        ))}
        <BacklogList />
      </DragDropContext>
    </Container>
  );
};
