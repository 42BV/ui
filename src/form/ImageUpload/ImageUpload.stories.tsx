import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ImageUpload, { JarbImageUpload, requireImage } from './ImageUpload';
import { Form, FinalForm } from '../story-utils';
import { Tooltip, Icon } from '../..';
import FileInput from '../FileInput/FileInput';

storiesOf('Form/ImageUpload', module)
  .add('rect', () => {
    return (
      <Form>
        <ImageUpload
          id="image-uploader"
          label="Profile photo"
          crop={{
            type: 'rect',
            width: 500,
            height: 400
          }}
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('circle', () => {
    return (
      <Form>
        <ImageUpload
          id="image-uploader"
          label="Profile photo"
          crop={{
            type: 'circle',
            size: 250
          }}
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <ImageUpload
          id="image-uploader"
          crop={{
            type: 'rect',
            width: 500,
            height: 400
          }}
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    return (
      <Form>
        <ImageUpload
          id="image-uploader"
          label={
            <div className="d-flex justify-content-between">
              <span>Profile photo</span>
              <Tooltip
                className="ml-1"
                style={{ zIndex: 101 }}
                content="You can edit the photo after you've selected it"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          crop={{
            type: 'rect',
            width: 500,
            height: 400
          }}
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('File as initial value', () => {
    const [file, setFile] = useState<File | null>();
    return (
      <Form>
        <FileInput
          id="image-uploader"
          label="Choose an image"
          accept="image/*"
          onChange={setFile}
        />
        {file ? (
          <ImageUpload
            id="image-uploader"
            label="Profile photo"
            crop={{
              type: 'rect',
              width: 500,
              height: 400
            }}
            value={file}
            onChange={setFile}
          />
        ) : null}
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbImageUpload
          id="image-uploader"
          name="profile"
          label="Profile photo"
          validators={[requireImage('Profile photo')]}
          crop={{
            type: 'rect',
            width: 500,
            height: 400
          }}
          jarb={{
            validator: 'User.profile',
            label: 'Profile photo'
          }}
        />
      </FinalForm>
    );
  });
