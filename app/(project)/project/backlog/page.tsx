import { Backlog } from "@/components/backlog";
import { notFound } from "next/navigation";
import { getIssuesFromServer } from "@/app/api/issues/route";
import { getSprintsFromServer } from "@/app/api/sprints/route";
import { getProjectFromServer } from "@/app/api/project/route";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Backlog",
};

const BacklogPage = async () => {
  const project = await getProjectFromServer();
  const issues = await getIssuesFromServer();
  const sprints = await getSprintsFromServer();

  if (!project || !issues || !sprints) {
    return notFound();
  }

  return <Backlog project={project} issues={issues} sprints={sprints} />;
};

export default BacklogPage;
