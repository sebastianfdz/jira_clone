import { Board } from "@/components/board";
import { type Metadata } from "next";
import { getQueryClient } from "@/utils/get-query-client";
import { Hydrate } from "@/utils/hydrate";
import { dehydrate } from "@tanstack/query-core";
import { currentUser } from "@clerk/nextjs";
import {
  getIssuesFromServer,
  getProjectFromServer,
  getSprintsFromServer,
} from "@/server/db";

export const metadata: Metadata = {
  title: "Board",
};

const BoardPage = async () => {
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
      <Board />
    </Hydrate>
  );
};

export default BoardPage;
