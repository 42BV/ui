import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { pageWithContentAndExactSize } from '../../../../test/utils';
import { Form, FinalForm } from '../../story-utils';
import { userUser, adminUser } from '../../../../test/fixtures';
import { User } from '../../../../test/types';

import TypeaheadMultiple, { JarbTypeaheadMultiple } from './TypeaheadMultiple';

storiesOf('Form|Typeahead/JarbTypeaheadMultiple', module)
  .add('basic', () => {
    return (
      <Form>
        <TypeaheadMultiple
          id="friends"
          label="Friends"
          placeholder="Please provide all your friends"
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
        <JarbTypeaheadMultiple
          id="friends"
          name="friends"
          label="Friends"
          placeholder="Please provide all your friends"
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          jarb={{
            validator: 'User.friends',
            label: 'Friends'
          }}
        />
      </FinalForm>
    );
  });
