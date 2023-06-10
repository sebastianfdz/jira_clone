// "use client";
// import { Backlog } from "@/components/backlog";
// import { useIssues } from "@/hooks/query-hooks/use-issues";
// import { useProject } from "@/hooks/query-hooks/use-project";
// import { useSprints } from "@/hooks/query-hooks/use-sprints";
// import { notFound } from "next/navigation";
// import BacklogSkeleton from "./loading";

// const BacklogPage = () => {
//   const { project, projectIsLoading } = useProject();
//   const { issues, issuesLoading } = useIssues();
//   const { sprints, sprintsLoading } = useSprints();

//   if (projectIsLoading || issuesLoading || sprintsLoading) {
//     return <BacklogSkeleton />;
//   }

//   if (!project || !issues || !sprints) {
//     return notFound();
//   }

//   return <Backlog project={project} issues={issues} sprints={sprints} />;
// };

// export default BacklogPage;
