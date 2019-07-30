import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FlashMessage from '../src/FlashMessage';

import { Button } from 'reactstrap';

import {
  addInfo,
  addError,
  addWarning,
  addApocalypse,
  addSuccess
} from '@42.nl/react-flash-messages';

storiesOf('core/FlashMessage', module)
  .addParameters({ component: FlashMessage })
  .add('default', () => {
    return (
      <Fragment>
        <FlashMessage />

        <Button
          onClick={() =>
            addSuccess({
              text: 'Success',
              onClick: () => action('Success clicked')
            })
          }
        >
          Success
        </Button>

        <Button
          onClick={() =>
            addInfo({
              text: 'Info',
              onClick: () => action('Info clicked')
            })
          }
        >
          Info
        </Button>

        <Button
          onClick={() =>
            addError({
              text: 'Error',
              onClick: () => action('Error clicked')
            })
          }
        >
          Error
        </Button>

        <Button
          onClick={() =>
            addWarning({
              text: 'Warning',
              onClick: () => action('Warning clicked')
            })
          }
        >
          Warning
        </Button>

        <Button
          onClick={() =>
            addApocalypse({
              text: 'Apocalypse',
              onClick: () => action('Apocalypse clicked')
            })
          }
        >
          Apocalypse
        </Button>
      </Fragment>
    );
  });
