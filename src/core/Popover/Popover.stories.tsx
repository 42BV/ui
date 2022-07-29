import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  Alert,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  ListGroup,
  ListGroupItem,
  Row
} from 'reactstrap';

import { Popover } from './Popover';
import { Tag } from '../Tag/Tag';

import { ConfirmButton } from '../ConfirmButton/ConfirmButton';
import { Button } from '../Button/Button';
import { OpenCloseModal } from '../OpenCloseModal/OpenCloseModal';

storiesOf('core/Popover', module)
  .addParameters({ component: Popover })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p className="mb-0">To be able to use Popover, you have to add @tippyjs/react and tippy.js to your dependencies:</p>
        <code>npm install --save @tippyjs/react tippy.js</code>
        <p className="mb-0 mt-2">You also have to add the stylesheet to your project</p>
        <code>@import &apos;~tippy.js/dist/tippy.css&apos;;</code>
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

          <Popover target={<Button>Hover this button!</Button>}>
            <TinyCrud />
          </Popover>
        </Col>
      </Row>
    </div>
  ))

  .add('taking control', () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="d-flex flex-column">
        <Row className="my-3">
          <Col className="d-flex justify-content-around align-items-center">
            Status: {isOpen ? 'opened' : 'closed'}
            <Popover isOpen={isOpen} target="Open">
              <TinyCrud />
            </Popover>
            <Button onClick={() => setIsOpen(!isOpen)}>Show / hide</Button>
          </Col>
          <Col>
            <p>
              Note: you can take complete controll over the Popover by using the{' '}
              <pre className="d-inline text-info">isOpen</pre> prop. Once you
              make it <pre className="d-inline text-info">true</pre> or{' '}
              <pre className="d-inline text-info">false</pre> the hover behavior
              will be disabled.
            </p>
          </Col>
        </Row>
      </div>
    );
  })

  .add('on click outside', () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="d-flex flex-column">
        <Row className="my-3">
          <Col className="d-flex justify-content-around align-items-center">
            Status: {isOpen ? 'opened' : 'closed'}
            <Popover
              isOpen={isOpen}
              onClickOutside={() => setIsOpen(false)}
              target="Open"
            >
              <NiceCard />
            </Popover>
            <Button onClick={() => setIsOpen(true)}>Show</Button>
          </Col>
          <Col>
            <p>
              Note: you can take complete controll over the Popover by using the{' '}
              <pre className="d-inline text-info">isOpen</pre> prop. Once you
              make it <pre className="d-inline text-info">true</pre> or{' '}
              <pre className="d-inline text-info">false</pre> the hover behavior
              will be disabled.
            </p>

            <p>
              In combination with{' '}
              <pre className="d-inline text-info">onClickOutside</pre> you can
              close the popover when clicked anywhere outside the popover.
            </p>
          </Col>
        </Row>
      </div>
    );
  })

  .add('alignment', () => (
    <>
      <h6>Alignment</h6>
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

      <h6>Alignment-modifier</h6>
      <Row className="mt-3">
        <Col className="d-flex justify-content-around">
          <Popover
            target={<Button> Hover me! </Button>}
            placement="right-start"
          >
            right-start
          </Popover>

          <Popover target={<Button> Hover me! </Button>} placement="right">
            right
          </Popover>

          <Popover target={<Button> Hover me! </Button>} placement="right-end">
            right-end
          </Popover>
        </Col>
      </Row>
    </>
  ))

  .add('distance and offset', () => (
    <>
      <h6>Distance</h6>
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

      <h6>Offset</h6>
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
      <h6>Custom wrapper</h6>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Popover target="My target is in a <span>">
            By default, my target is wrapped in a span
          </Popover>

          <Popover target="My target is in a <div>" tag="div">
            You can change that with the tag property
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
    <Card>
      <CardHeader>This is a nice header</CardHeader>
      <CardBody>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident
        eveniet, earum corrupti dicta quidem excepturi cupiditate consequuntur
        soluta obcaecati alias nobis eaque magnam sed et fugiat facere cumque,
        quaerat laborum!
      </CardBody>
      <CardFooter>Containing a footer</CardFooter>
    </Card>
  );
}
