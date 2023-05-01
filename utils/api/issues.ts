import axios from "axios";
import { getBaseUrl, getHeaders } from "../helpers";
import {
  type GetIssuesResponse,
  type PostIssueBody,
  type PostIssueResponse,
} from "@/app/api/issues/route";
import {
  type PatchIssueBody,
  type GetIssueDetailsResponse,
} from "@/app/api/issues/[issue_key]/route";

const baseUrl = getBaseUrl();

export const issuesRoutes = {
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
      { headers: getHeaders() }
    );

    return data?.issue;
  },
  patchIssue: async ({
    issue_key,
    ...body
  }: { issue_key: string } & PatchIssueBody) => {
    const { data } = await axios.patch<PostIssueResponse>(
      `${baseUrl}/api/issues/${issue_key}`,
      body,
      { headers: getHeaders() }
    );

    return data?.issue;
  },
};
