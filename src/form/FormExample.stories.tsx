import React from 'react';
import { storiesOf } from '@storybook/react';
import { random } from 'lodash';
import { Moment } from 'moment';
import { Form, FormRenderProps } from 'react-final-form';

import { JarbInput } from './Input/Input';
import { provinceFetcher, resolveAfter, sleep } from './story-utils';
import {
  isStrongPassword,
  JarbCheckbox,
  JarbCheckboxMultipleSelect,
  JarbColorPicker,
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
  requireImage,
  isDateAfter,
  isDateAfterValidator,
  isDateBefore,
  isDateBeforeValidator,
  isDateBetween,
  isDateBetweenValidator,
  SubmitButton,
  PlainTextFormControl,
  InfoTooltip,
  Card
} from '..';
import { pageOfUsers } from '../test/fixtures';
import { User } from '../test/types';
import { ModalForm } from '../core/OpenCloseModal/OpenCloseModal.stories';
import { AddonIcon } from './addons/AddonIcon/AddonIcon';
import { Col, Row } from 'reactstrap';
import { action } from '@storybook/addon-actions';
import { Debug } from '../core/Debug/Debug';

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
      <Card className="m2">
        <Form
          onSubmit={() => action('form submitted')}
          render={(formRenderProps) => (
            <TotalForm hasSubmit={true} formRenderProps={formRenderProps} />
          )}
        />
      </Card>
    );
  })
  .add('jarb form in modal', ModalForm);

export function TotalForm({
  hasSubmit,
  formRenderProps
}: {
  hasSubmit: boolean;
  formRenderProps: FormRenderProps;
}) {
  const { handleSubmit, submitting, values, errors } = formRenderProps;
  return (
    <Row>
      <Col lg={6}>
        <PlainTextFormControl
          label={
            <>
              Key
              <InfoTooltip
                tooltip="The 'Key' represents a part of the entity which can only be
                created once on create but not on edit."
                className="ml-2"
              />
            </>
          }
        >
          83690c32-26af-467b-9105-cde36ef8e21c
        </PlainTextFormControl>

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
          jarb={{
            validator: 'User.dateOfBirth',
            label: 'Date of birth'
          }}
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

        <JarbDateTimeInput
          id="start"
          name="start"
          label="Start"
          placeholder="Please enter your start date and time"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          isDateAllowed={isDateBefore(values.end)}
          validators={[
            isDateBeforeValidator({
              label: 'start',
              end: {
                path: 'end',
                label: 'end'
              }
            }),
            required
          ]}
          jarb={{
            validator: 'Issue.start',
            label: 'Start date'
          }}
        />

        <JarbDateTimeInput
          id="end"
          name="end"
          label="End"
          placeholder="Please enter your end date and time"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          isDateAllowed={isDateAfter(values.start)}
          validators={[
            isDateAfterValidator({
              label: 'end',
              start: {
                path: 'start',
                label: 'start'
              }
            }),
            required
          ]}
          jarb={{
            validator: 'Issue.end',
            label: 'End date'
          }}
        />

        <JarbDateTimeInput
          id="reminder"
          name="reminder"
          label="Reminder"
          placeholder="Please select a reminder date"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          isDateAllowed={isDateBetween(values.start, values.end)}
          validators={[
            isDateBetweenValidator({
              label: 'reminder',
              start: {
                path: 'start',
                label: 'start'
              },
              end: {
                path: 'end',
                label: 'end'
              }
            }),
            required
          ]}
          jarb={{
            validator: 'Issue.reminder',
            label: 'Reminder date'
          }}
        />

        <JarbSelect
          id="province"
          name="province"
          label="Province"
          placeholder="Please select your province"
          options={provinceFetcher}
          labelForOption={(province) => province.label}
          jarb={{
            validator: 'User.province',
            label: 'Province'
          }}
          validators={requiredValidator}
        />

        <JarbSelect
          name="nemesis"
          jarb={{ validator: 'User.nemesis', label: 'Nemesis' }}
          id="nemesis"
          label="Worst enemy"
          placeholder="Select your nemesis"
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={userAsOption}
          validators={requiredValidator}
        />

        <JarbRadioGroup
          name="bestFriend"
          jarb={{ validator: 'User.bestFriend', label: 'Nemesis' }}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={userAsOption}
          validators={requiredValidator}
        />

        <JarbTypeaheadSingle
          name="bestFriend"
          jarb={{ validator: 'User.bestFriend', label: 'Best friend' }}
          id="bestFriend"
          label="Best friend"
          placeholder="Please provide your best friend"
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={userAsOption}
        />

        <JarbModalPickerSingle
          name="bestFriend"
          jarb={{ validator: 'User.bestFriend', label: 'Best friend' }}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={userAsOption}
          validators={requiredValidator}
        />

        <JarbTypeaheadMultiple
          name="friends"
          jarb={{ validator: 'User.friends', label: 'Friends' }}
          id="friends"
          label="Friends"
          placeholder="Please provide all your friends"
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={userAsOption}
          validators={requiredValidator}
        />

        <JarbModalPickerMultiple
          name="friends"
          jarb={{ validator: 'User.bestFriend', label: 'Friends' }}
          id="friends"
          label="Friends"
          placeholder="Please provide all your friends"
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={userAsOption}
          canSearch={true}
          validators={requiredValidator}
        />

        <JarbCheckboxMultipleSelect
          name="friends"
          jarb={{ validator: 'User.bestFriend', label: 'Friends' }}
          id="friends"
          label="Friends"
          placeholder="Please provide all your friends"
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={userAsOption}
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
        {hasSubmit ? (
          <div className="d-flex justify-content-end">
            <SubmitButton
              onClick={() => handleSubmit()}
              inProgress={submitting}
            >
              Submit
            </SubmitButton>
          </div>
        ) : null}
      </Col>
      <Col lg={6}>
        <h2>Values</h2>
        <Debug value={values} />
        <h2>Errors</h2>
        <Debug value={errors} />
      </Col>
    </Row>
  );
}
