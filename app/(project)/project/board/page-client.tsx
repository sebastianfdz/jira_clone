// "use client";
// import { Board } from "@/components/board";
// import { useIssues } from "@/hooks/query-hooks/use-issues";
// import { useProject } from "@/hooks/query-hooks/use-project";
// import { useSprints } from "@/hooks/query-hooks/use-sprints";
// import { notFound } from "next/navigation";
// import BoardSkeleton from "./loading";

// const BoardPage = () => {
//   const { project, projectIsLoading } = useProject();
//   const { issues, issuesLoading } = useIssues();
//   const { sprints, sprintsLoading } = useSprints();

//   if (projectIsLoading || issuesLoading || sprintsLoading) {
//     return <BoardSkeleton />;
//   }

//   if (!project || !issues || !sprints) {
//     return notFound();
//   }

//   return <Board project={project} issues={issues} sprints={sprints} />;
// };

// export default BoardPage;
