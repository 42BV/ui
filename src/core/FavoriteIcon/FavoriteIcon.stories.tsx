import { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { FavoriteIcon } from './FavoriteIcon';

storiesOf('core/FavoriteIcon', module)
  .addParameters({ component: FavoriteIcon })
  .add('default', () => {
    const [favorite, setFavorite] = useState(false);
    return (
      <div className="text-center">
        <FavoriteIcon
          onChange={() => setFavorite(!favorite)}
          value={favorite}
        />
      </div>
    );
  })
  .add('hover color', () => {
    const [favorite, setFavorite] = useState(false);
    return (
      <div className="text-center">
        <FavoriteIcon
          onChange={() => setFavorite(!favorite)}
          value={favorite}
          hoverColor="danger"
        />
      </div>
    );
  });
