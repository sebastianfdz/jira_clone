import axios from "axios";
import { getBaseUrl, getHeaders } from "../helpers";
import {
  type GetSprintsResponse,
  type PostSprintResponse,
} from "@/app/api/sprints/route";
import {
  type PatchSprintBody,
  type PatchSprintResponse,
} from "@/app/api/sprints/[sprint_id]/route";

const baseUrl = getBaseUrl();

export const sprintsRoutes = {
  postSprint: async () => {
    try {
      const { data } = await axios.post<PostSprintResponse>(
        `${baseUrl}/api/sprints`,
        {
          headers: getHeaders(),
        }
      );
      return data.sprint;
    } catch (error) {
      console.error(error);
    }
  },
  getSprints: async () => {
    const { data } = await axios.get<GetSprintsResponse>(
      `${baseUrl}/api/sprints`,
      {
        headers: getHeaders(),
      }
    );
    return data.sprints;
  },
  patchSprint: async ({
    sprintId,
    ...body
  }: PatchSprintBody & { sprintId: string }) => {
    const { data } = await axios.patch<PatchSprintResponse>(
      `${baseUrl}/api/sprints/${sprintId}`,
      body,
      {
        headers: getHeaders(),
      }
    );

    return data.sprint;
  },
  deleteSprint: async ({ sprintId }: { sprintId: string }) => {
    const { data } = await axios.delete<PatchSprintResponse>(
      `${baseUrl}/api/sprints/${sprintId}`,
      {
        headers: getHeaders(),
      }
    );
    return data.sprint;
  },
};
