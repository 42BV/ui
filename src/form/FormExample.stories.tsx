import React from 'react';
import { storiesOf } from '@storybook/react';
import { random } from 'lodash';
import { Moment } from 'moment';

import { JarbInput } from './Input/Input';
import { FinalForm } from './story-utils';
import {
  isStrongPassword,
  JarbCheckbox,
  JarbCheckboxMultipleSelect,
  JarbColorPicker,
  JarbDateRangePicker,
  JarbRadioGroup,
  JarbDateTimeInput,
  JarbNewPasswordInput,
  JarbFileInput,
  JarbIconPicker,
  JarbImageUpload,
  JarbModalPickerMultiple,
  JarbModalPickerSingle,
  JarbSelect,
  JarbTextarea,
  JarbTextEditor,
  JarbTypeaheadMultiple,
  JarbTypeaheadSingle,
  limitFileSize,
  limitImageSize,
  requireFile,
  requireImage
} from '..';
import { pageOfUsers } from '../test/fixtures';
import { User } from '../test/types';
import { ModalForm } from '../core/OpenCloseModal/OpenCloseModal.stories';
import { AddonIcon } from './addons/AddonIcon/AddonIcon';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function required(value?: any) {
  return value ? undefined : 'Required';
}

function isLengthBelow100(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.length < 100
    ? undefined
    : 'Cannot contain more than 100 characters';
}

async function firstNameAvailable(value?: string) {
  if (!value) {
    return undefined;
  }

  await sleep(random(2000, 5000));

  return ['Maarten', 'Jeffrey'].includes(value) ? undefined : (
    <ul>
      <li>First name not available</li>
      <li>You can use Jeffrey</li>
      <li>You can use Maarten</li>
    </ul>
  );
}

async function lastNameAvailable(value?: string) {
  if (!value) {
    return undefined;
  }

  await sleep(random(100, 500));

  return ['Hus', 'van Hoven'].includes(value) ? undefined : (
    <ul>
      <li>Last name not available</li>
      <li>You can use Hus</li>
      <li>You can use van Hoven</li>
    </ul>
  );
}

const mask = [
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/
];

const validateCv = [requireFile('cv'), limitFileSize(5, 'cv')];
const validateProfile = [
  requireImage('profile photo'),
  limitImageSize(0.5, 'profile photo')
];

const requiredValidator = [required];

const firstNameValidators = [required, isLengthBelow100];
const firstNameAsyncValidators = [firstNameAvailable];

const lastNameValidators = [required, isLengthBelow100];
const lastNameAsyncValidators = [lastNameAvailable];

export function userAsOption(user: User): string {
  return user.email;
}

storiesOf('Form/Example', module)
  .add('jarb form', () => {
    return (
      <FinalForm>
        <TotalForm />
      </FinalForm>
    );
  })
  .add('jarb form in modal', ModalForm);

