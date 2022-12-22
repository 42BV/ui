import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Form } from 'react-final-form';
import { Card } from 'reactstrap';

import { OpenCloseModal } from './OpenCloseModal';
import { Button } from '../Button/Button';
import { RadioGroup } from '../../form/RadioGroup/RadioGroup';
import { TotalForm } from '../../form/FormExample.stories';
import { range } from 'lodash';

export default {
  title: 'core/OpenCloseModal',

  parameters: {
    component: OpenCloseModal
  },

  excludeStories: ['ModalForm']
};

const BasicStory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [choice, setChoice] = useState<string | undefined>(undefined);

  function onSave() {
    action('save button was clicked');

    setInProgress(true);

    setTimeout(() => {
      setIsOpen(false);
      setInProgress(false);
    }, 2000);
  }

  function onClose() {
    action('modal was closed');
    setIsOpen(false);
  }

  return (
    <Card body>
      <Button onClick={() => setIsOpen(true)}>Start inquiry</Button>
      {isOpen ? (
        <OpenCloseModal
          inProgress={inProgress}
          onClose={onClose}
          onSave={onSave}
          label="What are you doing?"
        >
          <RadioGroup
            label="Activities"
            hiddenLabel={true}
            value={choice}
            onChange={(value) => setChoice(value)}
            options={[
              'Watching a movie',
              'I work at 42, the most awesome company in the world!',
              'Nothing'
            ]}
            labelForOption={(option) => option}
          />
        </OpenCloseModal>
      ) : null}
    </Card>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const StickyStory = () => {
  const [isOpenSticky, setIsOpenSticky] = useState(false);
  const [isOpenSansSticky, setIsOpenSansSticky] = useState(false);

  return (
    <Card body>
      <p>
        <Button onClick={() => setIsOpenSticky(true)}>With sticky</Button>
      </p>

      <p>
        <Button onClick={() => setIsOpenSansSticky(true)}>Sans sticky</Button>
      </p>

      {isOpenSticky ? (
        <OpenCloseModal
          stickyFooter={true}
          onSave={() => setIsOpenSticky(false)}
          onClose={() => setIsOpenSticky(false)}
          label="Sticky footer"
          size="sm"
        >
          {range(0, 10).map((number) => (
            <p key={number}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis
              modi, facilis officia provident maiores voluptate minus officiis
              tempora minima blanditiis. Distinctio rem iste omnis inventore
              ratione facere voluptates quam suscipit!
            </p>
          ))}
        </OpenCloseModal>
      ) : null}

      {isOpenSansSticky ? (
        <OpenCloseModal
          stickyFooter={false}
          onSave={() => setIsOpenSansSticky(false)}
          onClose={() => setIsOpenSansSticky(false)}
          label="No sticky footer"
          size="sm"
        >
          {range(0, 10).map((number) => (
            <p key={number}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Omnis
              modi, facilis officia provident maiores voluptate minus officiis
              tempora minima blanditiis. Distinctio rem iste omnis inventore
              ratione facere voluptates quam suscipit!
            </p>
          ))}
        </OpenCloseModal>
      ) : null}
    </Card>
  );
};

export const Sticky = {
  render: StickyStory,
  name: 'sticky'
};

const WithoutHeadingStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card body>
      <Button onClick={() => setIsOpen(true)}>Inspire me</Button>
      {isOpen ? (
        <OpenCloseModal
          onSave={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
          text={{ save: 'Yes', cancel: 'No' }}
        >
          <p>
            You have to take a break once in a while. Did you go for a walk
            outside to breathe some fresh air?
          </p>
        </OpenCloseModal>
      ) : null}
    </Card>
  );
};

export const WithoutHeading = {
  render: WithoutHeadingStory,
  name: 'without heading'
};

const WithoutButtonsStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  function onClose() {
    setIsOpen(false);
  }

  return (
    <Card body>
      <Button onClick={() => setIsOpen(true)}>What does Baymax say?</Button>
      {isOpen ? (
        <OpenCloseModal
          onClose={onClose}
          label="Your personal health companion"
        >
          <p>
            You need to wash your hands if you want to prevent getting Corona
            virus.
          </p>
        </OpenCloseModal>
      ) : null}
    </Card>
  );
};

export const WithoutButtons = {
  render: WithoutButtonsStory,
  name: 'without buttons'
};

const CustomButtonTextAndIconsStory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [choice, setChoice] = useState<
    { label: string; value: string } | undefined
  >(undefined);

  function onSave() {
    alert(`You chose to ${choice?.value} the diamond`);
    setIsOpen(false);
  }

  function onClose() {
    alert(
      `Darn! You tripped and the diamond fell in an endless hole in the ground...`
    );
    setIsOpen(false);
  }

  return (
    <Card body>
      <p>You found a box!</p>
      <Button onClick={() => setIsOpen(true)}>Check what&apos;s inside</Button>
      {isOpen ? (
        <OpenCloseModal
          onClose={onClose}
          cancelIcon="360"
          onSave={onSave}
          saveIcon="attach_money"
          modalBodyClassName="bg-warning"
          label="It's a special gift!"
          text={{
            save: 'Confirm',
            cancel: ''
          }}
        >
          <p>Inside the box you find a diamond. What do you want to do?</p>
          <RadioGroup
            label="Actions"
            hiddenLabel={true}
            value={choice}
            onChange={(value) => setChoice(value)}
            options={[
              { label: 'Sell it!', value: 'sell' },
              { label: 'Put it in my pocket', value: 'store' }
            ]}
            labelForOption={(option) => option.label}
          />
        </OpenCloseModal>
      ) : null}
    </Card>
  );
};

export const CustomButtonTextAndIcons = {
  render: CustomButtonTextAndIconsStory,
  name: 'custom button text and icons'
};

const WithFormStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  async function onSave() {
    action('save button was clicked');

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, 2000);
    });

    setIsOpen(false);
  }

  function onClose() {
    action('modal was closed');
    setIsOpen(false);
  }

  return (
    <Card body>
      <Button onClick={() => setIsOpen(true)}>Open form</Button>

      {isOpen ? (
        <Form onSubmit={onSave}>
          {(formRenderProps) => (
            <OpenCloseModal
              inProgress={formRenderProps.submitting}
              onClose={onClose}
              onSave={formRenderProps.handleSubmit}
              label="Form example"
              size="lg"
            >
              <TotalForm hasSubmit={false} formRenderProps={formRenderProps} />
            </OpenCloseModal>
          )}
        </Form>
      ) : null}

      <p className="mt-2">
        Note: the <code>Form</code> element should wrap the{' '}
        <code>OpenCloseModal</code> not the other way around. Otherwise you
        cannot use the inProgress prop, and you cannot use submit in onSave.
      </p>

      <p className="mt-2">
        Also make sure that you do not render the <code>Form</code> this way
        when you close the modal the form will be reset. Otherwise information
        will linger in the <code>Form</code> element.
      </p>

      <p className="mt-2">
        Also try to keep the modal forms limited. Sometimes it is better to just
        create a create / edit page if a form is very large.
      </p>
    </Card>
  );
};

export const WithForm = {
  render: WithFormStory,
  name: 'with form'
};
