import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import { Roadmap } from "@/components/roadmap";
import {
  getInitialIssuesFromServer,
  getInitialProjectFromServer,
  getInitialSprintsFromServer,
} from "@/server/functions";
import { currentUser } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Roadmap",
};

const RoadmapPage = async () => {
  const user = await currentUser();
  const queryClient = getQueryClient();

  await Promise.all([
    await queryClient.prefetchQuery(["issues"], () =>
      getInitialIssuesFromServer(user?.id)
    ),
    await queryClient.prefetchQuery(["sprints"], () =>
      getInitialSprintsFromServer(user?.id)
    ),
    await queryClient.prefetchQuery(["project"], getInitialProjectFromServer),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Roadmap />
    </Hydrate>
  );
};

export default RoadmapPage;
