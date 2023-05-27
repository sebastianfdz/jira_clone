import axios from "axios";
import { getBaseUrl, getHeaders } from "../helpers";
import {
  type PatchIssuesBody,
  type GetIssuesResponse,
  type PostIssueBody,
} from "@/app/api/issues/route";
import {
  type PatchIssueBody,
  type GetIssueDetailsResponse,
  type PatchIssueResponse,
  type PostIssueResponse,
} from "@/app/api/issues/[issue_key]/route";
import {
  type GetIssueCommentResponse,
  type GetIssueCommentsResponse,
  type PostCommentBody,
} from "@/app/api/issues/[issue_key]/comments/route";

const baseUrl = getBaseUrl();

export const issuesRoutes = {
  getIssues: async () => {
    const { data } = await axios.get<GetIssuesResponse>(
      `${baseUrl}/api/issues`
    );
    return data?.issues;
  },
  updateBatchIssues: async (body: PatchIssuesBody) => {
    console.log("body batch patch", body);
    const { data } = await axios.patch<GetIssuesResponse>(
      `${baseUrl}/api/issues`,
      body,
      { headers: getHeaders() }
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
    const { data } = await axios.patch<PatchIssueResponse>(
      `${baseUrl}/api/issues/${issue_key}`,
      body,
      { headers: getHeaders() }
    );

    return data?.issue;
  },
  deleteIssue: async ({ issue_key }: { issue_key: string }) => {
    const { data } = await axios.delete<PostIssueResponse>(
      `${baseUrl}/api/issues/${issue_key}`,
      { headers: getHeaders() }
    );

    return data?.issue;
  },
  addCommentToIssue: async (
    payload: {
      issue_key: string;
    } & PostCommentBody
  ) => {
    const { issue_key, content, authorId } = payload;
    console.log("payload", payload);
    const { data } = await axios.post<GetIssueCommentResponse>(
      `${baseUrl}/api/issues/${issue_key}/comments`,
      { content, authorId },
      { headers: getHeaders() }
    );

    return data?.comment;
  },
  getIssueComments: async ({ issue_key }: { issue_key: string }) => {
    const { data } = await axios.get<GetIssueCommentsResponse>(
      `${baseUrl}/api/issues/${issue_key}/comments`
    );

    console.log("data", data);
    return data?.comments;
  },

  updateIssueComment: async ({
    issue_key,
    content,
    commentId,
  }: {
    issue_key: string;
    commentId: string;
    content: string;
  }) => {
    const { data } = await axios.patch<GetIssueCommentResponse>(
      `${baseUrl}/api/issues/${issue_key}/comments/${commentId}`,
      { content },
      { headers: getHeaders() }
    );
    return data?.comment;
  },
};
