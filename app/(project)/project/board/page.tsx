import { Board } from "@/components/board";
import { notFound } from "next/navigation";
import { getProjectFromServer } from "@/app/api/project/route";
import { getIssuesFromServer } from "@/app/api/issues/route";
import { getSprintsFromServer } from "@/app/api/sprints/route";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Board",
};

const BoardPage = async () => {
  const project = await getProjectFromServer();
  const issues = await getIssuesFromServer();
  const sprints = await getSprintsFromServer();

  if (!project || !issues || !sprints) {
    return notFound();
  }

  return <Board project={project} issues={issues} sprints={sprints} />;
};

export default BoardPage;
