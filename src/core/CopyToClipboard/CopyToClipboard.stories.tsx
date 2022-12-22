import React from 'react';
import { CopyToClipboard } from './CopyToClipboard';

export default {
  title: 'core/CopyToClipboard',

  parameters: {
    component: CopyToClipboard
  }
};

const MultilineStory = () => {
  return (
    <CopyToClipboard>
      <div>
        <div>The button on the right will copy this text!</div>
        <div>It is very convenient!</div>
      </div>
    </CopyToClipboard>
  );
};

export const Multiline = {
  render: MultilineStory,
  name: 'multiline'
};

const ScrollableStory = () => {
  return (
    <CopyToClipboard>
      This is a very long text that should hide behind the copy button at the
      end of the line. It should be horizontally scrollable so you should be
      able to see the entire line of text, but it should not be wrapped to
      multiple lines, it still has to be one long line of text.
    </CopyToClipboard>
  );
};

export const Scrollable = {
  render: ScrollableStory,
  name: 'scrollable'
};

const CodeStory = () => {
  return (
    <CopyToClipboard>
      &lt;div&gt;This is a div&lt;/div&gt;{'\n'}
      &lt;span&gt;You should be able to see the
      &lt;em&gt;HTML&lt;/em&gt;.&lt;/span&gt;
    </CopyToClipboard>
  );
};

export const Code = {
  render: CodeStory,
  name: 'code'
};
