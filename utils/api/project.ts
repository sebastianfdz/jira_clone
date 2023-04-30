import { type GetProjectResponse } from "@/app/api/project/route";
import axios from "axios";
import { getBaseUrl } from "../helpers";

const baseUrl = getBaseUrl();

export const projectRoutes = {
  getProject: async () => {
    const { data } = await axios.get<GetProjectResponse>(
      `${baseUrl}/api/project`
    );
    return data?.project;
  },
};
