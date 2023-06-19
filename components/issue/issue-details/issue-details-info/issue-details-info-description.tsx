import { Editor } from "@/components/text-editor/editor";
import { type SerializedEditorState } from "lexical";
import { EditorPreview } from "@/components/text-editor/preview";
import { Fragment, useState } from "react";
import { type IssueType } from "@/utils/types";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
const Description: React.FC<{ issue: IssueType }> = ({ issue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  const [content, setContent] = useState<SerializedEditorState | undefined>(
    (issue.description
      ? JSON.parse(issue.description)
      : undefined) as SerializedEditorState
  );

  function handleEdit(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    setIsEditing(true);
  }

  function handleSave(state: SerializedEditorState | undefined) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setContent(state);
    updateIssue({
      issueId: issue.id,
      description: state ? JSON.stringify(state) : undefined,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }
  return (
    <Fragment>
      <h2>Description</h2>
      <div>
        {isEditing ? (
          <Editor
            action="description"
            content={content}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div onMouseDown={handleEdit}>
            <EditorPreview
              action="description"
              content={content}
              className="transition-all duration-200 hover:bg-gray-100"
            />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export { Description };
