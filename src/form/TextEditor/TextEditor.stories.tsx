import React, { useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TextEditor, { JarbTextEditor } from './TextEditor';

import { FinalForm, Form } from '../story-utils';
import { Icon, Tooltip } from '../..';

const disclaimer = (
  <>
    <p>
      <strong>Disclaimer:</strong> when using the TextEditor you must sanitize
      the output when rendering the output in the browser. If you do not do this
      you risk an XSS attack.
    </p>
    <p>
      The 42 way of dealing with this problem is by using{' '}
      <a href="https://jsoup.org/">jsoup</a> and to use the{' '}
      <a href="https://jsoup.org/cookbook/cleaning-html/whitelist-sanitizer">
        sanitizer
      </a>{' '}
      with a whitelist. The whitelist should only contain elements which the
      TextEditor generates. The sanitizer should be applied before sending the
      content to the browser.
    </p>
  </>
);

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
        {disclaimer}
      </Form>
    );
  })
  .add('without placeholder', () => {
    return (
      <Form>
        <TextEditor
          id="description"
          label="Description"
          onChange={value => action(`onChange: ${value}`)}
        />
        {disclaimer}
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <TextEditor
          id="description"
          placeholder="Please add a description"
          onChange={value => action(`onChange: ${value}`)}
        />
        {disclaimer}
      </Form>
    );
  })
  .add('with custom label', () => {
    return (
      <Form>
        <TextEditor
          id="description"
          label={
            <div className="d-flex justify-content-between">
              <span>Description</span>
              <Tooltip
                className="ml-1"
                content="Be sure to secure against XSS attacks"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please add a description"
          onChange={value => action(`onChange: ${value}`)}
        />
        {disclaimer}
      </Form>
    );
  })
  .add('custom toolbar', () => {
    const placeholders = [{ label: 'First name', value: 'firstName' }];

    useEffect(() => {
      /**
       * Supply the HTML content of the placeholder dropdown.
       * We need this because QuillJS shows an empty dropdown when supplying a custom dropdown list.
       */
      document
        .querySelectorAll('.ql-placeholder .ql-picker-label')
        .forEach((label: HTMLElement) => {
          if (label.innerHTML.startsWith('<span')) {
            return;
          }

          const span = document.createElement('span');
          span.className = 'd-inline-block mr-3';
          span.innerText = 'Insert placeholder';
          label.insertBefore(span, label.firstChild);
        });
      document
        .querySelectorAll('.ql-placeholder .ql-picker-item')
        .forEach((item: HTMLElement) => {
          item.textContent =
            placeholders.find(ph => ph.value === item.dataset.value)?.label ||
            item.dataset.value ||
            null;
        });
    }, [placeholders]);

    function insertPlaceholder(value: string) {
      const quill = this.quill;
      const cursorPosition = quill.getSelection().index;
      quill.insertText(cursorPosition, `[${value}]`);
      quill.setSelection({
        index: cursorPosition + value.length + 2,
        length: 0
      });
    }

    return (
      <Form>
        <TextEditor
          id="description"
          label="Description"
          placeholder="Please add a description"
          onChange={value => action(`onChange: ${value}`)}
          modules={{
            toolbar: {
              container: [
                [
                  {
                    placeholder: placeholders.map(ph => ph.value)
                  }
                ],
                [
                  {
                    size: ['small', false, 'large', 'huge']
                  },
                  'bold',
                  'italic',
                  'underline',
                  'link'
                ],
                [
                  {
                    list: 'ordered'
                  },
                  {
                    list: 'bullet'
                  }
                ],
                ['clean']
              ],
              handlers: {
                placeholder: insertPlaceholder
              }
            }
          }}
        />
        {disclaimer}
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
        {disclaimer}
      </FinalForm>
    );
  });
