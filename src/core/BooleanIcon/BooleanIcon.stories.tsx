import React from 'react';
import { storiesOf } from '@storybook/react';

import { BooleanIcon } from './BooleanIcon';
import { action } from '@storybook/addon-actions';

storiesOf('core/BooleanIcon', module)
  .addParameters({ component: BooleanIcon })
  .add('basic', () => {
    return (
      <div className="text-center align-middle">
        true <BooleanIcon value={true} />
        <br />
        false <BooleanIcon value={false} />
      </div>
    );
  })
  .add('size', () => {
    return (
      <div className="text-center align-middle">
        small <BooleanIcon value={true} size={10} />{' '}
        <BooleanIcon value={false} size={10} />
        <br />
        default <BooleanIcon value={true} /> <BooleanIcon value={false} />
        <br />
        big <BooleanIcon value={true} size={30} />{' '}
        <BooleanIcon value={false} size={30} />
      </div>
    );
  })
  .add('color', () => {
    return (
      <div className="text-center align-middle">
        default
        <BooleanIcon value={true} />
        <BooleanIcon value={false} />
        <br />
        primary
        <BooleanIcon value={true} color="primary" />
        <BooleanIcon value={false} color="primary" />
        <br />
        secondary
        <BooleanIcon value={true} color="secondary" />
        <BooleanIcon value={false} color="secondary" />
        <br />
        success
        <BooleanIcon value={true} color="success" />
        <BooleanIcon value={false} color="success" />
        <br />
        info
        <BooleanIcon value={true} color="info" />
        <BooleanIcon value={false} color="info" />
        <br />
        warning
        <BooleanIcon value={true} color="warning" />
        <BooleanIcon value={false} color="warning" />
        <br />
        danger
        <BooleanIcon value={true} color="danger" />
        <BooleanIcon value={false} color="danger" />
        <br />
        link
        <BooleanIcon value={true} color="link" />
        <BooleanIcon value={false} color="link" />
        <br />
        muted
        <BooleanIcon value={true} color="muted" />
        <BooleanIcon value={false} color="muted" />
        <br />
        dark
        <BooleanIcon value={true} color="dark" />
        <BooleanIcon value={false} color="dark" />
        <br />
        light
        <BooleanIcon value={true} color="light" />
        <BooleanIcon value={false} color="light" />
      </div>
    );
  })
  .add('hover color', () => {
      return (
        <div className="text-center align-middle">
            true <BooleanIcon value={true} hoverColor="primary" onChange={action('active icon clicked')} />
            <br />
            false <BooleanIcon value={false} hoverColor="primary" onChange={action('inactive icon clicked')} />
        </div>
      );
  });
