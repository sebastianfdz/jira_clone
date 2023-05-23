"use client";
import React, { useState } from "react";
import { type SerializedEditorState } from "lexical";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";
import { EditorWrapper } from "./wrapper";

export const DEFAULT_CONTENT = {
  root: {
    children: [
      {
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as SerializedEditorState;

export const EditorPreview: React.FC<{
  action: "description" | "comment";
  content?: SerializedEditorState;
}> = ({ action, content }) => {
  const [jsonState] = useState<SerializedEditorState | undefined>(
    content ? content : undefined
  );

  return (
    <EditorWrapper readonly={true} jsonState={jsonState}>
      <div className="relative w-full rounded-[3px] bg-white">
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable className="w-full resize-none overflow-hidden text-ellipsis rounded-[3px] p-1 outline-none transition-all duration-200 hover:bg-gray-100" />
          }
          placeholder={
            <div className="pointer-events-none  absolute left-0 top-0 flex h-full select-none items-center px-1 text-sm text-gray-500">
              Add your {action} here...
            </div>
          }
        />
      </div>
      <CodeHighlightPlugin />
      <ListPlugin />
    </EditorWrapper>
  );
};
