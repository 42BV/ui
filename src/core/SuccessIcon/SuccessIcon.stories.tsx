import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { SuccessIcon } from './SuccessIcon';

storiesOf('core/SuccessIcon', module)
  .addParameters({ component: SuccessIcon })
  .add('default', () => {
    const [value, setValue] = useState(false);
    return (
      <div className="text-center">
        <SuccessIcon onChange={() => setValue(!value)} value={value} />
      </div>
    );
  })
  .add('hover color', () => {
    const [value, setValue] = useState(false);
    return (
      <div className="text-center">
        <SuccessIcon
          onChange={() => setValue(!value)}
          value={value}
          hoverColor="danger"
        />
      </div>
    );
  });
