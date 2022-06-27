import React, { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { uniqueId } from 'lodash';
import classNames from 'classnames';
import { t } from '../../utilities/translation/translation';
import { Color } from '../types';

type Text = {
  copied?: string;
}

export type Props = {
  /**
   * Optional id for the element to be copied.
   */
  id?: string;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally customized text to use within the component.
   */
  text?: Text;

  /**
   * Optionally the color of the copy button.
   * Defaults to `primary`.
   */
  buttonColor?: Color;

  /**
   * The content that has to be copied.
   * Note that any HTML should be character encoded.
   * Any non-encoded HTML will not be visible to the user.
   * You could leverage this to stylize the content.
   */
  children: React.ReactNode;
}

export function CopyToClipboard({ id = uniqueId(), className, text, buttonColor, children }: Props) {
  const [ copied, setCopied ] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [ copied ]);

  function copyContent() {
    const foundElement = document.getElementById(id);
    if (foundElement !== null) {
      navigator.clipboard.writeText(foundElement.innerText);
      setCopied(true);
    }
  }

  return (
    <div className={classNames('d-flex nowrap bg-dark text-white py-1 ps-3 pe-1', className)}>
      <pre className="flex-grow-1 flex-shrink-1 me-3 mb-0" tabIndex={0}>
        <code id={id}>
          {children}
        </code>
      </pre>
      {copied ? (
        <div className="flex-grow-0 flex-shrink-0 me-2 text-success">
          {t({
            key: 'CopyToClipboard.COPIED',
            fallback: 'Copied!',
            overrideText: text?.copied
          })}
        </div>
      ) : null}
      <Button className="flex-grow-0 flex-shrink-0 text-white" color={buttonColor} icon="content_copy" onClick={copyContent} />
    </div>
  );
}
