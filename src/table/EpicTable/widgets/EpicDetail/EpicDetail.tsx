import React from 'react';

import { Icon } from '../../../../core/Icon';
import { t } from '../../../../utilities/translation/translation';

type Text = {
  /**
   * The text to show next to the close button.
   */
  close?: string;
};

type Props = {
  /**
   * The details you want to render.
   */
  children: React.ReactNode;

  /**
   * The callback for the close event. Is called when the close button
   * is clicked.
   */
  onClose: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
};

/**
 * EpicDetail is a white pane with a close button which can be used
 * to render in a EpicDetailRow as its content.
 */
export function EpicDetail({ children, onClose, text = {} }: Props) {
  return (
    <div className="bg-white h-100 border-top border-right border-bottom py-1 shadow">
      <div className="d-flex align-items-center border-bottom mb-2">
        <Icon className="text-muted py-2 px-1" onClick={onClose} icon="close" />
        <span className="text-muted">
          {t({
            key: 'EpicTable.EpicDetail.CLOSE',
            fallback: 'Close',
            overrideText: text.close
          })}
        </span>
      </div>

      <div className="px-2">{children}</div>
    </div>
  );
}
