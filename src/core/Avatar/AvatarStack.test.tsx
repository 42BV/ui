import React from 'react';
import { render } from '@testing-library/react';

import { Avatar } from './Avatar';
import { AvatarStack } from './AvatarStack';

describe('Component: AvatarsStack', () => {
  test('ui', () => {
    const { container } = render(
      <AvatarStack>
        <Avatar
          key="1"
          size="xs"
          imgProps={{ alt: 'Picture 1', src: 'https://lorempixel.com/200/200' }}
        />
        <Avatar
          key="2"
          size="sm"
          imgProps={{ alt: 'Picture 2', src: 'https://lorempixel.com/200/200' }}
        />
        <Avatar
          key="3"
          size="md"
          imgProps={{ alt: 'Picture 3', src: 'https://lorempixel.com/200/200' }}
        />
        <Avatar
          key="4"
          size="lg"
          imgProps={{ alt: 'Picture 4', src: 'https://lorempixel.com/200/200' }}
        />
      </AvatarStack>
    );

    expect(container).toMatchSnapshot();
  });
});
