/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorThemeClasses } from "lexical";

import styles from "./theme.module.css";

const theme: EditorThemeClasses = {
  characterLimit: styles.PlaygroundEditorTheme__characterLimit,
  code: styles.PlaygroundEditorTheme__code,
  codeHighlight: {
    atrule: styles.PlaygroundEditorTheme__tokenAttr || "",
    attr: styles.PlaygroundEditorTheme__tokenAttr || "",
    boolean: styles.PlaygroundEditorTheme__tokenProperty || "",
    builtin: styles.PlaygroundEditorTheme__tokenSelector || "",
    cdata: styles.PlaygroundEditorTheme__tokenComment || "",
    char: styles.PlaygroundEditorTheme__tokenSelector || "",
    class: styles.PlaygroundEditorTheme__tokenFunction || "",
    "class-name": styles.PlaygroundEditorTheme__tokenFunction || "",
    comment: styles.PlaygroundEditorTheme__tokenComment || "",
    constant: styles.PlaygroundEditorTheme__tokenProperty || "",
    deleted: styles.PlaygroundEditorTheme__tokenProperty || "",
    doctype: styles.PlaygroundEditorTheme__tokenComment || "",
    entity: styles.PlaygroundEditorTheme__tokenOperator || "",
    function: styles.PlaygroundEditorTheme__tokenFunction || "",
    important: styles.PlaygroundEditorTheme__tokenVariable || "",
    inserted: styles.PlaygroundEditorTheme__tokenSelector || "",
    keyword: styles.PlaygroundEditorTheme__tokenAttr || "",
    namespace: styles.PlaygroundEditorTheme__tokenVariable || "",
    number: styles.PlaygroundEditorTheme__tokenProperty || "",
    operator: styles.PlaygroundEditorTheme__tokenOperator || "",
    prolog: styles.PlaygroundEditorTheme__tokenComment || "",
    property: styles.PlaygroundEditorTheme__tokenProperty || "",
    punctuation: styles.PlaygroundEditorTheme__tokenPunctuation || "",
    regex: styles.PlaygroundEditorTheme__tokenVariable || "",
    selector: styles.PlaygroundEditorTheme__tokenSelector || "",
    string: styles.PlaygroundEditorTheme__tokenSelector || "",
    symbol: styles.PlaygroundEditorTheme__tokenProperty || "",
    tag: styles.PlaygroundEditorTheme__tokenProperty || "",
    url: styles.PlaygroundEditorTheme__tokenOperator || "",
    variable: styles.PlaygroundEditorTheme__tokenVariable || "",
  },
  embedBlock: {
    base: styles.PlaygroundEditorTheme__embedBlock || "",
    focus: styles.PlaygroundEditorTheme__embedBlockFocus || "",
  },
  hashtag: styles.PlaygroundEditorTheme__hashtag || "",
  heading: {
    h1: styles.PlaygroundEditorTheme__h1 || "",
    h2: styles.PlaygroundEditorTheme__h2 || "",
    h3: styles.PlaygroundEditorTheme__h3 || "",
    h4: styles.PlaygroundEditorTheme__h4 || "",
    h5: styles.PlaygroundEditorTheme__h5 || "",
    h6: styles.PlaygroundEditorTheme__h6 || "",
  },
  image: "editor-image",
  link: styles.PlaygroundEditorTheme__link || "",
  list: {
    listitem: styles.PlaygroundEditorTheme__listItem || "",
    listitemChecked: styles.PlaygroundEditorTheme__listItemChecked || "",
    listitemUnchecked: styles.PlaygroundEditorTheme__listItemUnchecked || "",
    nested: {
      listitem: styles.PlaygroundEditorTheme__nestedListItem || "",
    },
    olDepth: [
      styles.PlaygroundEditorTheme__ol1 || "",
      styles.PlaygroundEditorTheme__ol2 || "",
      styles.PlaygroundEditorTheme__ol3 || "",
      styles.PlaygroundEditorTheme__ol4 || "",
      styles.PlaygroundEditorTheme__ol5 || "",
    ],
    ul: styles.PlaygroundEditorTheme__ul || "",
  },
  ltr: styles.PlaygroundEditorTheme__ltr || "",
  mark: styles.PlaygroundEditorTheme__mark || "",
  markOverlap: styles.PlaygroundEditorTheme__markOverlap || "",
  paragraph: styles.PlaygroundEditorTheme__paragraph || "",
  quote: styles.PlaygroundEditorTheme__quote || "",
  rtl: styles.PlaygroundEditorTheme__rtl || "",
  table: styles.PlaygroundEditorTheme__table || "",
  tableAddColumns: styles.PlaygroundEditorTheme__tableAddColumns || "",
  tableAddRows: styles.PlaygroundEditorTheme__tableAddRows || "",
  tableCell: styles.PlaygroundEditorTheme__tableCell || "",
  tableCellActionButton:
    styles.PlaygroundEditorTheme__tableCellActionButton || "",
  tableCellActionButtonContainer:
    styles.PlaygroundEditorTheme__tableCellActionButtonContainer || "",
  tableCellEditing: styles.PlaygroundEditorTheme__tableCellEditing || "",
  tableCellHeader: styles.PlaygroundEditorTheme__tableCellHeader || "",
  tableCellPrimarySelected:
    styles.PlaygroundEditorTheme__tableCellPrimarySelected || "",
  tableCellResizer: styles.PlaygroundEditorTheme__tableCellResizer || "",
  tableCellSelected: styles.PlaygroundEditorTheme__tableCellSelected || "",
  tableCellSortedIndicator:
    styles.PlaygroundEditorTheme__tableCellSortedIndicator || "",
  tableResizeRuler: styles.PlaygroundEditorTheme__tableCellResizeRuler || "",
  tableSelected: styles.PlaygroundEditorTheme__tableSelected || "",
  text: {
    bold: styles.PlaygroundEditorTheme__textBold || "",
    code: styles.PlaygroundEditorTheme__textCode || "",
    italic: styles.PlaygroundEditorTheme__textItalic || "",
    strikethrough: styles.PlaygroundEditorTheme__textStrikethrough || "",
    subscript: styles.PlaygroundEditorTheme__textSubscript || "",
    superscript: styles.PlaygroundEditorTheme__textSuperscript || "",
    underline: styles.PlaygroundEditorTheme__textUnderline || "",
    underlineStrikethrough:
      styles.PlaygroundEditorTheme__textUnderlineStrikethrough || "",
  },
};

export default theme;
