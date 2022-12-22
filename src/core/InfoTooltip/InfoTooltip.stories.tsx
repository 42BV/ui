import React from 'react';

import { InfoTooltip } from './InfoTooltip';
import { Alert } from 'reactstrap';

export default {
  title: 'core/InfoTooltip',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p className="mb-0">
            To be able to use InfoTooltip, you have to add @tippyjs/react to
            your dependencies:
          </p>
          <code>npm install --save @tippyjs/react</code>
          <p className="mb-0 mt-2">
            You also have to add the stylesheet to your project
          </p>
          <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: InfoTooltip
  }
};

const BasicStory = () => {
  return (
    <div className="text-center">
      <InfoTooltip tooltip="This is the content of the tooltip" />
    </div>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const CustomContentStory = () => {
  return (
    <div className="text-center">
      <InfoTooltip
        tooltip={
          <>
            <p>
              The tooltip can contain multiple paragraphs by using plain HTML.
            </p>
            <p>
              But it is also allowed to use custom components inside the
              tooltip. Just be careful with components with interactions as they
              might conflict with the tooltip.
            </p>
          </>
        }
      />
    </div>
  );
};

export const CustomContent = {
  render: CustomContentStory,
  name: 'custom content'
};

const CustomSizeStory = () => {
  return (
    <div className="text-center">
      <InfoTooltip tooltip="This icon is quite small" size={10} />
      <InfoTooltip tooltip="This is the default size of the icon" />
      <InfoTooltip tooltip="This icon is quite big" size={20} />
    </div>
  );
};

export const CustomSize = {
  render: CustomSizeStory,
  name: 'custom size'
};
