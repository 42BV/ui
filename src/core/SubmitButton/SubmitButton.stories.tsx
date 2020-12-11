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
  .add('size', () => {
    return (
      <div className="text-center" style={{ width: 500 }}>
        <div className="text-center">
          <div>
            <span>sm:</span>
            <SubmitButton
              onClick={() => action('on submit')}
              inProgress={false}
              size="sm"
            >
              Save
            </SubmitButton>
          </div>
          <hr />
          <div>
            <span>md (default):</span>
            <SubmitButton
              onClick={() => action('on submit')}
              inProgress={false}
              size="md"
            >
              Save
            </SubmitButton>
          </div>
          <hr />
          <div>
            <span>lg:</span>
            <SubmitButton
              onClick={() => action('on submit')}
              inProgress={false}
              size="lg"
            >
              Save
            </SubmitButton>
          </div>
        </div>
      </div>
    );
  });
