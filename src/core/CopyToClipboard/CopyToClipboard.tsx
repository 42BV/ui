import React, { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { uniqueId } from 'lodash';
import classNames from 'classnames';
import { t } from '../../utilities/translation/translation';
import { ButtonProps, UIBasePropsWithCSSPropertiesAndChildren } from '../types';

type Text = {
  copied?: string;
};

type CopyToClipboardProps = {
  /**
   * Optionally customized text to use within the component.
   */
  text?: Text;

  buttonProps?: Omit<ButtonProps<React.ReactNode>, 'onClick' | 'icon'>;
} & Partial<UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode>>;

export function CopyToClipboard({
  id = uniqueId(),
  className,
  text,
  children,
  buttonProps,
  ...props
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  async function copyContent() {
    const foundElement = document.getElementById(id);
    if (foundElement !== null) {
      await navigator.clipboard.writeText(foundElement.innerText);
      setCopied(true);
    }
  }

  return (
    <div
      className={classNames(
        'd-flex nowrap bg-dark text-white py-1 ps-3 pe-1',
        className
      )}
      {...props}
    >
      <pre className="flex-grow-1 flex-shrink-1 me-3 mb-0" tabIndex={0}>
        <code id={id}>{children}</code>
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
      <Button
        className={classNames(
          'flex-grow-0 flex-shrink-0 text-white',
          buttonProps?.className
        )}
        color={buttonProps?.color}
        icon={'content_copy'}
        onClick={copyContent}
      />
    </div>
  );
}
