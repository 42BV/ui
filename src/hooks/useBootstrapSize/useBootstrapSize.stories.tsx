import { storiesOf } from '@storybook/react';
import { BootstrapSize, useBootstrapSize } from './useBootstrapSize';
import { Card } from 'reactstrap';
import { Button } from '../../core/Button/Button';
import { Avatar } from '../../avatar/Avatar/Avatar';
import { Color } from '../../core/types';

storiesOf('hooks/useBootstrapSize', module).add('basic', () => {
  const { bootstrapSize, isMobile, isTablet, isDesktop } = useBootstrapSize();

  const colors: { [key in BootstrapSize]: Color } = {
    xs: 'info',
    sm: 'primary',
    md: 'secondary',
    lg: 'success',
    xl: 'warning',
    xxl: 'danger'
  };

  return (
    <Card color={colors[bootstrapSize]} body>
      <p>
        The background of this card will change depending on the screen size.
      </p>
      <p>
        With useBootstrapSize you can render a completely different component
        based on the size of the screen.
      </p>
      {isMobile ? (
        <p>This content should only be visible on mobile phones.</p>
      ) : null}
      {isTablet ? (
        <Button>
          This button should only be visible on tablets in portrait mode.
        </Button>
      ) : null}
      {isDesktop ? (
        <p>
          <Avatar alt="lg" size="lg" src="https://www.placecage.com/100/100" />
          This avatar should only be visible on laptops, monitors, and tablets
          in landscape mode.
        </p>
      ) : null}
    </Card>
  );
});
