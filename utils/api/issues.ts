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
} from "@/app/api/issues/[issueId]/route";
import {
  type GetIssueCommentResponse,
  type GetIssueCommentsResponse,
  type PostCommentBody,
} from "@/app/api/issues/[issueId]/comments/route";

const baseUrl = getBaseUrl();

export const issuesRoutes = {
  getIssues: async ({ signal }: { signal?: AbortSignal }) => {
    const { data } = await axios.get<GetIssuesResponse>(
      `${baseUrl}/api/issues`,
      { signal }
    );
    return data?.issues;
  },
  updateBatchIssues: async (body: PatchIssuesBody) => {
    const { data } = await axios.patch<GetIssuesResponse>(
      `${baseUrl}/api/issues`,
      body,
      { headers: getHeaders() }
    );
    return data?.issues;
  },
  getIssueDetails: async ({ issueId }: { issueId: string }) => {
    const { data } = await axios.get<GetIssueDetailsResponse>(
      `${baseUrl}/api/issues/${issueId}`
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
    issueId,
    ...body
  }: { issueId: string } & PatchIssueBody) => {
    const { data } = await axios.patch<PatchIssueResponse>(
      `${baseUrl}/api/issues/${issueId}`,
      body,

      { headers: getHeaders() }
    );

    return data?.issue;
  },
  deleteIssue: async ({ issueId }: { issueId: string }) => {
    const { data } = await axios.delete<PostIssueResponse>(
      `${baseUrl}/api/issues/${issueId}`,
      { headers: getHeaders() }
    );

    return data?.issue;
  },
  addCommentToIssue: async (
    payload: {
      issueId: string;
    } & PostCommentBody
  ) => {
    const { issueId, content, authorId } = payload;
    const { data } = await axios.post<GetIssueCommentResponse>(
      `${baseUrl}/api/issues/${issueId}/comments`,
      { content, authorId },
      { headers: getHeaders() }
    );

    return data?.comment;
  },
  getIssueComments: async ({ issueId }: { issueId: string }) => {
    const { data } = await axios.get<GetIssueCommentsResponse>(
      `${baseUrl}/api/issues/${issueId}/comments`
    );

    return data?.comments;
  },

  updateIssueComment: async ({
    issueId,
    content,
    commentId,
  }: {
    issueId: string;
    commentId: string;
    content: string;
  }) => {
    const { data } = await axios.patch<GetIssueCommentResponse>(
      `${baseUrl}/api/issues/${issueId}/comments/${commentId}`,
      { content },
      { headers: getHeaders() }
    );
    return data?.comment;
  },
};
