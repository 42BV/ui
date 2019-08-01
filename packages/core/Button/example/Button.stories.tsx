import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Row, Col } from 'reactstrap';

import Button from '../src/Button';

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
      </Row>
    );
  });
