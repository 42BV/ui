import React, { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { Editor, Toolbar, ToolbarCustomButtons } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import classNames from 'classnames';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import withJarb from '../withJarb/withJarb';
import { FieldCompatible } from '../types';
import { useId } from '../../hooks/useId/useId';

export type Props = FieldCompatible<string, string> & {
  /**
   * Optional configuration to determine which toolbar options are
   * allowed.
   *
   * @see https://jpuri.github.io/react-draft-wysiwyg/#/docs
   */
  toolbar?: Toolbar;

  /**
   * Optional configuration to add custom toolbar options.
   *
   * @see https://jpuri.github.io/react-draft-wysiwyg/#/docs
   */
  toolbarCustomButtons?: ToolbarCustomButtons;

  /**
   * Optional configuration to determine which language the editor
   * should use.
   * Defaults to English.
   */
  locale?: 'en' | 'fr' | 'zh' | 'ru' | 'pt' | 'ko' | 'it' | 'nl' | 'de' | 'da' | 'zh_tw' | 'pl' | 'es';
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
    value = '',
    className = '',
    toolbar,
    toolbarCustomButtons,
    locale = 'en'
  } = props;

  const innerId = useId({ id });

  const classes = classNames({ 'is-invalid': valid === false });

  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromHTML({})(value)));

  function onEditorStateChange(state: EditorState) {
    setEditorState(state);
    onChange(convertToHTML(state.getCurrentContent()));
  }

  return (
    <FormGroup className={className} color={color}>
      {label ? <Label for={innerId}>{label}</Label> : null}
      <Editor
        editorState={editorState}
        editorClassName={classes}
        onEditorStateChange={onEditorStateChange}
        localization={{
          locale
        }}
        toolbar={toolbar}
        toolbarCustomButtons={toolbarCustomButtons}
        id={innerId}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the TextEditor which can be used in a Jarb context.
 */
export const JarbTextEditor = withJarb<string, string, Props>(TextEditor);
