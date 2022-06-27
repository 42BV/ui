import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from './Button';
import { Card } from '../Card/Card';
import { AttributeList } from '../lists/AttributeList/AttributeList';
import { AttributeView } from '../lists/AttributeView/AttributeView';

storiesOf('core/buttons/Button', module)
  .addParameters({ component: Button })
  .add('sizes', () => {
    return (
      <Card cardBodyClassName="py-1 px-0">
        <AttributeList>
          <AttributeView label="Button">
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
          </AttributeView>
          <AttributeView label="Button with icon">
            <Button
              onClick={action('Button clicked')}
              color="primary"
              size="sm"
              icon="save"
            >
              sm
            </Button>
            <Button
              onClick={action('Button clicked')}
              color="secondary"
              size="md"
              icon="save"
            >
              md
            </Button>
            <Button
              onClick={action('Button clicked')}
              color="success"
              size="lg"
              icon="save"
            >
              lg
            </Button>
          </AttributeView>
          <AttributeView label="Button in progress">
            <Button
              onClick={action('Button clicked')}
              inProgress={true}
              color="primary"
              size="sm"
            >
              sm
            </Button>
            <Button
              onClick={action('Button clicked')}
              inProgress={true}
              color="secondary"
              size="md"
            >
              md
            </Button>
            <Button
              onClick={action('Button clicked')}
              inProgress={true}
              color="success"
              size="lg"
            >
              lg
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon right">
            <Button
              onClick={action('Button clicked')}
              color="primary"
              size="sm"
              icon="save"
              iconPosition="right"
            >
              sm
            </Button>
            <Button
              onClick={action('Button clicked')}
              color="secondary"
              size="md"
              icon="save"
              iconPosition="right"
            >
              md
            </Button>
            <Button
              onClick={action('Button clicked')}
              color="success"
              size="lg"
              icon="save"
              iconPosition="right"
            >
              lg
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon right in progress">
            <Button
              onClick={action('Button clicked')}
              color="primary"
              size="sm"
              icon="save"
              iconPosition="right"
              inProgress={true}
            >
              sm
            </Button>
            <Button
              onClick={action('Button clicked')}
              color="secondary"
              size="md"
              icon="save"
              iconPosition="right"
              inProgress={true}
            >
              md
            </Button>
            <Button
              onClick={action('Button clicked')}
              color="success"
              size="lg"
              icon="save"
              iconPosition="right"
              inProgress={true}
            >
              lg
            </Button>
          </AttributeView>
          <AttributeView label="Button disabled">
            <Button
              onClick={action('Button clicked')}
              color="primary"
              disabled={true}
              size="sm"
            >
              sm
            </Button>
            <Button
              onClick={action('Button clicked')}
              color="secondary"
              disabled={true}
              size="md"
            >
              md
            </Button>
            <Button
              onClick={action('Button clicked')}
              color="success"
              disabled={true}
              size="lg"
            >
              lg
            </Button>
          </AttributeView>
          <AttributeView label="Outline">
            <Button
              onClick={action('Button clicked')}
              outline={true}
              color="primary"
              size="sm"
            >
              sm
            </Button>
            <Button
              onClick={action('Button clicked')}
              outline={true}
              color="secondary"
              size="md"
            >
              md
            </Button>
            <Button
              onClick={action('Button clicked')}
              outline={true}
              color="success"
              size="lg"
            >
              lg
            </Button>
          </AttributeView>
          <AttributeView label="Outline with icon">
            <Button
              onClick={action('Button clicked')}
              outline={true}
              color="primary"
              size="sm"
              icon="save"
            >
              sm
            </Button>
            <Button
              onClick={action('Button clicked')}
              outline={true}
              color="secondary"
              size="md"
              icon="save"
            >
              md
            </Button>
            <Button
              onClick={action('Button clicked')}
              outline={true}
              color="success"
              size="lg"
              icon="save"
            >
              lg
            </Button>
          </AttributeView>
          <AttributeView label="Outline disabled">
            <Button
              onClick={action('Button clicked')}
              outline={true}
              disabled={true}
              color="primary"
              size="sm"
              icon="save"
            >
              sm
            </Button>
            <Button
              onClick={action('Button clicked')}
              outline={true}
              disabled={true}
              color="secondary"
              size="md"
              icon="save"
            >
              md
            </Button>
            <Button
              onClick={action('Button clicked')}
              outline={true}
              disabled={true}
              color="success"
              size="lg"
              icon="save"
            >
              lg
            </Button>
          </AttributeView>
          <AttributeView label="Icon">
            <Button
              onClick={action('Button clicked')}
              color="primary"
              size="sm"
              icon="save"
            />
            <Button
              onClick={action('Button clicked')}
              color="secondary"
              size="md"
              icon="save"
            />
            <Button
              onClick={action('Button clicked')}
              color="success"
              size="lg"
              icon="save"
            />
          </AttributeView>
          <AttributeView label="Icon in progress">
            <Button
              onClick={action('Button clicked')}
              color="primary"
              size="sm"
              icon="save"
              inProgress={true}
            />
            <Button
              onClick={action('Button clicked')}
              color="secondary"
              size="md"
              icon="save"
              inProgress={true}
            />
            <Button
              onClick={action('Button clicked')}
              color="success"
              size="lg"
              icon="save"
              inProgress={true}
            />
          </AttributeView>
        </AttributeList>
      </Card>
    );
  })
  .add('as button', () => {
    return (
      <Card cardBodyClassName="py-1 px-0">
        <AttributeList>
          <AttributeView label="Button">
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
          </AttributeView>
          <AttributeView label="Button disabled">
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
          </AttributeView>
          <AttributeView label="Button with icon">
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
          </AttributeView>
          <AttributeView label="Button with icon in progress">
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
          </AttributeView>
          <AttributeView label="Button with icon disabled">
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
          </AttributeView>
          <AttributeView label="Button with icon right">
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
          </AttributeView>
          <AttributeView label="Button with icon right in progress">
            <Button
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="primary"
            >
              primary
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="secondary"
            >
              secondary
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="success"
            >
              success
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="info"
            >
              info
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="warning"
            >
              warning
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon right disabled">
            <Button
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="primary"
            >
              primary
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="secondary"
            >
              secondary
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="success"
            >
              success
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="info"
            >
              info
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="warning"
            >
              warning
            </Button>
            <Button
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
        </AttributeList>
      </Card>
    );
  })
  .add('as outline', () => {
    return (
      <Card cardBodyClassName="py-1 px-0">
        <AttributeList>
          <AttributeView label="Button">
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="primary"
            >
              primary
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="secondary"
            >
              secondary
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="success"
            >
              success
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="info"
            >
              info
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="warning"
            >
              warning
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
          <AttributeView label="Button disabled">
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="primary"
              disabled={true}
            >
              primary
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="secondary"
              disabled={true}
            >
              secondary
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="success"
              disabled={true}
            >
              success
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="info"
              disabled={true}
            >
              info
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="warning"
              disabled={true}
            >
              warning
            </Button>
            <Button
              outline={true}
              onClick={action('Button clicked')}
              color="danger"
              disabled={true}
            >
              danger
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon">
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="primary"
            >
              primary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="secondary"
            >
              secondary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="success"
            >
              success
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="info"
            >
              info
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="warning"
            >
              warning
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon in progress">
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              color="primary"
            >
              primary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              color="secondary"
            >
              secondary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              color="success"
            >
              success
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              color="info"
            >
              info
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              color="warning"
            >
              warning
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon disabled">
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="primary"
              disabled={true}
            >
              primary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="secondary"
              disabled={true}
            >
              secondary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="success"
              disabled={true}
            >
              success
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="info"
              disabled={true}
            >
              info
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="warning"
              disabled={true}
            >
              warning
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon right">
            <Button
              outline={true}
              icon="save"
              iconPosition="right"
              onClick={action('Button clicked')}
              color="primary"
            >
              primary
            </Button>
            <Button
              outline={true}
              icon="save"
              iconPosition="right"
              onClick={action('Button clicked')}
              color="secondary"
            >
              secondary
            </Button>
            <Button
              outline={true}
              icon="save"
              iconPosition="right"
              onClick={action('Button clicked')}
              color="success"
            >
              success
            </Button>
            <Button
              outline={true}
              icon="save"
              iconPosition="right"
              onClick={action('Button clicked')}
              color="info"
            >
              info
            </Button>
            <Button
              outline={true}
              icon="save"
              iconPosition="right"
              onClick={action('Button clicked')}
              color="warning"
            >
              warning
            </Button>
            <Button
              outline={true}
              icon="save"
              iconPosition="right"
              onClick={action('Button clicked')}
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon right in progress">
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="primary"
            >
              primary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="secondary"
            >
              secondary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="success"
            >
              success
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="info"
            >
              info
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="warning"
            >
              warning
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              inProgress={true}
              iconPosition="right"
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
          <AttributeView label="Button with icon right disabled">
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="primary"
            >
              primary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="secondary"
            >
              secondary
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="success"
            >
              success
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="info"
            >
              info
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="warning"
            >
              warning
            </Button>
            <Button
              outline={true}
              icon="save"
              onClick={action('Button clicked')}
              disabled={true}
              iconPosition="right"
              color="danger"
            >
              danger
            </Button>
          </AttributeView>
        </AttributeList>
      </Card>
    );
  })
  .add('as icon', () => {
      return (
        <Card cardBodyClassName="py-1 px-0">
          <AttributeList>
            <AttributeView label="Icon">
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
            </AttributeView>
            <AttributeView label="Icon in progress">
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
            </AttributeView>
            <AttributeView label="Icon disabled">
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
            </AttributeView>
          </AttributeList>
        </Card>
      );
    }
  )
  .add('full width', () => {
      return (
        <Card cardBodyClassName="py-1 px-0">
          <AttributeList>
            <AttributeView label="Button">
              <Button
                onClick={action('Button clicked')}
                color="primary"
                fullWidth={true}
              >
                primary
              </Button>
            </AttributeView>
            <AttributeView label="Button in progress">
              <Button
                onClick={action('Button clicked')}
                inProgress={true}
                color="primary"
                fullWidth={true}
              >
                primary
              </Button>
            </AttributeView>
            <AttributeView label="Button disabled">
              <Button
                onClick={action('Button clicked')}
                color="primary"
                disabled={true}
                fullWidth={true}
              >
                primary
              </Button>
            </AttributeView>
            <AttributeView label="Outline">
              <Button
                onClick={action('Button clicked')}
                color="primary"
                fullWidth={true}
                outline={true}
              >
                primary
              </Button>
            </AttributeView>
            <AttributeView label="Outline disabled">
              <Button
                onClick={action('Button clicked')}
                color="primary"
                disabled={true}
                fullWidth={true}
                outline={true}
              >
                primary
              </Button>
            </AttributeView>
            <AttributeView label="Icon left">
              <Button
                onClick={action('Button clicked')}
                icon={'save'}
                fullWidth={true}
              />
            </AttributeView>
            <AttributeView label="Icon right">
              <Button
                onClick={action('Button clicked')}
                icon={'save'}
                iconPosition="right"
                fullWidth={true}
              />
            </AttributeView>
            <AttributeView label="Icon disabled">
              <Button
                onClick={action('Button clicked')}
                icon={'save'}
                fullWidth={true}
                disabled={true}
              />
            </AttributeView>
          </AttributeList>
        </Card>
      );
    }
  );
