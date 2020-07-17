import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Row, Col } from 'reactstrap';

import Button from './Button';

storiesOf('core|buttons/Button', module)
  .addParameters({ component: Button })
  .add('default', () => {
    return (
      <Row>
        <Col xs={12}>
          <h4>Button</h4>
          <Button onClick={action('Button clicked')} color="primary">
            primary
          </Button>
          <Button onClick={action('Button clicked')} color="secondary">
            secondary
          </Button>
          <Button onClick={action('Button clicked')} color="success">
            success
          </Button>
          <Button onClick={action('Button clicked')} color="info">
            info
          </Button>
          <Button onClick={action('Button clicked')} color="warning">
            warning
          </Button>
          <Button onClick={action('Button clicked')} color="danger">
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button in progress</h4>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="primary"
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="success"
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="info"
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="warning"
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="danger"
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button disabled</h4>
          <Button
            onClick={action('Button clicked')}
            color="primary"
            disabled={true}
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            color="secondary"
            disabled={true}
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            color="success"
            disabled={true}
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            color="info"
            disabled={true}
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            color="warning"
            disabled={true}
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            color="danger"
            disabled={true}
          >
            danger
          </Button>
          <hr />
        </Col>
      </Row>
    );
  })
  .add('sizes', () => {
    return (
      <Row>
        <Col xs={12}>
          <h4>Button</h4>
          <Button onClick={action('Button clicked')} color="primary" size="sm">
            sm
          </Button>
          <Button
            onClick={action('Button clicked')}
            color="secondary"
            size="md"
          >
            md
          </Button>
          <Button onClick={action('Button clicked')} color="success" size="lg">
            lg
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button in progress</h4>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="primary"
            size="sm"
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="secondary"
            size="md"
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="success"
            size="lg"
          >
            success
          </Button>

          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button disabled</h4>
          <Button
            onClick={action('Button clicked')}
            color="primary"
            disabled={true}
            size="sm"
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            color="secondary"
            disabled={true}
            size="md"
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            color="success"
            disabled={true}
            size="lg"
          >
            success
          </Button>

          <hr />
        </Col>
      </Row>
    );
  })
  .add('as button with icon', () => {
    return (
      <Row>
        <Col xs={12}>
          <h4>Button with icon</h4>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="primary"
          >
            primary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="success"
          >
            success
          </Button>
          <Button icon="save" onClick={action('Button clicked')} color="info">
            info
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="warning"
          >
            warning
          </Button>
          <Button icon="save" onClick={action('Button clicked')} color="danger">
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button with icon right</h4>
          <Button
            icon="save"
            iconPosition="right"
            onClick={action('Button clicked')}
            color="primary"
          >
            primary
          </Button>
          <Button
            icon="save"
            iconPosition="right"
            onClick={action('Button clicked')}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            icon="save"
            iconPosition="right"
            onClick={action('Button clicked')}
            color="success"
          >
            success
          </Button>
          <Button
            icon="save"
            iconPosition="right"
            onClick={action('Button clicked')}
            color="info"
          >
            info
          </Button>
          <Button
            icon="save"
            iconPosition="right"
            onClick={action('Button clicked')}
            color="warning"
          >
            warning
          </Button>
          <Button
            icon="save"
            iconPosition="right"
            onClick={action('Button clicked')}
            color="danger"
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button with icon in progress</h4>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            inProgress={true}
            color="primary"
          >
            primary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            inProgress={true}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            inProgress={true}
            color="success"
          >
            success
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            inProgress={true}
            color="info"
          >
            info
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            inProgress={true}
            color="warning"
          >
            warning
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            inProgress={true}
            color="danger"
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button with icon disabled</h4>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="primary"
            disabled={true}
          >
            primary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="secondary"
            disabled={true}
          >
            secondary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="success"
            disabled={true}
          >
            success
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="info"
            disabled={true}
          >
            info
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="warning"
            disabled={true}
          >
            warning
          </Button>
          <Button icon="save" onClick={action('Button clicked')} color="danger">
            danger
          </Button>
          <hr />
        </Col>
      </Row>
    );
  })
  .add('icon size', () => {
    return (
      <Row>
        <Col xs={12}>
          <h4>Button with small icon</h4>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="primary"
            iconSize={10}
          >
            primary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="secondary"
            iconSize={10}
          >
            secondary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="success"
            iconSize={10}
          >
            success
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="info"
            iconSize={10}
          >
            info
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="warning"
            iconSize={10}
          >
            warning
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="danger"
            iconSize={10}
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button with default icon</h4>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="primary"
          >
            primary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="success"
          >
            success
          </Button>
          <Button icon="save" onClick={action('Button clicked')} color="info">
            info
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="warning"
          >
            warning
          </Button>
          <Button icon="save" onClick={action('Button clicked')} color="danger">
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button with large icon</h4>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="primary"
            iconSize={30}
          >
            primary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="secondary"
            iconSize={30}
          >
            secondary
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="success"
            iconSize={30}
          >
            success
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="info"
            iconSize={30}
          >
            info
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="warning"
            iconSize={30}
          >
            warning
          </Button>
          <Button
            icon="save"
            onClick={action('Button clicked')}
            color="danger"
            iconSize={30}
          >
            danger
          </Button>
          <hr />
        </Col>
      </Row>
    );
  })
  .add('as outline', () => {
    return (
      <Row>
        <Col xs={12}>
          <h4>Outline</h4>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="primary"
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="success"
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="info"
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="warning"
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="danger"
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Outline in progress</h4>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            inProgress={true}
            color="primary"
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            inProgress={true}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            inProgress={true}
            color="success"
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            inProgress={true}
            color="info"
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            inProgress={true}
            color="warning"
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            inProgress={true}
            color="danger"
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Outline disabled</h4>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="primary"
            disabled={true}
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="secondary"
            disabled={true}
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="success"
            disabled={true}
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="info"
            disabled={true}
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="warning"
            disabled={true}
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            outline={true}
            color="danger"
            disabled={true}
          >
            danger
          </Button>
          <hr />
        </Col>
      </Row>
    );
  })
  .add('as outline with icon', () => {
    return (
      <Row>
        <Col xs={12}>
          <h4>Outline with icon</h4>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="primary"
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="success"
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="info"
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="warning"
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="danger"
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Outline with icon right</h4>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            iconPosition="right"
            outline={true}
            color="primary"
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            iconPosition="right"
            outline={true}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            iconPosition="right"
            outline={true}
            color="success"
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            iconPosition="right"
            outline={true}
            color="info"
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            iconPosition="right"
            outline={true}
            color="warning"
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            iconPosition="right"
            outline={true}
            color="danger"
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Outline with icon in progress</h4>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            inProgress={true}
            color="primary"
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            inProgress={true}
            color="secondary"
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            inProgress={true}
            color="success"
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            inProgress={true}
            color="info"
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            inProgress={true}
            color="warning"
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            inProgress={true}
            color="danger"
          >
            danger
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Outline with icon disabled</h4>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="primary"
            disabled={true}
          >
            primary
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="secondary"
            disabled={true}
          >
            secondary
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="success"
            disabled={true}
          >
            success
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="info"
          >
            info
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="warning"
            disabled={true}
          >
            warning
          </Button>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            outline={true}
            color="danger"
            disabled={true}
          >
            danger
          </Button>
          <hr />
        </Col>
      </Row>
    );
  })
  .add('as icon', () => {
    return (
      <Row>
        <Col xs={12}>
          <h4>Icon</h4>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="primary"
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="secondary"
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="success"
          />
          <Button onClick={action('Button clicked')} icon="save" color="info" />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="warning"
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="danger"
          />
          <hr />
        </Col>

        <Col xs={12}>
          <h4>Icon in progress</h4>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            inProgress={true}
            color="primary"
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            inProgress={true}
            color="secondary"
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            inProgress={true}
            color="success"
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            inProgress={true}
            color="info"
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            inProgress={true}
            color="warning"
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            inProgress={true}
            color="danger"
          />
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Icon disabled</h4>
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="primary"
            disabled={true}
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="secondary"
            disabled={true}
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="success"
            disabled={true}
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="info"
            disabled={true}
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="warning"
            disabled={true}
          />
          <Button
            onClick={action('Button clicked')}
            icon="save"
            color="danger"
            disabled={true}
          />
          <hr />
        </Col>
      </Row>
    );
  })
  .add('full width', () => {
    return (
      <Row>
        <Col xs={12}>
          <h4>Button</h4>
          <Button
            onClick={action('Button clicked')}
            color="primary"
            fullWidth={true}
          >
            primary
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button in progress</h4>
          <Button
            onClick={action('Button clicked')}
            inProgress={true}
            color="primary"
            fullWidth={true}
          >
            primary
          </Button>
          <hr />
        </Col>
        <Col xs={12}>
          <h4>Button disabled</h4>
          <Button
            onClick={action('Button clicked')}
            color="primary"
            disabled={true}
            fullWidth={true}
          >
            primary
          </Button>
          <hr />
        </Col>
      </Row>
    );
  });
