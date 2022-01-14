import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FileInput, { JarbFileInput, requireFile } from './FileInput';

import { FinalForm } from '../story-utils';
import { Tooltip, Icon, Card } from '../..';

storiesOf('Form/FileInput', module)
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
  .add('without label', () => {
    return (
      <Card className="m-2">
        <FileInput
          id="file-upload-with-button"
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
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbFileInput
          id="file-upload-with-button"
          name="upload"
          placeholder="Upload a file here"
          label="Upload a file here"
          accept="text/plain"
          validators={[requireFile('Profile photo')]}
          jarb={{
            validator: 'User.profile',
            label: 'Profile photo'
          }}
        />
      </FinalForm>
    );
  });
