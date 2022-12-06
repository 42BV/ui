import { AttributeView } from '../../lists/AttributeView/AttributeView';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { storiesOf } from '@storybook/react';
import { IconButton } from './IconButton';
import { Card } from 'reactstrap';
import { AttributeList } from '../../lists/AttributeList/AttributeList';

storiesOf('core/buttons/IconButton', module)
  .addParameters({ component: IconButton })
  .add('sizes', () => {
    return (
      <Card cardBodyClassName="py-1 px-0">
        <AttributeList>
          <AttributeView label="Icon">
            <IconButton
              onClick={action('buttons clicked')}
              color="primary"
              size="sm"
              icon="save"
              disabled={false}
            />
            <IconButton
              onClick={action('buttons clicked')}
              color="secondary"
              size="md"
              icon="save"
            />
            <IconButton
              onClick={action('buttons clicked')}
              color="success"
              size="lg"
              icon="save"
            />
          </AttributeView>
          <AttributeView label="Icon in progress">
            <IconButton
              onClick={action('buttons clicked')}
              color="primary"
              size="sm"
              icon="save"
              inProgress={true}
            />
            <IconButton
              onClick={action('buttons clicked')}
              color="secondary"
              size="md"
              icon="save"
              inProgress={true}
            />
            <IconButton
              onClick={action('buttons clicked')}
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
  .add('as icon', () => {
    return (
      <Card cardBodyClassName="py-1 px-0">
        <AttributeList>
          <AttributeView label="Icon">
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="primary"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="secondary"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="success"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="info"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="warning"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="danger"
            />
          </AttributeView>
          <AttributeView label="Icon in progress">
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              inProgress={true}
              color="primary"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              inProgress={true}
              color="secondary"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              inProgress={true}
              color="success"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              inProgress={true}
              color="info"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              inProgress={true}
              color="warning"
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              inProgress={true}
              color="danger"
            />
          </AttributeView>
          <AttributeView label="Icon disabled">
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="primary"
              disabled={true}
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="secondary"
              disabled={true}
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="success"
              disabled={true}
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="info"
              disabled={true}
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="warning"
              disabled={true}
            />
            <IconButton
              onClick={action('buttons clicked')}
              icon="save"
              color="danger"
              disabled={true}
            />
          </AttributeView>
        </AttributeList>
      </Card>
    );
  })
  .add('fullWidth', () => {
    return (
      <Card cardBodyClassName="py-1 px-0">
        <AttributeList>
          <AttributeView label="Icon left">
            <IconButton
              onClick={action('buttons clicked')}
              icon={'save'}
              fullWidth={true}
            />
          </AttributeView>
          <AttributeView label="Icon right">
            <IconButton
              onClick={action('buttons clicked')}
              icon={'save'}
              iconPosition="right"
              fullWidth={true}
            />
          </AttributeView>
          <AttributeView label="Icon disabled">
            <IconButton
              onClick={action('buttons clicked')}
              icon={'save'}
              fullWidth={true}
              disabled={true}
            />
          </AttributeView>
        </AttributeList>
      </Card>
    );
  });
