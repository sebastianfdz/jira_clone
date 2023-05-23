import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { type SerializedEditorState } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import theme from "../theme";
import { type ReactNode } from "react";
import { SharedHistoryContext } from "./shared-history";

export const EditorComposer: React.FC<{
  readonly: boolean;
  jsonState: SerializedEditorState | undefined;
  children: ReactNode;
}> = ({ jsonState, readonly, children }) => {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "Jira Clone",
        editorState: JSON.stringify(jsonState),
        editable: !readonly,
        theme: theme,
        nodes: [
          HeadingNode,
          QuoteNode,
          ListNode,
          ListItemNode,
          QuoteNode,
          CodeNode,
          CodeHighlightNode,
          TableCellNode,
          TableNode,
          TableRowNode,
        ],
        onError(error) {
          throw error;
        },
      }}
    >
      <SharedHistoryContext>{children}</SharedHistoryContext>
    </LexicalComposer>
  );
};
