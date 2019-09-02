import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TextEditor, { JarbTextEditor } from './TextEditor';

import { Form, FinalForm } from '../story-utils';

storiesOf('Form|TextEditor', module)
  .add('basic', () => {
    return (
      <Form>
        <TextEditor
          id="description"
          label="Description"
          placeholder="Please add a description"
          onChange={value => action(`onChange: ${value}`)}
        />

        <p>
          <strong>Disclaimer:</strong> when using the TextEditor you must
          sanitize the output when rendering the output in the browser. If you
          do not do this you risk an XSS attack.
        </p>
        <p>
          The 42 way of dealing with this problem is by using{' '}
          <a href="https://jsoup.org/">jsoup</a> and to use the{' '}
          <a href="https://jsoup.org/cookbook/cleaning-html/whitelist-sanitizer">
            {' '}
            sanitizer
          </a>
          with a whitelist. The whitelist should only contain elements which the
          TextEditor generates. The sanitizer should be applied before sending
          the content to the browser.
        </p>
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbTextEditor
          id="description"
          name="description"
          label="Description"
          placeholder="Please add a description"
          jarb={{
            validator: 'Hero.description',
            label: 'Description'
          }}
        />

        <p>
          <strong>Disclaimer:</strong> when using the TextEditor you must
          sanitize the output when rendering the output in the browser. If you
          do not do this you risk an XSS attack.
        </p>
        <p>
          The 42 way of dealing with this problem is by using
          <a href="https://jsoup.org/">jsoup</a> and to use the
          <a href="https://jsoup.org/cookbook/cleaning-html/whitelist-sanitizer">
            sanitizer
          </a>
          with a whitelist. The whitelist should only contain elements which the
          TextEditor generates. The sanitizer should be applied before sending
          the content to the browser.
        </p>
      </FinalForm>
    );
  });