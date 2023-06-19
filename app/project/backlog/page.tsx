import { Backlog } from "@/components/backlog";
import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { dehydrate } from "@tanstack/query-core";
import { Hydrate } from "@/utils/hydrate";
import { api } from "@/utils/api";

export const metadata: Metadata = {
  title: "Backlog",
};

const BacklogPage = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    await queryClient.prefetchQuery(["issues"], api.issues.getIssues),
    await queryClient.prefetchQuery(["sprints"], api.sprints.getSprints),
    await queryClient.prefetchQuery(["project"], api.project.getProject),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Backlog />
    </Hydrate>
  );
};

export default BacklogPage;
