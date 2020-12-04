import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SubmitButton from './SubmitButton';

storiesOf('core/buttons/SubmitButton', module)
  .addParameters({ component: SubmitButton })
  .add('default', () => {
    return (
      <div className="text-center" style={{ width: 500 }}>
        <div className="text-center">
          <div>
            <span>When not in progress:</span>
            <SubmitButton
              onClick={() => action('on submit')}
              inProgress={false}
            >
              Save
            </SubmitButton>
          </div>
          <hr />
          <div>
            <span>When in progress:</span>
            <SubmitButton onClick={() => action('on submit')} inProgress={true}>
              Save
            </SubmitButton>
          </div>
        </div>
      </div>
    );
  })
  .add('icon size', () => {
    return (
      <div className="text-center" style={{ width: 500 }}>
        <div className="text-center">
          <div>
            <span>Small icon:</span>
            <SubmitButton
              onClick={() => action('on submit')}
              inProgress={false}
              iconSize={10}
            >
              Save
            </SubmitButton>
          </div>
          <hr />
          <div>
            <span>Default icon:</span>
            <SubmitButton
              onClick={() => action('on submit')}
              inProgress={false}
            >
              Save
            </SubmitButton>
          </div>
          <hr />
          <div>
            <span>Large icon:</span>
            <SubmitButton
              onClick={() => action('on submit')}
              inProgress={false}
              iconSize={30}
            >
              Save
            </SubmitButton>
          </div>
        </div>
      </div>
    );
  });
