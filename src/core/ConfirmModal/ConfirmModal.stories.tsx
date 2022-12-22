import { ConfirmModal } from './ConfirmModal';
import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import { Card } from '../Card/Card';

const disclaimer = (
  <>
    <p className="mt-3">
      <strong>Note:</strong> In most cases, you&apos;ll want to use the{' '}
      <code>ConfirmButton</code> component instead. ConfirmButton offers an
      easy-to-use button that triggers this dialog.
    </p>
    <p>
      When it is not possible to trigger the action through a button, such as
      when using a ButtonDropdown, you can use this component directly instead.
    </p>
  </>
);

export default {
  title: 'core/ConfirmModal',

  parameters: {
    component: ConfirmModal
  }
};

const InDropdownStory = () => {
  const [isDropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  return (
    <Card>
      {isConfirmModalOpen ? (
        <ConfirmModal
          onClose={() => setConfirmModalOpen(false)}
          onSave={() => {
            setConfirmModalOpen(false);
            action('confirm clicked')();
          }}
          modalText="Are you sure to delete this user? This operation cannot be undone!"
        />
      ) : null}
      <ButtonDropdown
        isOpen={isDropdownMenuOpen}
        toggle={() => setDropdownMenuOpen(!isDropdownMenuOpen)}
      >
        <DropdownToggle caret>Actions</DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => setConfirmModalOpen(true)}>
            Delete user
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>

      {disclaimer}
    </Card>
  );
};

export const InDropdown = {
  render: InDropdownStory,
  name: 'in dropdown'
};

const WithCustomTextStory = () => {
  const [isDropdownMenuOpen, setDropdownMenuOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  return (
    <Card>
      {isConfirmModalOpen ? (
        <ConfirmModal
          onClose={() => setConfirmModalOpen(false)}
          onSave={() => {
            setConfirmModalOpen(false);
            action('Confirm clicked')();
          }}
          label="PLEASE SAY YES"
          modalText={
            <p>
              Are you sure you want to <strong>delete</strong> all users?
            </p>
          }
          confirmText="YES"
          cancelText="NO"
        />
      ) : null}
      <ButtonDropdown
        isOpen={isDropdownMenuOpen}
        toggle={() => setDropdownMenuOpen(!isDropdownMenuOpen)}
      >
        <DropdownToggle caret>Actions - custom text</DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => setConfirmModalOpen(true)}>
            Delete all users
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>

      {disclaimer}
    </Card>
  );
};

export const WithCustomText = {
  render: WithCustomTextStory,
  name: 'with custom text'
};
