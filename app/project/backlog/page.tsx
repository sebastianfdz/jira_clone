import { Backlog } from "@/components/backlog";
import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { dehydrate } from "@tanstack/query-core";
import { Hydrate } from "@/utils/hydrate";
import { currentUser } from "@clerk/nextjs";
import {
  getIssuesFromServer,
  getProjectFromServer,
  getSprintsFromServer,
} from "@/server/db";

export const metadata: Metadata = {
  title: "Backlog",
};

const BacklogPage = async () => {
  const user = await currentUser();
  const queryClient = getQueryClient();

  await Promise.all([
    await queryClient.prefetchQuery(["issues"], () =>
      getIssuesFromServer(user?.id)
    ),
    await queryClient.prefetchQuery(["sprints"], () =>
      getSprintsFromServer(user?.id)
    ),
    await queryClient.prefetchQuery(["project"], getProjectFromServer),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Backlog />
    </Hydrate>
  );
};

export default BacklogPage;
