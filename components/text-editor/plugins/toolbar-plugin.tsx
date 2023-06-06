"use client";
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useCallback, useEffect, useState } from "react";
import { type LexicalEditor, type NodeKey } from "lexical";
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import { $isListNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
  $wrapNodes,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import DropDown, { DropDownItem } from "../ui/dropdown";
import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
  FiRotateCcw,
  FiRotateCw,
} from "react-icons/fi";
import {
  BsCodeSlash,
  BsQuote,
  BsTextParagraph,
  BsTypeBold,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from "react-icons/bs";
import { BiLeftIndent, BiRightIndent } from "react-icons/bi";

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ["Arial", "Arial"],
  ["Courier New", "Courier New"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "Times New Roman"],
  ["Trebuchet MS", "Trebuchet MS"],
  ["Verdana", "Verdana"],
];

const FONT_SIZE_OPTIONS: [string, string][] = [
  ["10px", "10px"],
  ["11px", "11px"],
  ["12px", "12px"],
  ["13px", "13px"],
  ["14px", "14px"],
  ["15px", "15px"],
  ["16px", "16px"],
  ["17px", "17px"],
  ["18px", "18px"],
  ["19px", "19px"],
  ["20px", "20px"],
  ["24px", "24px"],
  ["26px", "26px"],
  ["28px", "28px"],
  ["30px", "30px"],
  ["32px", "32px"],
  ["34px", "34px"],
];

function BlockFormatDropDown({
  editor,
  blockType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        )
          // eslint-disable-next-line
          $wrapNodes(selection, () => $createParagraphNode());
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          // eslint-disable-next-line
          $wrapNodes(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          // eslint-disable-next-line
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            // eslint-disable-next-line
            $wrapNodes(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropDown
      disabled={disabled}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <DropDownItem onClick={formatParagraph}>
        <BsTextParagraph className="text-sm" />
        <span>Normal</span>
      </DropDownItem>
      <DropDownItem onClick={() => formatHeading("h1")}>
        <BsTypeH1 className="text-sm" />
        <span>Heading 1</span>
      </DropDownItem>
      <DropDownItem onClick={() => formatHeading("h2")}>
        <BsTypeH2 className="text-sm" />
        <span>Heading 2</span>
      </DropDownItem>
      <DropDownItem onClick={() => formatHeading("h3")}>
        <BsTypeH3 className="text-sm" />
        <span>Heading 3</span>
      </DropDownItem>
      <DropDownItem onClick={formatQuote}>
        <BsQuote className="text-sm" />
        <span>Quote</span>
      </DropDownItem>
      <DropDownItem onClick={formatCode}>
        <BsCodeSlash className="text-sm" />
        <span>Code Block</span>
      </DropDownItem>
    </DropDown>
  );
}

function Divider(): JSX.Element {
  return <span className="block h-full w-[1px] bg-gray-600"></span>;
}

function FontDropDown({
  editor,
  value,
  style,
  disabled = false,
}: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): JSX.Element {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style]
  );

  const buttonAriaLabel =
    style === "font-family"
      ? "Formatting options for font family"
      : "Formatting options for font size";

  return (
    <DropDown
      disabled={disabled}
      buttonLabel={value}
      buttonAriaLabel={buttonAriaLabel}
    >
      <div className="z-[50] flex h-[200px] flex-col overflow-y-auto">
        {(style === "font-family"
          ? FONT_FAMILY_OPTIONS
          : FONT_SIZE_OPTIONS
        ).map(([option, text]) => (
          <DropDownItem onClick={() => handleClick(option)} key={option}>
            <span className="">{text}</span>
          </DropDownItem>
        ))}
      </div>
    </DropDown>
  );
}

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>("14px");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }

      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "14px")
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [activeEditor, editor, updateToolbar]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  return (
    <div className="relative flex items-center justify-between border-b bg-white p-2">
      <button
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title="Undo (⌘Z)"
        type="button"
        className="rounded-md p-1.5 hover:bg-gray-200"
        aria-label="Undo"
      >
        <FiRotateCcw className="text-sm" />
      </button>
      <button
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title="Redo (⌘Y)"
        type="button"
        className="rounded-md p-1.5 hover:bg-gray-200"
        aria-label="Redo"
      >
        <FiRotateCw className="text-sm" />
      </button>
      <Divider />
      {blockType in blockTypeToBlockName && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            editor={editor}
          />
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <>
          <DropDown
            disabled={!isEditable}
            buttonLabel={getLanguageFriendlyName(codeLanguage)}
            buttonAriaLabel="Select language"
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
              return (
                <DropDownItem
                  onClick={() => onCodeLanguageSelect(value)}
                  key={value}
                >
                  <span>{name}</span>
                </DropDownItem>
              );
            })}
          </DropDown>
        </>
      ) : (
        <>
          <FontDropDown
            disabled={!isEditable}
            style={"font-size"}
            value={fontSize}
            editor={editor}
          />
          <Divider />
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={"rounded-md p-1.5 " + (isBold ? "bg-gray-200" : "")}
            title="Bold (⌘B)"
            type="button"
            aria-label="Format text as bold. Shortcut: ⌘B"
          >
            <BsTypeBold className="text-base" />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={"rounded-md p-1.5 " + (isItalic ? "bg-gray-200" : "")}
            title="Italic (⌘I)"
            type="button"
            aria-label="Format text as italics. Shortcut: ⌘I"
          >
            <BsTypeItalic className="text-base" />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={"rounded-md p-1.5 " + (isUnderline ? "bg-gray-200" : "")}
            title="Underline (⌘U)"
            type="button"
            aria-label="Format text as underline. Shortcut: ⌘U"
          >
            <BsTypeUnderline className="text-base" />
          </button>
          <button
            disabled={!isEditable}
            onClick={() => {
              activeEditor.dispatchCommand(
                FORMAT_TEXT_COMMAND,
                "strikethrough"
              );
            }}
            className={
              "rounded-md p-1.5 " + (isStrikethrough ? "bg-gray-200" : "")
            }
            title="Strikethrough (⌘K)"
            type="button"
            aria-label="Format text as italics. Shortcut: ⌘K"
          >
            <BsTypeStrikethrough className="text-base" />
          </button>
        </>
      )}
      <Divider />
      <DropDown
        disabled={!isEditable}
        buttonLabel="Align"
        buttonAriaLabel="Formatting options for text alignment"
      >
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          }}
        >
          <FiAlignLeft className="text-sm" />
          <span>Left Align</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          }}
        >
          <FiAlignCenter className="text-sm" />
          <span>Center Align</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          }}
        >
          <FiAlignRight className="text-sm" />
          <span>Right Align</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
          }}
        >
          <FiAlignJustify className="text-sm" />
          <span>Justify Align</span>
        </DropDownItem>
        <Divider />
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          }}
        >
          <BiRightIndent className="text-sm" />
          <span>Outdent</span>
        </DropDownItem>
        <DropDownItem
          onClick={() => {
            activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
          }}
        >
          <BiLeftIndent className="text-sm" />
          <span>Indent</span>
        </DropDownItem>
      </DropDown>
    </div>
  );
}
