import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { pageWithContentAndExactSize } from '../../../test/utils';
import { Form, FinalForm } from '../../story-utils';
import { userUser, adminUser } from '../../../test/fixtures';
import { User } from '../../../test/types';
import TypeaheadSingle, { JarbTypeaheadSingle } from './TypeaheadSingle';
import { Tooltip, Icon } from '../../..';

storiesOf('Form|Typeahead/JarbTypeaheadSingle', module)
  .add('basic', () => {
    return (
      <Form>
        <TypeaheadSingle
          id="bestFriend"
          label="Best friend"
          placeholder="Please provide your best friend"
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('without placeholder', () => {
    return (
      <Form>
        <TypeaheadSingle
          id="bestFriend"
          label="Best friend"
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <TypeaheadSingle
          id="bestFriend"
          placeholder="Please provide your best friend"
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    return (
      <Form>
        <TypeaheadSingle
          id="bestFriend"
          label={
            <div className="d-flex justify-content-between">
              <span>Best friend</span>
              <Tooltip
                className="ml-1"
                content="Are you your best friend's best friend?"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please provide your best friend"
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbTypeaheadSingle
          id="bestFriend"
          name="bestFriend"
          label="Best friend"
          placeholder="Please provide your best friend"
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          jarb={{
            validator: 'User.bestFriend',
            label: 'Best friend'
          }}
        />
      </FinalForm>
    );
  });
