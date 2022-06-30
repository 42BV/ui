import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import ColorPicker, { JarbColorPicker } from './ColorPicker';
import { FinalForm, JarbFormElementDependencies } from '../story-utils';
import { Icon, Tooltip, Card } from '../..';
import { Alert } from 'reactstrap';

function isToDark(value?: string) {
  if (!value) {
    return undefined;
  }

  const c = value.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (luma < 40) {
    return 'This color is to dark';
  }

  return undefined;
}

storiesOf('Form/ColorPicker', module)
  .addParameters({ component: ColorPicker })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use ColorPicker, you have to add react-color to your dependencies:</p>
        <code>npm install --save react-color</code>
      </Alert>
      <Story />
    </>
  ))
  .add('basic', () => {
    const [value, setValue] = useState<string | undefined>();

    return (
      <div>
        <Card className="m-2">
          <ColorPicker
            id="color"
            label="Color"
            placeholder="Please select your favorite color"
            value={value}
            onChange={setValue}
          />
        </Card>
      </div>
    );
  })
  .add('basic preselected', () => {
    const [value, setValue] = useState<string | undefined>('#ff0000');

    return (
      <div>
        <Card className="m-2">
          <ColorPicker
            id="color"
            label="Color"
            placeholder="Please select your favorite color"
            value={value}
            onChange={setValue}
          />
        </Card>
      </div>
    );
  })
  .add('with custom label', () => {
    const [value, setValue] = useState<string | undefined>();

    return (
      <div>
        <Card className="m-2">
          <ColorPicker
            id="color"
            label={
              <div className="d-flex justify-content-between">
                <span>Color</span>
                <Tooltip
                  className="ms-1"
                  content="Use the color picker to select a color"
                >
                  <Icon icon="info" />
                </Tooltip>
              </div>
            }
            placeholder="Please select your favorite color"
            value={value}
            onChange={setValue}
          />
        </Card>
      </div>
    );
  })
  .add('with icon', () => {
    const [value, setValue] = useState<string | undefined>();

    return (
      <div>
        <Card className="m-2">
          <ColorPicker
            id="color"
            label="Color"
            placeholder="Please select your favorite color"
            icon="colorize"
            value={value}
            onChange={setValue}
          />
        </Card>
      </div>
    );
  })
  .add('without clear button', () => {
    const [value, setValue] = useState<string | undefined>('#ff0000');

    return (
      <div>
        <Card className="m-2">
          <ColorPicker
            id="color"
            label="Color"
            placeholder="Please select your favorite color"
            value={value}
            onChange={setValue}
            canClear={false}
          />
        </Card>
      </div>
    );
  })
  .add('jarb', () => {
    return (
      <>
        <JarbFormElementDependencies />
        <FinalForm>
          <JarbColorPicker
            id="color"
            name="color"
            label="Color"
            placeholder="Please select your favorite color"
            validators={[isToDark]}
            jarb={{
              validator: 'Hero.color',
              label: 'Color'
            }}
          />
        </FinalForm>
      </>
    );
  });
