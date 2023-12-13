import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { FieldTextarea, JarbTextarea, Textarea } from './Textarea';
import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';
import { Alert } from 'reactstrap';
import { Card } from '../../card/Card/Card';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

storiesOf('Form/Textarea', module)
  .addParameters({ component: Textarea })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use Textarea, you have to add react-textarea-autosize to
          your dependencies:
        </p>
        <code>npm install --save react-textarea-autosize</code>
      </Alert>
      <Story />
    </>
  ))
  .add('basic', () => {
    return (
      <Card className="m-2">
        <Textarea
          id="description"
          label="Description"
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Card>
    );
  })
  .add('without placeholder', () => {
    return (
      <Card className="m-2">
        <Textarea
          id="description"
          label="Description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Card>
    );
  })
  .add('invisible label', () => {
    return (
      <Card className="m-2">
        <Textarea
          id="description"
          label="Description"
          hiddenLabel={true}
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Card>
    );
  })
  .add('with custom label', () => {
    return (
      <Card className="m-2">
        <Textarea
          id="description"
          label={
            <div className="d-flex justify-content-between">
              <span>Description</span>
              <Tooltip
                className="ms-1"
                content="The description is shown inside a tooltip"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Card>
    );
  })
  .add('field', () => {
    return (
      <>
        <FieldFormElementDependencies />
        <FinalForm>
          <FieldTextarea
            id="description"
            name="description"
            label="Description"
            placeholder="Please add a description"
          />
        </FinalForm>
      </>
    );
  })
  .add('jarb', () => {
    return (
      <>
        <JarbFormElementDependencies />
        <FinalForm>
          <JarbTextarea
            id="description"
            name="description"
            placeholder="Please add a description"
            jarb={{
              validator: 'Hero.description',
              label: 'Description'
            }}
          />
        </FinalForm>
      </>
    );
  });
