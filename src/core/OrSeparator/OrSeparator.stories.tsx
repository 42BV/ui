import { storiesOf } from '@storybook/react';

import { OrSeparator } from './OrSeparator';

storiesOf('core/OrSeparator', module)
  .addParameters({ component: OrSeparator })
  .add('basic', () => {
    return (
      <div className="text-center">
        <p>You should do this</p>
        <OrSeparator />
        <p>something entirely different</p>
      </div>
    );
  });
