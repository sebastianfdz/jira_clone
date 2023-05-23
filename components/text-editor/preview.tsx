"use client";
import React, { useState } from "react";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";
import { EditorComposer } from "./context/lexical-composer";
import { type EditorContentType } from "./editor";

export const EditorPreview: React.FC<{
  action: "description" | "comment";
  content: EditorContentType;
}> = ({ action, content }) => {
  const [jsonState] = useState<EditorContentType>(content);

  return (
    <EditorComposer readonly={true} jsonState={jsonState}>
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
    </EditorComposer>
  );
};
