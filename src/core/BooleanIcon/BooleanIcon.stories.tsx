import React from 'react';
import { storiesOf } from '@storybook/react';

import { BooleanIcon } from './BooleanIcon';
import { action } from '@storybook/addon-actions';
import { AttributeView } from '../lists/AttributeView/AttributeView';
import { AttributeList } from '../lists/AttributeList/AttributeList';

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
      <AttributeList>
        <AttributeView label="default">
          <BooleanIcon value={true} />
          <BooleanIcon value={false} />
        </AttributeView>
        <AttributeView label="primary">
          <BooleanIcon value={true} color="primary" />
          <BooleanIcon value={false} color="primary" />
        </AttributeView>
        <AttributeView label="secondary">
          <BooleanIcon value={true} color="secondary" />
          <BooleanIcon value={false} color="secondary" />
        </AttributeView>
        <AttributeView label="success">
          <BooleanIcon value={true} color="success" />
          <BooleanIcon value={false} color="success" />
        </AttributeView>
        <AttributeView label="info">
          <BooleanIcon value={true} color="info" />
          <BooleanIcon value={false} color="info" />
        </AttributeView>
        <AttributeView label="warning">
          <BooleanIcon value={true} color="warning" />
          <BooleanIcon value={false} color="warning" />
        </AttributeView>
        <AttributeView label="danger">
          <BooleanIcon value={true} color="danger" />
          <BooleanIcon value={false} color="danger" />
        </AttributeView>
        <AttributeView label="link">
          <BooleanIcon value={true} color="link" />
          <BooleanIcon value={false} color="link" />
        </AttributeView>
        <AttributeView label="muted">
          <BooleanIcon value={true} color="muted" />
          <BooleanIcon value={false} color="muted" />
        </AttributeView>
        <AttributeView label="dark">
          <BooleanIcon value={true} color="dark" />
          <BooleanIcon value={false} color="dark" />
        </AttributeView>
        <AttributeView label="light" className="bg-dark">
          <BooleanIcon value={true} color="light" />
          <BooleanIcon value={false} color="light" />
        </AttributeView>
      </AttributeList>
    )
      ;
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
