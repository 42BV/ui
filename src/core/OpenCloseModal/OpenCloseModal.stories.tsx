import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Form } from 'react-final-form';
import { Card } from 'reactstrap';

import { OpenCloseModal } from './OpenCloseModal';
import Button from '../Button/Button';
import RadioGroup from '../../form/RadioGroup/RadioGroup';
import { TotalForm } from '../../form/FormExample.stories';
import { range } from 'lodash';

storiesOf('core/OpenCloseModal', module)
  .add('basic', () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [choice, setChoice] = useState<string | undefined>(undefined);

    function onSave() {
      action('save button was clicked');

      setInProgress(true);

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }

    function onClose() {
      action('modal was closed');
      setIsOpen(false);
    }

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>Start inquiry</Button>
        <OpenCloseModal
          isOpen={isOpen}
          inProgress={inProgress}
          onClose={onClose}
          onSave={onSave}
          label="What are you doing?"
        >
          <RadioGroup
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
      </Card>
    );
  })
  .add('with form', ModalForm)
  .add('sticky', () => {
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

        <OpenCloseModal
          stickyFooter={true}
          isOpen={isOpenSticky}
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

        <OpenCloseModal
          stickyFooter={false}
          isOpen={isOpenSansSticky}
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
      </Card>
    );
  })
  .add('without heading', () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>Inspire me</Button>
        <OpenCloseModal
          isOpen={isOpen}
          onSave={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
          text={{ save: 'Yes', cancel: 'No' }}
        >
          <p>
            You have to take a break once in a while. Did you go for a walk
            outside to breathe some fresh air?
          </p>
        </OpenCloseModal>
      </Card>
    );
  })
  .add('without buttons', () => {
    const [isOpen, setIsOpen] = useState(false);

    function onClose() {
      setIsOpen(false);
    }

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>What does Baymax say?</Button>
        <OpenCloseModal
          isOpen={isOpen}
          onClose={onClose}
          label="Your personal health companion"
        >
          <p>
            You need to wash your hands if you want to prevent getting Corona
            virus.
          </p>
        </OpenCloseModal>
      </Card>
    );
  })
  .add('custom button text and icons', () => {
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
        <Button onClick={() => setIsOpen(true)}>
          Check what&apos;s inside
        </Button>
        <OpenCloseModal
          isOpen={isOpen}
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
            value={choice}
            onChange={(value) => setChoice(value)}
            options={[
              { label: 'Sell it!', value: 'sell' },
              { label: 'Put it in my pocket', value: 'store' }
            ]}
            labelForOption={(option) => option.label}
          />
        </OpenCloseModal>
      </Card>
    );
  });

export function ModalForm() {
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
          {({ submitting, handleSubmit }) => (
            <OpenCloseModal
              isOpen={true}
              inProgress={submitting}
              onClose={onClose}
              onSave={handleSubmit}
              label="Form example"
              size="lg"
            >
              <TotalForm hasSubmit={false} />
            </OpenCloseModal>
          )}
        </Form>
      ) : null}

      <p className="mt-2">
        Note: the <pre className="d-inline text-info">Form</pre> element should
        wrap the <pre className="d-inline text-info">OpenCloseModal</pre>
        not the other way around. Otherwise you cannot use the inProgress prop,
        and you cannot use submit in onSave.
      </p>

      <p className="mt-2">
        Also make sure that you do not render the{' '}
        <pre className="d-inline text-info">Form</pre> this way when you close
        the modal the form will be reset. Otherwise information will linger in
        the <pre className="d-inline text-info">Form</pre> element.
      </p>

      <p className="mt-2">
        Also try to keep the modal forms limited. Sometimes it is better to just
        create a create / edit page if a form is very large.
      </p>
    </Card>
  );
}
