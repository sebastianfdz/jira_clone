import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import { Roadmap } from "@/components/roadmap";
import {
  getIssuesFromServer,
  getProjectFromServer,
  getSprintsFromServer,
} from "@/server/db";
import { currentUser } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Roadmap",
};

const RoadmapPage = async () => {
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
      <Roadmap />
    </Hydrate>
  );
};

export default RoadmapPage;
