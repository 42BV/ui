import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { FieldFileInput, FileInput, JarbFileInput, requireFile } from './FileInput';

import { FieldFormElementDependencies, FinalForm, JarbFormElementDependencies } from '../story-utils';
import { Alert } from 'reactstrap';
import { Card } from '../../core/Card/Card';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

storiesOf('Form/FileInput', module)
  .addParameters({ component: FileInput })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use FileInput, you have to add lodash to your dependencies:</p>
        <code>npm install --save lodash</code>
      </Alert>
      <Story />
    </>
  ))
  .add('basic', () => {
    return (
      <Card className="m-2">
        <FileInput
          id="file-upload-with-button"
          placeholder="Upload a file here"
          label="Upload a file here"
          accept="text/plain"
          onChange={() => action('value changed')}
        />
      </Card>
    );
  })
  .add('without placeholder', () => {
    return (
      <Card className="m-2">
        <FileInput
          id="file-upload-with-button"
          label="Upload a file here"
          accept="text/plain"
          onChange={() => action('value changed')}
        />
      </Card>
    );
  })
  .add('invisible label', () => {
    return (
      <Card className="m-2">
        <FileInput
          id="file-upload-with-button"
          label="Upload a file here"
          hiddenLabel={true}
          placeholder="Upload a file here"
          accept="text/plain"
          onChange={() => action('value changed')}
        />
      </Card>
    );
  })
  .add('with custom label', () => {
    return (
      <Card className="m-2">
        <FileInput
          id="file-upload-with-button"
          placeholder="Upload a file here"
          label={
            <div className="d-flex justify-content-between">
              <span>Upload a file here</span>
              <Tooltip
                className="ms-1"
                style={{ zIndex: 101 }}
                content="The file should be a plain text file"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          accept="text/plain"
          onChange={() => action('value changed')}
        />
      </Card>
    );
  })
  .add('field', () => {
    return (
      <>
        <FieldFormElementDependencies />
        <FinalForm>
          <FieldFileInput
            id="file-upload-with-button"
            name="upload"
            placeholder="Upload a file here"
            label="Upload a file here"
            accept="text/plain"
            validators={[ requireFile('Profile photo') ]}
          />
        </FinalForm>
      </>
    );
  })
  .add('jarb', () => {
    return (
      <>
        <JarbFormElementDependencies />
        <FinalForm>
          <JarbFileInput
            id="file-upload-with-button"
            name="upload"
            placeholder="Upload a file here"
            accept="text/plain"
            validators={[ requireFile('Profile photo') ]}
            jarb={{
              validator: 'User.profile',
              label: 'Profile photo'
            }}
          />
        </FinalForm>
      </>
    );
  });