export function TotalForm() {
  return (
    <>
      <JarbInput
        name="firstName"
        jarb={{ validator: 'User.email', label: 'First name' }}
        id="firstName"
        label="First name"
        placeholder="Please enter your first name"
        validators={firstNameValidators}
        asyncValidators={firstNameAsyncValidators}
      />

      <JarbInput
        name="lastName"
        jarb={{ validator: 'User.lastName', label: 'Last name' }}
        id="lastName"
        label="Last name"
        placeholder="Please enter your last name"
        addon={<AddonIcon icon="face" />}
        validators={lastNameValidators}
        asyncValidators={lastNameAsyncValidators}
      />

      <JarbInput
        name="phone"
        jarb={{ validator: 'User.phone', label: 'Phone' }}
        id="phone"
        label="Phone"
        mask={mask}
        placeholder="Please enter your phone number"
        validators={requiredValidator}
      />

      <JarbFileInput
        name="cv"
        jarb={{ validator: 'User.cv', label: 'CV' }}
        validators={validateCv}
        id="cv"
        label="Upload your CV"
        placeholder="Upload a file here"
        accept="text/plain"
      />

      <JarbImageUpload
        name="profile"
        jarb={{ validator: 'User.profile', label: 'Profile photo' }}
        validators={validateProfile}
        id="profile"
        label="Profile photo"
        crop={{ type: 'circle', size: 250 }}
      />

      <JarbTextEditor
        name="description"
        jarb={{ validator: 'User.description', label: 'Description' }}
        id="description"
        label="Description"
        placeholder="Please add a description"
        validators={requiredValidator}
      />

      <JarbTextarea
        name="username"
        jarb={{ validator: 'User.username', label: 'User name' }}
        id="description"
        label="User name"
        placeholder="Please enter your user name"
        validators={requiredValidator}
      />

      <JarbNewPasswordInput
        name="password"
        jarb={{ validator: 'User.password', label: 'Password' }}
        id="password"
        label="Password"
        placeholder="Please enter your password"
        validators={[
          isStrongPassword(
            [
              'lowercase',
              'uppercase',
              'number',
              'specialChar',
              'minimumLength',
              'noSpace'
            ],
            10
          )
        ]}
      />

      <JarbDateTimeInput
        name="dateOfBirth"
        jarb={{ validator: 'User.dateOfBirth', label: 'Date of birth' }}
        id="dateOfBirth"
        label="Date of birth"
        placeholder="Please enter your date of birth"
        dateFormat="YYYY-MM-DD"
        timeFormat={false}
        isDateAllowed={(date: Moment) => {
          return date.isBefore(new Date());
        }}
        validators={requiredValidator}
      />

      <JarbDateRangePicker
        name="availability"
        jarb={{ validator: 'User.availability', label: 'Availability' }}
        from={{
          id: 'fromId',
          label: 'From Date',
          placeholder: 'Please enter a From date',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm:ss',
          isDateAllowed: (current) => current.day() !== 0 && current.day() !== 6
        }}
        to={{
          id: 'toId',
          label: 'To Date',
          placeholder: 'Please enter a To date',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm:ss',
          isDateAllowed: (current) => current.day() !== 0 && current.day() !== 6
        }}
        validators={requiredValidator}
      />

      <JarbSelect
        name="subject"
        jarb={{ validator: 'User.subject', label: 'Subject' }}
        id="subject"
        label="Subject"
        placeholder="Please enter your subject"
        optionForValue={(value) => value.label}
        isOptionEnabled={(option) => option.value !== 'awesome'}
        options={[
          { value: 'awesome', label: 'Awesome shit' },
          { value: 'super', label: 'Super shit' },
          { value: 'great', label: 'Great shit' },
          { value: 'good', label: 'good shit' }
        ]}
        validators={requiredValidator}
      />

      <JarbSelect
        name="nemesis"
        jarb={{ validator: 'User.nemesis', label: 'Nemesis' }}
        id="nemesis"
        label="Worst enemy"
        placeholder="Select your nemesis"
        optionForValue={userAsOption}
        options={() => Promise.resolve(pageOfUsers())}
        validators={requiredValidator}
      />

      <JarbRadioGroup
        name="bestFriend"
        jarb={{ validator: 'User.bestFriend', label: 'Nemesis' }}
        id="bestFriend"
        label="Best friend"
        placeholder="Select your best friend"
        optionForValue={userAsOption}
        options={() => Promise.resolve(pageOfUsers())}
        validators={requiredValidator}
      />

      <JarbTypeaheadSingle
        name="bestFriend"
        jarb={{ validator: 'User.bestFriend', label: 'Best friend' }}
        id="bestFriend"
        label="Best friend"
        optionForValue={userAsOption}
        placeholder="Please provide your best friend"
        fetchOptions={() => Promise.resolve(pageOfUsers())}
      />

      <JarbModalPickerSingle
        name="bestFriend"
        jarb={{ validator: 'User.bestFriend', label: 'Best friend' }}
        id="bestFriend"
        label="Best friend"
        placeholder="Select your best friend"
        canSearch={true}
        optionForValue={userAsOption}
        fetchOptions={() => Promise.resolve(pageOfUsers())}
        validators={requiredValidator}
      />

      <JarbTypeaheadMultiple
        name="friends"
        jarb={{ validator: 'User.friends', label: 'Friends' }}
        id="friends"
        label="Friends"
        optionForValue={userAsOption}
        placeholder="Please provide all your friends"
        fetchOptions={() => Promise.resolve(pageOfUsers())}
        validators={requiredValidator}
      />

      <JarbModalPickerMultiple
        name="friends"
        jarb={{ validator: 'User.bestFriend', label: 'Friends' }}
        id="friends"
        label="Friends"
        placeholder="Please provide all your friends"
        optionForValue={userAsOption}
        fetchOptions={() => Promise.resolve(pageOfUsers())}
        canSearch={true}
        validators={requiredValidator}
      />

      <JarbCheckboxMultipleSelect
        name="friends"
        jarb={{ validator: 'User.bestFriend', label: 'Friends' }}
        id="friends"
        label="Friends"
        placeholder="Please provide all your friends"
        optionForValue={userAsOption}
        options={() => Promise.resolve(pageOfUsers())}
        canSearch={true}
        validators={requiredValidator}
      />

      <JarbIconPicker
        name="icon"
        jarb={{ validator: 'User.icon', label: 'Icon' }}
        id="icon"
        label="Icon"
        placeholder="Please select an icon"
        validators={requiredValidator}
      />

      <JarbColorPicker
        name="color"
        jarb={{ validator: 'User.color', label: 'Color' }}
        id="color"
        label="Color"
        placeholder="Please select a Color"
        validators={requiredValidator}
      />

      <JarbCheckbox
        name="agree"
        jarb={{ validator: 'User.agree', label: 'Agree' }}
        id="agree"
        label="Agree"
        placeholder="Do you agree to the terms?"
        validators={requiredValidator}
      />
    </>
  );
}
