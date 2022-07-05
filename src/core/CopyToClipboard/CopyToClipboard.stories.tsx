import { storiesOf } from '@storybook/react';
import React from 'react';
import { CopyToClipboard } from './CopyToClipboard';

storiesOf('core/CopyToClipboard', module)
  .addParameters({ component: CopyToClipboard })
  .add('multiline', () => {
    return (
      <CopyToClipboard>
        <div>
          <div>The button on the right will copy this text!</div>
          <div>It is very convenient!</div>
        </div>
      </CopyToClipboard>
    );
  })
  .add('scrollable', () => {
    return (
      <CopyToClipboard>
        This is a very long text that should hide behind the copy button at the end of the line.
        It should be horizontally scrollable so you should be able to see the entire line of text,
        but it should not be wrapped to multiple lines, it still has to be one long line of text.
      </CopyToClipboard>
    );
  })
  .add('code', () => {
    return (
      <CopyToClipboard>
        &lt;div&gt;This is a div&lt;/div&gt;{"\n"}
        &lt;span&gt;You should be able to see the &lt;em&gt;HTML&lt;/em&gt;.&lt;/span&gt;
      </CopyToClipboard>
    );
  });
