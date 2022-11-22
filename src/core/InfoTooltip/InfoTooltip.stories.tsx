import React from 'react';
import { storiesOf } from '@storybook/react';

import { InfoTooltip } from './InfoTooltip';
import { Alert } from 'reactstrap';

storiesOf('core/InfoTooltip', module)
  .addParameters({ component: InfoTooltip })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p className="mb-0">
          To be able to use InfoTooltip, you have to add @tippyjs/react to your
          dependencies:
        </p>
        <code>npm install --save @tippyjs/react</code>
        <p className="mb-0 mt-2">
          You also have to add the stylesheet to your project
        </p>
        <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
      </Alert>
      <Story />
    </>
  ))
  .add('basic', () => {
    return (
      <div className="text-center">
        <InfoTooltip value="This is the content of the tooltip" />
      </div>
    );
  })
  .add('custom content', () => {
    return (
      <div className="text-center">
        <InfoTooltip
          value={
            <>
              <p>
                The tooltip can contain multiple paragraphs by using plain HTML.
              </p>
              <p>
                But it is also allowed to use custom components inside the
                tooltip. Just be careful with components with interactions as
                they might conflict with the tooltip.
              </p>
            </>
          }
        />
      </div>
    );
  })
  .add('custom size', () => {
    return (
      <div className="text-center">
        <InfoTooltip value="This icon is quite small" size={10} />
        <InfoTooltip value="This is the default size of the icon" />
        <InfoTooltip value="This icon is quite big" size={20} />
      </div>
    );
  });
