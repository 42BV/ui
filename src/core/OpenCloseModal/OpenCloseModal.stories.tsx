import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { OpenCloseModal } from './OpenCloseModal';
import { Card } from 'reactstrap';
import Button from '../Button/Button';
import RadioGroup from '../../form/RadioGroup/RadioGroup';

storiesOf('core|OpenCloseModal', module)
  .add('basic', () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [choice, setChoice] = useState();

    function onSave() {
      action('save button was clicked');

      setInProgress(true);

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }

    function onClose() {
      action('modal was closed');
      setIsOpen(false);
    }

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>Start inquiry</Button>
        <OpenCloseModal
          isOpen={isOpen}
          inProgress={inProgress}
          onClose={onClose}
          onSave={onSave}
          label="What are you doing?"
        >
          <RadioGroup
            value={choice}
            onChange={setChoice}
            options={[
              'Watching a movie',
              'I work at 42, the most awesome company in the world!',
              'Nothing'
            ]}
            optionForValue={option => option}
          />
        </OpenCloseModal>
      </Card>
    );
  })
  .add('without heading', () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>Inspire me</Button>
        <OpenCloseModal
          isOpen={isOpen}
          onSave={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
          text={{ save: 'Yes', cancel: 'No' }}
        >
          <p>
            You have to take a break once in a while. Did you go for a walk
            outside to breathe some fresh air?
          </p>
        </OpenCloseModal>
      </Card>
    );
  })
  .add('without buttons', () => {
    const [isOpen, setIsOpen] = useState(false);

    function onClose() {
      setIsOpen(false);
    }

    return (
      <Card body>
        <Button onClick={() => setIsOpen(true)}>What does Baymax say?</Button>
        <OpenCloseModal
          isOpen={isOpen}
          onClose={onClose}
          label="Your personal health companion"
        >
          <p>
            You need to wash your hands if you want to prevent getting Corona
            virus.
          </p>
        </OpenCloseModal>
      </Card>
    );
  })
  .add('custom button text', () => {
    const [isOpen, setIsOpen] = useState(false);
    const [choice, setChoice] = useState();

    function onSave() {
      alert(`You chose to ${choice.value} the diamond`);
      setIsOpen(false);
    }

    function onClose() {
      alert(
        `Darn! You tricked and the diamond fell in an endless hole in the ground...`
      );
      setIsOpen(false);
    }

    return (
      <Card body>
        <p>You found a box!</p>
        <Button onClick={() => setIsOpen(true)}>
          Check what&apos;s inside
        </Button>
        <OpenCloseModal
          isOpen={isOpen}
          onClose={onClose}
          onSave={onSave}
          label="It's a special gift!"
          text={{
            save: 'Confirm',
            cancel: ''
          }}
        >
          <p>Inside the box you find a diamond. What do you want to do?</p>
          <RadioGroup
            value={choice}
            onChange={setChoice}
            options={[
              { label: 'Sell it!', value: 'sell' },
              { label: 'Put it in my pocket', value: 'store' }
            ]}
            optionForValue={option => option.label}
          />
        </OpenCloseModal>
      </Card>
    );
  });
