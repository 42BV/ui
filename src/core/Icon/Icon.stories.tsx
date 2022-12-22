import React from 'react';
import { action } from '@storybook/addon-actions';

import { Icon } from './Icon';
import { Button } from '../Button/Button';

export default {
  title: 'core/Icons',

  parameters: {
    component: Icon
  }
};

const AvailableIconsStory = () => {
  return (
    <>
      <p>You can find the available icons on Google Fonts</p>
      <Button
        onClick={() => window.open('https://fonts.google.com/icons', '_blank')}
      >
        Go to Icons on Google Fonts
      </Button>
    </>
  );
};

export const AvailableIcons = {
  render: AvailableIconsStory,
  name: 'available icons'
};

const ExamplesStory = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <Icon icon="child_care" color="danger" />
      <Icon icon="adb" color="info" />
      <Icon icon="restaurant" color="muted" />
      <Icon icon="train" color="primary" />
      <Icon icon="wb_sunny" color="warning" />
      <Icon icon="info" size={144} />
      <Icon icon="info" size={20} />
      <Icon icon="drafts" />
      <Icon icon="drafts" disabled={true} />
      <Icon icon="timer_3" onClick={action('timer clicked')} />
      <Icon icon="home" disabled={true} onClick={action('home clicked')} />
    </div>
  );
};

export const Examples = {
  render: ExamplesStory,
  name: 'examples'
};

const HoverColorStory = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <Icon
        icon="child_care"
        color="secondary"
        hoverColor="danger"
        onClick={action('child care clicked')}
      />
      <Icon
        icon="train"
        color="primary"
        hoverColor="success"
        onClick={action('train clicked')}
      />
      <Icon
        icon="home"
        disabled={true}
        color="primary"
        hoverColor="success"
        onClick={action('home clicked')}
      />
    </div>
  );
};

export const HoverColor = {
  render: HoverColorStory,
  name: 'hover color'
};
