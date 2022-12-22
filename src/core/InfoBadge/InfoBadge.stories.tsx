import React from 'react';
import { Button } from 'reactstrap';
import { Icon } from '../Icon';

import { InfoBadge } from './InfoBadge';

export default {
  title: 'core/InfoBadge',

  parameters: {
    component: InfoBadge
  }
};

const DefaultStory = () => {
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
      <InfoBadge value={25} color="danger">
        <Button color="primary">Unread messages</Button>
      </InfoBadge>
      <br />
      <br />
      <InfoBadge value={1000} color="secondary">
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
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};
