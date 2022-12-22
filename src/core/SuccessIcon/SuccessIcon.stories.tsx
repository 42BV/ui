import React, { useState } from 'react';

import { SuccessIcon } from './SuccessIcon';

export default {
  title: 'core/SuccessIcon',

  parameters: {
    component: SuccessIcon
  }
};

const DefaultStory = () => {
  const [value, setValue] = useState(false);
  return (
    <div className="text-center">
      <SuccessIcon onChange={() => setValue(!value)} value={value} />
    </div>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const HoverColorStory = () => {
  const [value, setValue] = useState(false);
  return (
    <div className="text-center">
      <SuccessIcon
        onChange={() => setValue(!value)}
        value={value}
        hoverColor="danger"
      />
    </div>
  );
};

export const HoverColor = {
  render: HoverColorStory,
  name: 'hover color'
};
