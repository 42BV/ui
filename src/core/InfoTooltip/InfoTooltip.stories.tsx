import React from 'react';
import { storiesOf } from '@storybook/react';

import { InfoTooltip } from './InfoTooltip';

storiesOf('core/InfoTooltip', module)
  .addParameters({ component: InfoTooltip })
  .add('basic', () => {
    return (
      <div className="text-center">
        <InfoTooltip tooltip="This is the content of the tooltip" />
      </div>
    );
  })
  .add('custom content', () => {
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
        <InfoTooltip tooltip="This icon is quite small" size={10} />
        <InfoTooltip tooltip="This is the default size of the icon" />
        <InfoTooltip tooltip="This icon is quite big" size={20} />
      </div>
    );
  });
