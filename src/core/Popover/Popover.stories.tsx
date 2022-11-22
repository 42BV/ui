import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Alert, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';

import { Popover } from './Popover';
import { Tag } from '../Tag/Tag';

import { ConfirmButton } from '../ConfirmButton/ConfirmButton';
import { Button } from '../Button/Button';
import { OpenCloseModal } from '../OpenCloseModal/OpenCloseModal';
import { Icon } from '../Icon';
import { Card } from '../Card/Card';

storiesOf('core/Popover', module)
  .addParameters({ component: Popover })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p className="mb-0">
          To be able to use Popover, you have to add @tippyjs/react to your
          dependencies:
        </p>
        <code>npm install --save @tippyjs/react</code>
        <p className="mb-0 mt-2">
          You also have to add the stylesheet to your project
        </p>
        <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
      </Alert>
      <Story />
    </>
  ))
  .add('default', () => (
    <div className="d-flex flex-column">
      <Row className="my-3">
        <Col className="d-flex justify-content-around align-items-center">
          <Popover target={<Tag color="danger" text="Hover me!" />}>
            <TinyCrud />
          </Popover>

          <Popover target={<h5>Can be wrapped around any component</h5>}>
            <TinyCrud />
          </Popover>

          <Popover target="Plain text">
            <NiceCard />
          </Popover>

          <Popover
            target={
              <>
                <Icon icon="map" /> Hover this icon!
              </>
            }
          >
            <TinyCrud />
          </Popover>
        </Col>
      </Row>
    </div>
  ))

  .add('taking control', () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card>
        Status: {isOpen ? 'opened' : 'closed'}
        <Popover
          isOpen={isOpen}
          target="Open"
          tag="div"
          className="text-center"
        >
          <TinyCrud />
        </Popover>
        <Button onClick={() => setIsOpen(!isOpen)}>Show / hide</Button>
        <p className="mt-4 mb-0">
          Note: you can take complete control over the Popover by using the{' '}
          <code>isOpen</code> prop. Once you make it <code>true</code> or{' '}
          <code>false</code> the hover behavior will be disabled.
        </p>
      </Card>
    );
  })

  .add('on click outside', () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card>
        Status: {isOpen ? 'opened' : 'closed'}
        <Popover
          isOpen={isOpen}
          onClickOutside={() => setIsOpen(false)}
          target="Open"
          tag="div"
          className="text-center"
        >
          <NiceCard />
        </Popover>
        <Button onClick={() => setIsOpen(true)}>Show</Button>
        <p className="mt-4">
          Note: you can take complete control over the Popover by using the{' '}
          <code>isOpen</code> prop. Once you make it <code>true</code> or{' '}
          <code>false</code> the hover behavior will be disabled.
        </p>
        <p>
          In combination with <code>onClickOutside</code> you can close the
          popover when clicked anywhere outside the popover.
        </p>
      </Card>
    );
  })

  .add('alignment', () => (
    <>
      <span className="d-block fs-5">Alignment</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Popover
            target={<Tag color="danger" text="Hover me!" />}
            placement="bottom"
          >
            Placement bottom
          </Popover>

          <Popover
            target={<Tag color="warning" text="Hover me!" />}
            placement="left"
          >
            Placement left
          </Popover>
          <Popover
            target={<Tag color="primary" text="Hover me!" />}
            placement="right"
          >
            Placement right
          </Popover>

          <Popover
            target={<Tag color="success" text="Hover me!" />}
            placement="top"
          >
            Placement top
          </Popover>
        </Col>
      </Row>
      <hr />

      <span className="d-block fs-5">Alignment-modifier</span>
      <Row className="mt-3">
        <Col className="d-flex justify-content-around">
          <Popover
            target={<div className="py-5 px-3 border"> Hover me! </div>}
            placement="right-start"
          >
            right-start
          </Popover>

          <Popover
            target={<div className="py-5 px-3 border"> Hover me! </div>}
            placement="right"
          >
            right
          </Popover>

          <Popover
            target={<div className="py-5 px-3 border"> Hover me! </div>}
            placement="right-end"
          >
            right-end
          </Popover>
        </Col>
      </Row>
    </>
  ))

  .add('distance and offset', () => (
    <>
      <span className="d-block fs-5">Distance</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Popover
            target={<Tag color="success" text="far away" />}
            distance={15}
          >
            far away
          </Popover>

          <Popover target={<Tag color="success" text="default offset" />}>
            default distance
          </Popover>

          <Popover
            target={<Tag color="success" text="very close" />}
            distance={3}
          >
            very close
          </Popover>
        </Col>
      </Row>

      <span className="d-block fs-5">Offset</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Popover
            target={<Tag color="success" text="positive offset" />}
            offset={100}
          >
            positive offset
          </Popover>

          <Popover target={<Tag color="success" text="default offset" />}>
            default offset
          </Popover>

          <Popover
            target={<Tag color="success" text="negative offset" />}
            offset={-100}
          >
            negative offset
          </Popover>
        </Col>
      </Row>
    </>
  ))

  .add('custom wrapper', () => (
    <>
      <span className="d-block fs-5">Custom wrapper</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Popover target="My target is in a <span>">
            By default, my target is wrapped in a span
          </Popover>

          <Popover target="My target is in a <div>" tag="div">
            You can change that with the tag property
          </Popover>

          <Popover
            target="My target is in a <button>"
            tag="button"
            className="btn btn-primary"
          >
            Buttons are allowed too!
          </Popover>
        </Col>
      </Row>
    </>
  ));

function TinyCrud() {
  const [open, setOpen] = useState(false);

  const persons = ['aap', 'noot', 'mies'];

  return (
    <ListGroup style={{ width: 300 }}>
      {persons.map((person) => (
        <ListGroupItem key={person}>
          <div className="d-flex justify-content-between">
            {person}

            <div>
              <Button
                icon="edit"
                className="mt-1"
                onClick={() => setOpen(true)}
              />

              <ConfirmButton
                dialogText="You sure son?"
                icon="delete"
                onConfirm={action('delete clicked')}
              />
            </div>
          </div>
        </ListGroupItem>
      ))}
      <ListGroupItem className="d-flex justify-content-center">
        <Button icon="add" className="mt-1" onClick={() => setOpen(true)}>
          Add person
        </Button>
      </ListGroupItem>

      {open ? (
        <OpenCloseModal onClose={() => setOpen(false)}>
          Form here?
        </OpenCloseModal>
      ) : null}
    </ListGroup>
  );
}

function NiceCard() {
  return (
    <Card header="This is a nice header" footer="Containing a footer">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident
      eveniet, earum corrupti dicta quidem excepturi cupiditate consequuntur
      soluta obcaecati alias nobis eaque magnam sed et fugiat facere cumque,
      quaerat laborum!
    </Card>
  );
}
