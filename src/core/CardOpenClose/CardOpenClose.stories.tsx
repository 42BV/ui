import React, { useState } from 'react';
import { CardOpenClose } from './CardOpenClose';

export default {
  title: 'core/CardOpenClose',

  parameters: {
    component: CardOpenClose
  }
};

const BasicStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardOpenClose
      header="You should see this!"
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
    >
      {() => (
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&autoplay=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </CardOpenClose>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};
