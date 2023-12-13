import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Icon } from './Icon';
import { Button } from '../Button/Button';

storiesOf('core/Icons', module)
  .addParameters({ component: Icon })
  .add('available icons', () => {
    return (
      <>
        <p>You can find the available icons on Google Fonts</p>
        <Button
          onClick={() =>
            window.open('https://fonts.google.com/icons', '_blank')
          }
        >
          Go to Icons on Google Fonts
        </Button>
      </>
    );
  })
  .add('examples', () => {
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
  })
  .add('hover color', () => {
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
  });
