import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { pageWithContentAndExactSize } from '../../../test/utils';
import { FinalForm, Form } from '../../story-utils';
import { adminUser, userUser } from '../../../test/fixtures';
import { User } from '../../../test/types';

import TypeaheadMultiple, { JarbTypeaheadMultiple } from './TypeaheadMultiple';
import { Icon, Tooltip } from '../../..';

storiesOf('Form/Typeahead/JarbTypeaheadMultiple', module)
  .add('basic', () => {
    return (
      <Form>
        <TypeaheadMultiple
          id="friends"
          label="Friends"
          placeholder="Please provide all your friends"
          optionForValue={(user: User) => user.email}
          options={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('without placeholder', () => {
    return (
      <Form>
        <TypeaheadMultiple
          id="friends"
          label="Friends"
          optionForValue={(user: User) => user.email}
          options={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <TypeaheadMultiple
          id="friends"
          placeholder="Please provide all your friends"
          optionForValue={(user: User) => user.email}
          options={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    return (
      <Form>
        <TypeaheadMultiple
          id="friends"
          label={
            <div className="d-flex justify-content-between">
              <span>Friends</span>
              <Tooltip
                className="ml-1"
                content="It is nice to have lots of friends"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please provide all your friends"
          optionForValue={(user: User) => user.email}
          options={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbTypeaheadMultiple
          id="friends"
          name="friends"
          label="Friends"
          placeholder="Please provide all your friends"
          optionForValue={(user: User) => user.email}
          options={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          jarb={{
            validator: 'User.friends',
            label: 'Friends'
          }}
        />
      </FinalForm>
    );
  });
