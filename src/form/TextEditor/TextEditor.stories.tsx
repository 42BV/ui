import React, { useMemo, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TextEditor, { JarbTextEditor } from './TextEditor';
import { EditorState, Modifier } from 'draft-js';

import { FinalForm } from '../story-utils';
import { Icon, Tooltip, Card } from '../..';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

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
          toolbar={{
            options: ['inline', 'blockType', 'list', 'link', 'image', 'remove'],
            inline: {
              inDropdown: false,
              options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'],
            },
            blockType: {
              inDropdown: true,
              options: ['Normal', 'H1', 'H2', 'Blockquote', 'Code'],
            },
            list: {
              inDropdown: false,
              options: ['unordered', 'ordered', 'indent', 'outdent'],
            },
            link: {
              inDropdown: false,
              showOpenOptionOnHover: true,
              defaultTargetOption: '_blank',
              options: ['link', 'unlink'],
            },
            image: {
              urlEnabled: true,
              uploadEnabled: true,
              alignmentEnabled: true,
              previewImage: false,
              inputAccept: 'image/jpeg,image/jpg,image/png,image/svg',
              alt: { present: false, mandatory: false },
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
            }
          }}
        />

        {disclaimer}
      </Card>
    );
  })
  .add('custom toolbar option', () => {
    const [value, setValue] = useState('');

    const placeholders = useMemo(
      () => [{ label: 'First name', value: 'firstName' }],
      []
    );

    function PlaceholderDropdown({onChange, editorState}: {onChange: (editorState: EditorState) => void; editorState: EditorState}) {
      const [isOpen, setIsOpen] = useState(false);

      function onClick(placeholder: string) {
        const contentState = Modifier.replaceText(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          placeholder,
          editorState.getCurrentInlineStyle()
        );
        onChange(EditorState.push(editorState, contentState, 'insert-characters'));
      }

      return (
        <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
          <DropdownToggle caret>
            Placeholders
          </DropdownToggle>
          <DropdownMenu>
            {placeholders.map((placeholder) => (
              <DropdownItem key={placeholder.value} onClick={() => onClick(placeholder.value)}>{placeholder.label}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      );
    }

    return (
      <Card className="m-2">
        <TextEditor
          id="description"
          label="Description"
          placeholder="Please add a description"
          value={value}
          onChange={setValue}
          // @ts-expect-error The component is cloned with the required properties, so we can ignore the error here
          toolbarCustomButtons={[<PlaceholderDropdown key="placeholder" />]}
        />
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
