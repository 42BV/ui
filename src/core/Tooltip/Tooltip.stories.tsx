import React from 'react';
import { storiesOf } from '@storybook/react';

import { Tooltip } from './Tooltip';
import { Tag } from '../Tag/Tag';
import { Alert, Button, Col, Row } from 'reactstrap';

storiesOf('core/Tooltip', module)
  .addParameters({ component: Tooltip })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p className="mb-0">To be able to use Tooltip, you have to add @tippyjs/react to your dependencies:</p>
        <code>npm install --save @tippyjs/react</code>
        <p className="mb-0 mt-2">You also have to add the stylesheet to your project</p>
        <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
      </Alert>
      <Story />
    </>
  ))
  .add('default', () => (
    <div className="d-flex flex-column">
      <Row className="my-3">
        <Col className="d-flex justify-content-around align-items-center">
          <Tooltip content="This is a tooltip">
            <Tag color="danger" text="Hover me!" />
          </Tooltip>

          <Tooltip content="Tooltip-text">
            <h5>Can be wrapped around any component</h5>
          </Tooltip>

          <Tooltip content="This is a tooltip">Plain text</Tooltip>

          <Tooltip content="Buttons work too" tag="button" className="btn btn-secondary">
            Hover this button!
          </Tooltip>
        </Col>
      </Row>
    </div>
  ))

  .add('alignment', () => (
    <>
      <span className="d-block fs-5">Alignment</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Tooltip content={'Placement bottom'} placement="bottom">
            <Tag color="danger" text="Hover me!" />
          </Tooltip>

          <Tooltip content={'Placement left'} placement="left">
            <Tag color="warning" text="Hover me!" />
          </Tooltip>
          <Tooltip content={'Placement right'} placement="right">
            <Tag color="primary" text="Hover me!" />
          </Tooltip>

          <Tooltip content={'Placement top'} placement="top">
            <Tag color="success" text="Hover me!" />
          </Tooltip>
        </Col>
      </Row>
      <hr />

      <span className="d-block fs-5">Alignment-modifier</span>
      <Row className="mt-3">
        <Col className="d-flex justify-content-around">
          <Tooltip content={'right-start'} placement="right-start">
            <Button style={{ height: 75 }}> Hover me! </Button>
          </Tooltip>

          <Tooltip content={'right'} placement="right">
            <Button style={{ height: 75 }}> Hover me! </Button>
          </Tooltip>

          <Tooltip content={'right-end'} placement="right-end">
            <Button style={{ height: 75 }}> Hover me! </Button>
          </Tooltip>
        </Col>
      </Row>
    </>
  ))

  .add('width, distance and offset', () => (
    <>
      <span className="d-block fs-5">Max width</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Tooltip
            content={<p className="text-center">You can set me to be narrow</p>}
            maxWidth={80}
          >
            <Tag color="warning" text={'Hover me!'} />
          </Tooltip>

          <Tooltip
            content={
              <p className="text-center">Or you can set me to be wide...</p>
            }
            maxWidth={500}
          >
            <Tag color="warning" text={'Hover me!'} />
          </Tooltip>
        </Col>
      </Row>

      <hr />

      <span className="d-block fs-5">Distance</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Tooltip content="far away" distance={15}>
            <Tag color="success" text="far away" />
          </Tooltip>

          <Tooltip content="default distance">
            <Tag color="success" text="default offset" />
          </Tooltip>

          <Tooltip content="very close" distance={3}>
            <Tag color="success" text="very close" />
          </Tooltip>
        </Col>
      </Row>

      <span className="d-block fs-5">Offset</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Tooltip content="far away" offset={100}>
            <Tag color="success" text="far away" />
          </Tooltip>

          <Tooltip content="default offset">
            <Tag color="success" text="default offset" />
          </Tooltip>

          <Tooltip content="very close" offset={-100}>
            <Tag color="success" text="very close" />
          </Tooltip>
        </Col>
      </Row>
    </>
  ))

  .add('components as content', () => (
    <>
      <span className="d-block fs-5">Components</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Tooltip
            interactive
            content={
              <div>
                {' '}
                I can render <b style={{ color: 'orange' }}> HTML content</b>
              </div>
            }
          >
            <p color="orange">HTML</p>
          </Tooltip>

          <Tooltip
            interactive
            content={<Button color="danger"> React components too!</Button>}
          >
            <p>React</p>
          </Tooltip>

          <Tooltip
            interactive
            placement="left"
            content={
              <Tooltip
                interactive
                placement="left"
                content={
                  <Tooltip
                    interactive
                    placement="left"
                    content={
                      <Tooltip
                        interactive
                        placement="left"
                        content={
                          <Tooltip
                            interactive
                            placement="left"
                            content={
                              <Tooltip interactive content="Pretty cool right?">
                                <p>5</p>
                              </Tooltip>
                            }
                          >
                            <p>4</p>
                          </Tooltip>
                        }
                      >
                        <p>3</p>
                      </Tooltip>
                    }
                  >
                    <p>2</p>
                  </Tooltip>
                }
              >
                <p>1</p>
              </Tooltip>
            }
          >
            <p>Tooltip-ception</p>
          </Tooltip>
        </Col>
      </Row>

      <hr />
      <span className="d-block fs-5">Interactive</span>

      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Tooltip content="You cannot click my contents">
            <Tag color="danger" text="I am not interactive" />
          </Tooltip>
          <Tooltip interactive content="You can click my content!">
            <Tag color="success" text="I am interactive!" />
          </Tooltip>
        </Col>
      </Row>
    </>
  ))

  .add('custom wrapper', () => (
    <>
      <span className="d-block fs-5">Custom wrapper</span>
      <Row className="mt-4">
        <Col className="d-flex justify-content-around">
          <Tooltip content="My children are in a <span>" tag="span">
            By default, my children get wrapped in a span
          </Tooltip>

          <Tooltip content="My children are in a <div>" tag="div">
            You can change that with the tag property
          </Tooltip>

          <Tooltip content="My children are in a <button>" tag="button" className="btn btn-primary">
            Buttons are allowed too!
          </Tooltip>
        </Col>
      </Row>
    </>
  ));
