import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Card } from 'reactstrap';

import { OpenClose } from './OpenClose';
import { Button } from '../Button/Button';

storiesOf('core/OpenClose', module)
  .addParameters({ component: OpenClose })
  .add('basic', () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card body>
        <div className="d-flex align-items-center justify-content-start">
          <Button onClick={() => setIsOpen(!isOpen)} className="me-3">
            Toggle
          </Button>
          <OpenClose open={isOpen} />
        </div>
        <p>
          The collapsable element should now be {isOpen ? 'open' : 'closed'}
        </p>
      </Card>
    );
  });
