import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { ErrorBoundary } from './ErrorBoundary';
import RadioGroup from '../../form/RadioGroup/RadioGroup';

describe('Component: ErrorBoundary', () => {
  function setup({ text }: { text?: { error: string } }) {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Do nothing, we only want to make sure the error is logged
    });

    const errorBoundary = shallow(
      <ErrorBoundary text={text}>
        <RadioGroup<string>
          onChange={jest.fn().mockImplementation(() => {
            throw new Error('test');
          })}
          options={[ 'local', 'development', 'test', 'acceptation', 'production' ]}
          labelForOption={(v) => v}
        />
      </ErrorBoundary>
    );

    return { errorBoundary, consoleErrorSpy };
  }

  describe('ui', () => {
    test('without error', () => {
      const { errorBoundary, consoleErrorSpy } = setup({});

      expect(toJson(errorBoundary)).toMatchSnapshot(
        'Component: ErrorBoundary => ui => without error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
    });

    test('with error', () => {
      const { errorBoundary, consoleErrorSpy } = setup({});
      const error = new Error('test');

      errorBoundary.find('RadioGroup').simulateError(error);

      expect(toJson(errorBoundary)).toMatchSnapshot(
        'Component: ErrorBoundary => ui => with error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(error, `
    in RadioGroup (created by ErrorBoundary)
    in ErrorBoundary (created by WrapperComponent)
    in WrapperComponent`);
    });

    test('with custom text', () => {
      const { errorBoundary } = setup({ text: { error: 'Failure!' } });
      const error = new Error('test');

      errorBoundary.find('RadioGroup').simulateError(error);

      expect(toJson(errorBoundary)).toMatchSnapshot(
        'Component: ErrorBoundary => ui => with custom text'
      );
    });
  });
});
