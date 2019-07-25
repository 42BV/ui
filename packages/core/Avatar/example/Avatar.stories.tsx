import React from 'react';
import { storiesOf } from '@storybook/react';

import Avatar from '../src/Avatar';

let size = 100;

function createAvatars({ src }: { src: string }) {
  size += 1;
  return {
    src
  };
}

const avatar = createAvatars({
  src: `http://lorempixel.com/${size}/${size}/`
});

storiesOf('Avatar', module)
  .addParameters({ component: Avatar })
  .add('small', () => <Avatar alt="xs" size="xs" src={avatar.src} />)
  .add('medium', () => <Avatar alt="md" size="md" src={avatar.src} />)
  .add('large', () => <Avatar alt="lg" size="lg" src={avatar.src} />)
  .add('with text', () => {
    return (
      <div className="text-center">
        <Avatar alt="muted avatar" src={avatar.src}>
          <small className="text-muted">Ahh jih</small>
        </Avatar>
      </div>
    );
  });

export const _ = '';
