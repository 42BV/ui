import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Toggle from './Toggle';

storiesOf('Core/Toggle', module).add('basic', () => {
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
        value={primary}
        color="primary"
        onChange={setPrimary}
        onBlur={action('onBlur')}
      />
      primary <br />
      <Toggle
        value={secondary}
        color="secondary"
        onChange={setSecondary}
        onBlur={action('onBlur')}
      />
      secondary <br />
      <Toggle
        value={info}
        color="info"
        onChange={setInfo}
        onBlur={action('onBlur')}
      />
      info <br />
      <Toggle
        value={success}
        color="success"
        onChange={setSuccess}
        onBlur={action('onBlur')}
      />
      success <br />
      <Toggle
        value={warning}
        color="warning"
        onChange={setWarning}
        onBlur={action('onBlur')}
      />
      warning <br />
      <Toggle
        value={danger}
        color="danger"
        onChange={setDanger}
        onBlur={action('onBlur')}
      />
      danger <br />
      <Toggle
        value={light}
        color="light"
        onChange={setLight}
        onBlur={action('onBlur')}
      />
      light <br />
      <Toggle
        value={dark}
        color="dark"
        onChange={setDark}
        onBlur={action('onBlur')}
      />
      dark
    </div>
  );
});
