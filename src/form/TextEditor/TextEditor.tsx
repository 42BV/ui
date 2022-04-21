import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import classNames from 'classnames';

import { EditorState } from 'lexical';
import LexicalComposer from '@lexical/react/LexicalComposer';
import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import LexicalRichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
import LexicalPlainTextPlugin from '@lexical/react/LexicalPlainTextPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalLinkPlugin from '@lexical/react/LexicalLinkPlugin';
import LexicalListPlugin from '@lexical/react/LexicalListPlugin';
import LexicalTablePlugin from '@lexical/react/LexicalTablePlugin';
import LexicalMarkdownShortcutPlugin from '@lexical/react/LexicalMarkdownShortcutPlugin';
import LexicalCharacterLimitPlugin from '@lexical/react/LexicalCharacterLimitPlugin';
import { createLexicalComposerContext, useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { convertFromHTML, convertToHTML } from 'draft-convert';

import withJarb from '../withJarb/withJarb';
import { FieldCompatible } from '../types';
import { useId } from '../../hooks/useId/useId';

export type Props = FieldCompatible<string, string> & {
  /**
   * Optionally enable rich text editing like bold, italic, underline,
   * but also copy/paste, indent/outdent.
   *
   * Defaults to true.
   */
  richTextEnabled?: boolean;

  /**
   * Optionally enable editing history.
   *
   * Defaults to true.
   */
  historyEnabled?: boolean;

  /**
   * Optionally allow links.
   *
   * Defaults to true.
   */
  linksEnabled?: boolean;

  /**
   * Optionally allow lists.
   *
   * Defaults to true.
   */
  listsEnabled?: boolean;

  /**
   * Optionally allow creating HTML tables.
   *
   * Defaults to false.
   */
  tablesEnabled?: boolean;

  /**
   * Optionally allow usage of Markdown for markup of text, like
   * double stars for bold, hashtags for headings, etc.
   *
   * Defaults to true.
   */
  markdownEnabled?: boolean;

  characterLimit?: number;
};

/**
 * Textarea is a form element which allows the user to enter large
 * formatted text.
 *
 * Disclaimer: when using the TextEditor you must sanitize the output
 * when rendering the output in the browser. If you do not do this you
 * risk an XSS attack.
 *
 * The 42 way of dealing with this problem is by using jsoup and to use the
 * sanitizer, https://jsoup.org/cookbook/cleaning-html/whitelist-sanitizer,
 * with a whitelist. The whitelist should only contain elements which the
 * TextEditor generates. The sanitizer should be applied before sending
 * the content to the browser.
 */
export default function TextEditor(props: Props) {
  const {
    id,
    label,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    valid,
    error,
    color,
    value,
    className = '',
    richTextEnabled = true,
    historyEnabled = true,
    linksEnabled = true,
    listsEnabled = true,
    tablesEnabled = false,
    markdownEnabled = true,
    characterLimit
  } = props;

  const innerId = useId({ id });

  const classes = classNames({ 'is-invalid': valid === false });

  createLexicalComposerContext(undefined, undefined);

  const [editor] = useLexicalComposerContext();
  editor.setEditorState(convertFromHTML({})(value));

  function onEditorStateChange(state: EditorState) {
    onChange(convertToHTML(state));
  }

  return (
    <FormGroup className={className} color={color}>
      {label ? <Label for={innerId}>{label}</Label> : null}
      <LexicalComposer initialConfig={{ onError: (e) => { throw e; } }}>
        <LexicalOnChangePlugin onChange={onEditorStateChange} />
        {richTextEnabled ? (
          <LexicalRichTextPlugin contentEditable={<LexicalContentEditable className={classes} />} placeholder={<>{placeholder}</>} />
        ) : (
          <LexicalPlainTextPlugin contentEditable={<LexicalContentEditable className={classes} />} placeholder={<>{placeholder}</>} />
        )}
        {historyEnabled ? (
          <HistoryPlugin />
        ) : <></>}
        {linksEnabled ? (
          <LexicalLinkPlugin />
        ) : <></>}
        {listsEnabled ? (
          <LexicalListPlugin />
        ) : <></>}
        {tablesEnabled ? (
          <LexicalTablePlugin />
        ) : <></>}
        {markdownEnabled ? (
          <LexicalMarkdownShortcutPlugin />
        ) : <></>}
        {characterLimit ? (
          <LexicalCharacterLimitPlugin charset="UTF-8" />
        ) : <></>}
      </LexicalComposer>
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the TextEditor which can be used in a Jarb context.
 */
export const JarbTextEditor = withJarb<string, string, Props>(TextEditor);
