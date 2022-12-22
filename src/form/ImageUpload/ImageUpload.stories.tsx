import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import {
  FieldImageUpload,
  ImageUpload,
  JarbImageUpload,
  requireImage
} from './ImageUpload';
import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';
import { FileInput } from '../FileInput/FileInput';
import { Alert } from 'reactstrap';
import { Card } from '../../core/Card/Card';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

export default {
  title: 'Form/ImageUpload',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use ImageUpload, you have to add lodash, pica, buffer
            and react-avatar-editor to your dependencies:
          </p>
          <code>npm install --save lodash pica buffer react-avatar-editor</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: ImageUpload
  }
};

const RectStory = () => {
  return (
    <Card className="m2">
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
    </Card>
  );
};

export const Rect = {
  render: RectStory,
  name: 'rect'
};

const CircleStory = () => {
  return (
    <Card className="m2">
      <ImageUpload
        id="image-uploader"
        label="Profile photo"
        crop={{
          type: 'circle',
          size: 250
        }}
        onChange={(value) => action(`You entered ${value}`)}
      />
    </Card>
  );
};

export const Circle = {
  render: CircleStory,
  name: 'circle'
};

const InvisibleLabelStory = () => {
  return (
    <Card className="m2">
      <ImageUpload
        id="image-uploader"
        label="Profile photo"
        hiddenLabel={true}
        crop={{
          type: 'rect',
          width: 500,
          height: 400
        }}
        onChange={(value) => action(`You entered ${value}`)}
      />
    </Card>
  );
};

export const InvisibleLabel = {
  render: InvisibleLabelStory,
  name: 'invisible label'
};

const WithCustomLabelStory = () => {
  return (
    <Card className="m2">
      <ImageUpload
        id="image-uploader"
        label={
          <div className="d-flex justify-content-between">
            <span>Profile photo</span>
            <Tooltip
              className="ms-1"
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
    </Card>
  );
};

export const WithCustomLabel = {
  render: WithCustomLabelStory,
  name: 'with custom label'
};

const FileAsInitialValueStory = () => {
  const [file, setFile] = useState<File | null>();
  return (
    <Card className="m2">
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
    </Card>
  );
};

export const FileAsInitialValue = {
  render: FileAsInitialValueStory,
  name: 'File as initial value'
};

const FieldStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldImageUpload
          id="image-uploader"
          name="profile"
          label="Profile photo"
          validators={[requireImage('Profile photo')]}
          crop={{
            type: 'rect',
            width: 500,
            height: 400
          }}
        />
      </FinalForm>
    </>
  );
};

export const Field = {
  render: FieldStory,
  name: 'field'
};

const JarbStory = () => {
  return (
    <>
      <JarbFormElementDependencies />
      <FinalForm>
        <JarbImageUpload
          id="image-uploader"
          name="profile"
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
    </>
  );
};

export const Jarb = {
  render: JarbStory,
  name: 'jarb'
};
