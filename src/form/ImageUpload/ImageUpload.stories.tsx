import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ImageUpload, { JarbImageUpload, requireImage } from './ImageUpload';
import { Form, FinalForm } from '../story-utils';

storiesOf('Form|ImgUpload', module)
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
          onChange={value => action(`You entered ${value}`)}
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
          onChange={value => action(`You entered ${value}`)}
        />
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
