"use client";
import React, { Fragment, useState } from "react";
import { type EditorState, type SerializedEditorState } from "lexical";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { Button } from "@/components/ui/button";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/toolbar-plugin";
import { useSharedHistoryContext } from "./context/shared-history";
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";
import { EditorComposer } from "./context/lexical-composer";
import clsx from "clsx";

export type EditorContentType = SerializedEditorState | undefined;

function onChange(
  state: EditorState,
  setJsonState: React.Dispatch<React.SetStateAction<EditorContentType>>
) {
  state.read(() => {
    if (state.isEmpty()) {
      setJsonState(undefined);
      return;
    }
    setJsonState(state.toJSON());
  });
}

export const Editor: React.FC<{
  action: "description" | "comment";
  content: EditorContentType;
  onSave?: (state: EditorContentType) => void;
  onCancel?: () => void;
  className?: string;
}> = ({ action, onSave, onCancel, content, className }) => {
  const { historyState } = useSharedHistoryContext();
  const [jsonState, setJsonState] = useState<EditorContentType>(content);

  return (
    <Fragment>
      <div
        className={clsx(
          "w-full rounded-[3px] border border-gray-200 bg-white shadow-sm",
          className
        )}
      >
        <EditorComposer readonly={false} jsonState={jsonState}>
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              ErrorBoundary={LexicalErrorBoundary}
              contentEditable={
                <ContentEditable className="min-h-[100px] w-full resize-none overflow-hidden text-ellipsis px-2.5 py-4 outline-none" />
              }
              placeholder={
                <div className="pointer-events-none absolute top-6 select-none px-3 text-sm text-gray-500">
                  Add your {action} here...
                </div>
              }
            />
          </div>

          <CodeHighlightPlugin />
          <ListPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin
            onChange={(editor) => onChange(editor, setJsonState)}
          />
          <HistoryPlugin externalHistoryState={historyState} />
        </EditorComposer>
      </div>
      <div className="my-3 flex gap-x-2">
        <Button
          onClick={() => onSave && onSave(jsonState)}
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
