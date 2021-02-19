import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Form } from 'react-final-form';
import { Card } from 'reactstrap';

import { Modal } from './Modal';
import Button from '../Button/Button';
import { TotalForm } from '../../form/FormExample.stories';
import { range } from 'lodash';

storiesOf('core/Modal', module)
  .add('basic', () => {
    const [isOpen, setIsOpen] = useState(false);

    function onClose() {
      action('modal was closed');
      setIsOpen(false);
    }

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>Start inquiry</Button>
        {isOpen ? (
          <Modal
            onClose={onClose}
            header="What are you doing?"
            footer={
              <Button onClick={onClose} color="secondary">
                Take a break
              </Button>
            }
          >
            You should not be working this had, go take a break!
          </Modal>
        ) : null}
      </Card>
    );
  })
  .add('without header', () => {
    const [isOpen, setIsOpen] = useState(false);

    function onClose() {
      action('modal was closed');
      setIsOpen(false);
    }

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>Start inquiry</Button>
        {isOpen ? (
          <Modal
            onClose={onClose}
            footer={
              <Button onClick={onClose} color="secondary">
                Take a break
              </Button>
            }
          >
            You should not be working this had, go take a break!
          </Modal>
        ) : null}
      </Card>
    );
  })
  .add('without footer', () => {
    const [isOpen, setIsOpen] = useState(false);

    function onClose() {
      action('modal was closed');
      setIsOpen(false);
    }

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>Start inquiry</Button>
        {isOpen ? (
          <Modal onClose={onClose} header="What are you doing?">
            You should not be working this had, go take a break!
          </Modal>
        ) : null}
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

        {isOpenSticky ? (
          <Modal
            stickyFooter={true}
            onClose={() => setIsOpenSticky(false)}
            header="Sticky footer"
            footer={
              <Button onClick={() => setIsOpenSticky(false)} color="secondary">
                Close
              </Button>
            }
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
          </Modal>
        ) : null}

        {isOpenSansSticky ? (
          <Modal
            stickyFooter={false}
            onClose={() => setIsOpenSansSticky(false)}
            header="No sticky footer"
            footer={
              <Button
                onClick={() => setIsOpenSansSticky(false)}
                color="secondary"
              >
                Close
              </Button>
            }
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
          </Modal>
        ) : null}
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
            <Modal
              onClose={onClose}
              header="Form example"
              footer={
                <Button onClick={handleSubmit} inProgress={submitting}>
                  Save
                </Button>
              }
              size="lg"
            >
              <TotalForm hasSubmit={false} />
            </Modal>
          )}
        </Form>
      ) : null}

      <p className="mt-2">
        Note: the <pre className="d-inline text-info">Form</pre> element should
        wrap the <pre className="d-inline text-info">Modal</pre> not the other
        way around. Otherwise you cannot use the submitting prop in the footer.
      </p>

      <p className="mt-2">
        Also make sure that you do not render the{' '}
        <pre className="d-inline text-info">Form</pre>
        this way when you close the modal the form will be reset. Otherwise
        information will linger in the{' '}
        <pre className="d-inline text-info">Form</pre> element.
      </p>

      <p className="mt-2">
        Also try to keep the modal forms limited. Sometimes it is better to just
        create a create / edit page if a form is very large.
      </p>
    </Card>
  );
}
