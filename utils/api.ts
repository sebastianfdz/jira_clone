import { type GetProjectResponse } from "@/app/api/project/route";
import {
  type PostIssueBody,
  type GetIssuesResponse,
  type PostIssueResponse,
} from "@/app/api/issues/route";
import { type GetIssueDetailsResponse } from "@/app/api/issues/[issue_key]/route";
import { getBaseUrl, getHeaders } from "@/utils/helpers";
import axios from "axios";

const baseUrl = getBaseUrl();

export const api = {
  project: {
    getProject: async () => {
      const { data } = await axios.get<GetProjectResponse>(
        `${baseUrl}/api/project`
      );
      return data?.project;
    },
  },
  issues: {
    getIssues: async () => {
      const { data } = await axios.get<GetIssuesResponse>(
        `${baseUrl}/api/issues`
      );
      return data?.issues;
    },
    getIssueDetails: async ({ issue_key }: { issue_key: string }) => {
      const { data } = await axios.get<GetIssueDetailsResponse>(
        `${baseUrl}/api/issues/${issue_key}`
      );
      return data?.issue;
    },
    postIssue: async (body: PostIssueBody) => {
      const { data } = await axios.post<PostIssueResponse>(
        `${baseUrl}/api/issues`,
        body,
        {
          headers: getHeaders(),
        }
      );
      return data?.issue;
    },
  },
};
