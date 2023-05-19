import React, { Fragment, useState } from "react";
import { type EditorState, type SerializedEditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Button } from "@/components/ui/button";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/toolbar-plugin";
import theme from "./theme";
import {
  SharedHistoryContext,
  useSharedHistoryContext,
} from "./context/shared-history";

function onChange(
  state: EditorState,
  setJsonState: React.Dispatch<
    React.SetStateAction<SerializedEditorState | null>
  >
) {
  state.read(() => {
    setJsonState(state.toJSON());
  });
}

export const Editor: React.FC<{
  onSave: (state: SerializedEditorState | null) => void;
  onCancel: () => void;
  action: "description" | "comment";
}> = ({ action, onSave, onCancel }) => {
  const { historyState } = useSharedHistoryContext();
  const [jsonState, setJsonState] = useState<SerializedEditorState | null>(
    null
  );

  return (
    <Fragment>
      <div className="w-full rounded-[3px] border border-gray-200 bg-white shadow-sm">
        <LexicalComposer
          initialConfig={{
            namespace: "Jira Clone",
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
          <SharedHistoryContext>
            <ToolbarPlugin />
            <div className="relative">
              <RichTextPlugin
                ErrorBoundary={LexicalErrorBoundary}
                contentEditable={
                  <ContentEditable className="min-h-[200px] w-full resize-none overflow-hidden text-ellipsis px-2.5 py-4 outline-none" />
                }
                placeholder={
                  <div className="pointer-events-none absolute top-7 select-none px-3 text-sm text-gray-500">
                    Add your {action} here...
                  </div>
                }
              />
            </div>
            <ListPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin
              onChange={(editor) => onChange(editor, setJsonState)}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </SharedHistoryContext>
        </LexicalComposer>
      </div>
      <div className="my-3 flex gap-x-2">
        <Button
          onClick={() => onSave(jsonState)}
          customColors
          customPadding
          className="bg-inprogress px-2.5 py-1.5 text-sm font-medium text-white hover:brightness-110"
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          customColors
          customPadding
          className="px-2.5 py-1.5 text-sm font-medium hover:bg-gray-200"
        >
          Cancel
        </Button>
      </div>
    </Fragment>
  );
};
