import React from "react";
import clsx from "clsx";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  //   EditorState,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { mergeRegister } from "@lexical/utils";

// function onChange(state: EditorState) {
//   state.read(() => {
//     // const root = $getRoot();
//     // const selection = $getSelection();
//     // console.log(selection);
//   });
// }

import type { HistoryState } from "@lexical/react/LexicalHistoryPlugin";

import { createEmptyHistoryState } from "@lexical/react/LexicalHistoryPlugin";
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from "react-icons/bs";
import {
  TfiAlignLeft,
  TfiAlignCenter,
  TfiAlignRight,
  TfiAlignJustify,
} from "react-icons/tfi";

import { FiRotateCcw, FiRotateCw } from "react-icons/fi";

export const Editor: React.FC = () => {
  const historyState: HistoryState = createEmptyHistoryState();

  return (
    <div className="w-full rounded-sm border border-gray-200 bg-white shadow-sm">
      <LexicalComposer
        initialConfig={{
          namespace: "Jira Clone",
          onError(error) {
            throw error;
          },
        }}
      >
        <Toolbar />

        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable className="min-h-[200px] w-full resize-none overflow-hidden text-ellipsis px-2.5 py-4 outline-none" />
          }
          placeholder={
            <div className="pointer-events-none absolute left-[10px] top-[15px] select-none">
              Enter some text...
            </div>
          }
        />
        {/* <OnChangePlugin onChange={onChange} /> */}
        <HistoryPlugin externalHistoryState={historyState} />
      </LexicalComposer>
    </div>
  );
};

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [updateToolbar, editor]);

  return (
    <div className="z-20 flex h-10 w-full items-center justify-between space-x-2 px-2 py-2 shadow">
      <button
        className={clsx(
          "rounded-md p-2 transition-colors duration-100 ease-in hover:bg-gray-200",
          isBold ? "bg-gray-200" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        aria-label="Format text as bold"
      >
        <BsTypeBold className="text-base" />
      </button>
      <button
        className={clsx(
          "rounded-md p-2 transition-colors duration-100 ease-in hover:bg-gray-200",
          isStrikethrough ? "bg-gray-200" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        aria-label="Format text with a strikethrough"
      >
        <BsTypeStrikethrough className="text-base" />
      </button>
      <button
        className={clsx(
          "rounded-md p-2 transition-colors duration-100 ease-in hover:bg-gray-200",
          isItalic ? "bg-gray-200" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        aria-label="Format text as italics"
      >
        <BsTypeItalic className="text-base" />
      </button>
      <button
        className={clsx(
          "rounded-md p-2 transition-colors duration-100 ease-in hover:bg-gray-200",
          isUnderline ? "bg-gray-200" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        aria-label="Format text to underlined"
      >
        <BsTypeUnderline className="text-base" />
      </button>

      {/* <span className="block h-full w-[1px] bg-gray-600"></span> */}

      <button
        className={clsx(
          "rounded-md bg-transparent p-2 transition-colors duration-100 ease-in hover:bg-gray-200"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
      >
        <TfiAlignLeft className="text-base" />
      </button>
      <button
        className={clsx(
          "rounded-md bg-transparent p-2 transition-colors duration-100 ease-in hover:bg-gray-200"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
      >
        <TfiAlignCenter className="text-base" />
      </button>
      <button
        className={clsx(
          "rounded-md bg-transparent p-2 transition-colors duration-100 ease-in hover:bg-gray-200"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
      >
        <TfiAlignRight className="text-base" />
      </button>
      <button
        className={clsx(
          "rounded-md bg-transparent p-2 transition-colors duration-100 ease-in hover:bg-gray-200"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
      >
        <TfiAlignJustify className="text-base" />
      </button>

      {/* <span className="block h-full w-[1px] bg-gray-600"></span> */}

      <button
        className={clsx(
          "rounded-md bg-transparent p-2 transition-colors duration-100 ease-in hover:bg-gray-200"
        )}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <FiRotateCcw className="text-base" />
      </button>
      <button
        className={clsx(
          "rounded-md bg-transparent p-2 transition-colors duration-100 ease-in hover:bg-gray-200"
        )}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <FiRotateCw className="text-base" />
      </button>
    </div>
  );
};
