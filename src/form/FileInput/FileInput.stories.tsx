import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FileInput, { JarbFileInput, requireFile } from './FileInput';

import { Form, FinalForm } from '../story-utils';

storiesOf('Form|FileInput', module)
  .add('basic', () => {
    return (
      <Form>
        <FileInput
          id="file-upload-with-button"
          placeholder="Upload a file here"
          label="Upload a file here"
          accept="text/plain"
          onChange={() => action('value changed')}
        />
      </Form>
    );
  })
  .add('without placeholder', () => {
    return (
      <Form>
        <FileInput
          id="file-upload-with-button"
          label="Upload a file here"
          accept="text/plain"
          onChange={() => action('value changed')}
        />
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <FileInput
          id="file-upload-with-button"
          placeholder="Upload a file here"
          accept="text/plain"
          onChange={() => action('value changed')}
        />
      </Form>
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
