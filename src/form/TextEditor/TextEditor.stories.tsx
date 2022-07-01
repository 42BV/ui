import React, { useEffect, useMemo } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TextEditor, { JarbTextEditor } from './TextEditor';

import { FinalForm } from '../story-utils';
import { Icon, Tooltip, Card } from '../..';

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

storiesOf('Form/TextEditor', module)
  .add('basic', () => {
    return (
      <Card className="m-2">
        <TextEditor
          id="description"
          label="Description"
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
          onBlur={() => console.log('onblur')}
        />
        {disclaimer}
      </Card>
    );
  })
  .add('without placeholder', () => {
    return (
      <Card className="m-2">
        <TextEditor
          id="description"
          label="Description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
        {disclaimer}
      </Card>
    );
  })
  .add('without label', () => {
    return (
      <Card className="m-2">
        <TextEditor
          id="description"
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
        {disclaimer}
      </Card>
    );
  })
  .add('with custom label', () => {
    return (
      <Card className="m-2">
        <TextEditor
          id="description"
          label={
            <div className="d-flex justify-content-between">
              <span>Description</span>
              <Tooltip
                className="ms-1"
                content="Be sure to secure against XSS attacks"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
        {disclaimer}
      </Card>
    );
  })
  .add('custom toolbar', () => {
    return (
      <Card className="m-2">
        <TextEditor
          id="description"
          label="Description"
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],

              [{ header: 1 }, { header: 2 }], // custom button values
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
              [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
              [{ direction: 'rtl' }], // text direction

              [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],

              ['link', 'image', 'video'],

              ['clean']
            ]
          }}
        />

        {disclaimer}
      </Card>
    );
  })
  .add('custom toolbar option', () => {
    const placeholders = useMemo(
      () => [{ label: 'First name', value: 'firstName' }],
      []
    );

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
          span.className = 'd-inline-block me-3';
          span.innerText = 'Insert placeholder';
          label.insertBefore(span, label.firstChild);
        });
      document
        .querySelectorAll('.ql-placeholder .ql-picker-item')
        .forEach((item: HTMLElement) => {
          item.textContent =
            placeholders.find((ph) => ph.value === item.dataset.value)?.label ||
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
      <Card className="m-2">
        <TextEditor
          id="description"
          label="Description"
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
          modules={{
            toolbar: {
              container: [
                [
                  {
                    placeholder: placeholders.map((ph) => ph.value)
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
      </Card>
    );
  })
  .add('manual formats', () => {
    return (
      <Card className="m-2">
        <TextEditor
          id="description"
          label="Description"
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
          modules={{
            // This determines what is in the toolbar. But not
            // which formats are supported. Quill does this to
            // allow bold text to be pasted or entered with a
            // shortcut, but not show a toolbar button.
            toolbar: ['italic', 'underline', 'strike']
          }}
          // These are the formats which are allowed to be used.
          // When you include a format here you can paste or use
          // the shortcut to use the format. In this case we allow
          // text to be bold, but we do not include it in the toolbar.
          // This means that using the ctrl-b shortcut, or pasting bold
          // text, will result in bold text.
          formats={['bold', 'italic', 'underline', 'strike']}
        />

        <p>
          This example shows how to use the <strong>formats</strong> props. Even
          though there is no bold button in the toolbar you can still paste bold
          text or use the ctrl-b shortcut.
        </p>

        <p>
          This is achieved by not including <strong>bold</strong> in the toolbar
          but only including it in the <strong>formats</strong> prop.
        </p>

        {disclaimer}
      </Card>
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
