import React, { useState } from 'react';
import { Card } from 'reactstrap';

import { OpenClose } from './OpenClose';
import { Button } from '../Button/Button';

export default {
  title: 'core/OpenClose',

  parameters: {
    component: OpenClose
  }
};

const BasicStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card body>
      <div className="d-flex align-items-center justify-content-start">
        <Button onClick={() => setIsOpen(!isOpen)} className="me-3">
          Toggle
        </Button>
        <OpenClose open={isOpen} />
      </div>
      <p>The collapsable element should now be {isOpen ? 'open' : 'closed'}</p>
    </Card>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};
