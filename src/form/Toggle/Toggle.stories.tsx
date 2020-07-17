import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Toggle, { FormToggle, JarbFormToggle } from './Toggle';
import { Form, FinalForm } from '../story-utils';
import { Icon, Tooltip } from '../..';

storiesOf('Form|Toggle', module)
  .add('basic', () => {
    const [primary, setPrimary] = useState(true);
    const [secondary, setSecondary] = useState(true);
    const [info, setInfo] = useState(true);
    const [success, setSuccess] = useState(true);
    const [warning, setWarning] = useState(true);
    const [danger, setDanger] = useState(true);
    const [light, setLight] = useState(true);
    const [dark, setDark] = useState(true);

    return (
      <div className="text-center">
        <Toggle
          color="primary"
          value={primary}
          onChange={value => setPrimary(value)}
          onBlur={action('onBlur')}
        />
        primary <br />
        <Toggle
          color="secondary"
          value={secondary}
          onChange={value => setSecondary(value)}
          onBlur={action('onBlur')}
        />
        secondary <br />
        <Toggle
          color="info"
          value={info}
          onChange={value => setInfo(value)}
          onBlur={action('onBlur')}
        />
        info <br />
        <Toggle
          color="success"
          value={success}
          onChange={value => setSuccess(value)}
          onBlur={action('onBlur')}
        />
        success <br />
        <Toggle
          color="warning"
          value={warning}
          onChange={value => setWarning(value)}
          onBlur={action('onBlur')}
        />
        warning <br />
        <Toggle
          color="danger"
          value={danger}
          onChange={value => setDanger(value)}
          onBlur={action('onBlur')}
        />
        danger <br />
        <Toggle
          color="light"
          value={light}
          onChange={value => setLight(value)}
          onBlur={action('onBlur')}
        />
        light <br />
        <Toggle
          color="dark"
          value={dark}
          onChange={value => setDark(value)}
          onBlur={action('onBlur')}
        />
        dark
      </div>
    );
  })
  .add('form', () => {
    const [agree, setAgree] = useState(false);

    return (
      <Form>
        <FormToggle
          id="agree"
          label="Agree"
          toggleColor="primary"
          value={agree}
          onChange={value => setAgree(value)}
        />
      </Form>
    );
  })
  .add('without label', () => {
    const [agree, setAgree] = useState(false);

    return (
      <Form>
        <FormToggle
          id="agree"
          toggleColor="primary"
          value={agree}
          onChange={value => setAgree(value)}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    const [agree, setAgree] = useState(false);

    return (
      <Form>
        <FormToggle
          id="agree"
          label={
            <>
              <span>Agree</span>
              <Tooltip
                className="position-absolute"
                style={{ left: 140 }}
                content="Always agree to any terms without reading them"
              >
                <Icon icon="info" />
              </Tooltip>
            </>
          }
          toggleColor="primary"
          value={agree}
          onChange={value => setAgree(value)}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbFormToggle
          id="agree"
          name="agree"
          label="Agree"
          toggleColor="primary"
          jarb={{
            validator: 'Hero.agree',
            label: 'Agree'
          }}
        />
      </FinalForm>
    );
  });
