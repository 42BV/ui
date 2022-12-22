import React, { useState } from 'react';

import { FavoriteIcon } from './FavoriteIcon';

export default {
  title: 'core/FavoriteIcon',

  parameters: {
    component: FavoriteIcon
  }
};

const DefaultStory = () => {
  const [favorite, setFavorite] = useState(false);
  return (
    <div className="text-center">
      <FavoriteIcon onChange={() => setFavorite(!favorite)} value={favorite} />
    </div>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const HoverColorStory = () => {
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
};

export const HoverColor = {
  render: HoverColorStory,
  name: 'hover color'
};
