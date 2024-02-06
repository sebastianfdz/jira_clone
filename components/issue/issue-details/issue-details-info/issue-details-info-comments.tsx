import { useIssueDetails } from "@/hooks/query-hooks/use-issue-details";
import { type UserResource } from "@clerk/types";
import { type GetIssueCommentResponse } from "@/app/api/issues/[issueId]/comments/route";
import {
  Editor,
  type EditorContentType,
} from "@/components/text-editor/editor";
import { useKeydownListener } from "@/hooks/use-keydown-listener";
import { Fragment, useRef, useState } from "react";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { useUser } from "@clerk/clerk-react";
import { type SerializedEditorState } from "lexical";
import { type IssueType } from "@/utils/types";
import { Avatar } from "@/components/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { EditorPreview } from "@/components/text-editor/preview";
import { Button } from "@/components/ui/button";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
dayjs.extend(relativeTime);

const Comments: React.FC<{ issue: IssueType }> = ({ issue }) => {
  const scrollRef = useRef(null);
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [isInViewport, ref] = useIsInViewport();
  const { comments, addComment } = useIssueDetails();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { user } = useUser();

  useKeydownListener(scrollRef, ["m", "M"], handleEdit);
  function handleEdit(ref: React.RefObject<HTMLElement>) {
    setIsWritingComment(true);
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }

  function handleSave(state: SerializedEditorState | undefined) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!state) {
      setIsWritingComment(false);
      return;
    }
    addComment({
      issueId: issue.id,
      content: JSON.stringify(state),
      // eslint-disable-next-line
      authorId: user!.id,
    });
    setIsWritingComment(false);
  }
  function handleCancel() {
    setIsWritingComment(false);
  }
  return (
    <Fragment>
      <h2>Comments</h2>
      <div className="sticky bottom-0 mb-5 w-full bg-white">
        <div ref={scrollRef} id="dummy-scroll-div" />
        {isWritingComment ? (
          <Editor
            action="comment"
            content={undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <AddComment
            user={user}
            onAddComment={() => handleEdit(scrollRef)}
            commentsInViewport={isInViewport}
          />
        )}
      </div>
      <div ref={ref} className="flex flex-col gap-y-5 pb-5">
        {comments?.map((comment) => (
          <CommentPreview key={comment.id} comment={comment} user={user} />
        ))}
      </div>
    </Fragment>
  );
};

const CommentPreview: React.FC<{
  comment: GetIssueCommentResponse["comment"];
  user: UserResource | undefined | null;
}> = ({ comment, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  const { updateComment } = useIssueDetails();

  function handleSave(state: SerializedEditorState | undefined) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    updateComment({
      issueId: comment.issueId,
      commentId: comment.id,
      content: JSON.stringify(state),
    });
    setIsEditing(false);
  }

  return (
    <div className="flex w-full gap-x-2">
      <Avatar
        src={comment.author?.avatar ?? ""}
        alt={`${comment.author?.name ?? "Guest"}`}
      />
      <div className="w-full">
        <div className="flex items-center gap-x-3 text-xs">
          <span className="font-semibold text-gray-600 ">
            {comment.author?.name}
          </span>
          <span className="text-gray-500">
            {dayjs(comment.createdAt).fromNow()}
          </span>

          <span
            data-state={comment.isEdited ? "edited" : "not-edited"}
            className="hidden text-gray-400 [&[data-state=edited]]:block"
          >
            (Edited)
          </span>
        </div>
        {isEditing ? (
          <Editor
            action="comment"
            content={
              comment.content
                ? (JSON.parse(comment.content) as EditorContentType)
                : undefined
            }
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            className="mt-2"
          />
        ) : (
          <EditorPreview
            action="comment"
            content={
              comment.content
                ? (JSON.parse(comment.content) as EditorContentType)
                : undefined
            }
          />
        )}
        {comment.authorId == user?.id ? (
          <div className="mb-1">
            <Button
              onClick={() => setIsEditing(true)}
              customColors
              className="bg-transparent text-xs font-medium text-gray-500 underline-offset-2 hover:underline"
            >
              Edit
            </Button>
            <Button
              customColors
              className="bg-transparent text-xs font-medium text-gray-500 underline-offset-2 hover:underline"
            >
              Delete
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const AddComment: React.FC<{
  onAddComment: () => void;
  user: UserResource | undefined | null;
  commentsInViewport: boolean;
}> = ({ onAddComment, user, commentsInViewport }) => {
  function handleAddComment(event: React.MouseEvent<HTMLInputElement>) {
    event.preventDefault();
    onAddComment();
  }
  return (
    <div
      data-state={commentsInViewport ? "inViewport" : "notInViewport"}
      className="flex w-full gap-x-2 border-t-2 border-transparent py-3 [&[data-state=notInViewport]]:border-gray-200"
    >
      <Avatar
        src={user?.imageUrl}
        alt={
          user ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}` : "Guest"
        }
      />
      <div className="w-full">
        <label htmlFor="add-comment" className="sr-only">
          Add Comment
        </label>
        <input
          onMouseDown={handleAddComment}
          type="text"
          id="add-comment"
          placeholder="Add a comment..."
          className="w-full rounded-[3px] border border-gray-300 px-4 py-2 placeholder:text-sm"
        />
        <p className="my-2 text-xs text-gray-500">
          <span className="font-bold">Pro tip:</span>
          <span> press </span>
          <span className="rounded-[3px] bg-gray-300 px-1 py-0.5 font-bold">
            M
          </span>
          <span> to comment </span>
        </p>
      </div>
    </div>
  );
};

export { Comments };
