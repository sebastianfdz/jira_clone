import { Board } from "@/components/board";
import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import { api } from "@/utils/api";

export const metadata: Metadata = {
  title: "Board",
};

const BoardPage = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    await queryClient.prefetchQuery(["issues"], api.issues.getIssues),
    await queryClient.prefetchQuery(["sprints"], api.sprints.getSprints),
    await queryClient.prefetchQuery(["project"], api.project.getProject),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Board />
    </Hydrate>
  );
};

export default BoardPage;
