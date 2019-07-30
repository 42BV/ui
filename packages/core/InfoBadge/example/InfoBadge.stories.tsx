import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from 'reactstrap';
import { Icon } from '@42.nl/ui-core-icon';

import '../src/InfoBadge.scss';
import InfoBadge from '../src/InfoBadge';

storiesOf('core/InfoBadge', module)
  .addParameters({ component: InfoBadge })
  .add('default', () => {
    return (
      <div className="text-center mt-5">
        <InfoBadge value={1} color="primary">
          <Icon icon="face" />
        </InfoBadge>
        <br />
        <br />
        <InfoBadge value={5} color="success">
          <strong>Unread messages</strong>
        </InfoBadge>
        <br />
        <br />
        <InfoBadge value={25} color="warning">
          <Button color="primary">Unread messages</Button>
        </InfoBadge>
        <br />
        <br />
        <InfoBadge value={1000} color="danger">
          <Button color="success">Spam folder</Button>
        </InfoBadge>
        <br />
        <br />
        <InfoBadge value="!" color="warning">
          <Button color="danger">Self destruct</Button>
        </InfoBadge>
        <br />
        <br />
      </div>
    );
  });
