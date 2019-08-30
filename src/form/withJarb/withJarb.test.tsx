import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as reactErrorStore from '@42.nl/react-error-store';

import withJarb from './withJarb';

import { validMeta } from '../../test/fixtures';

const isSuperman = (value: string) =>
  value === 'superman' ? undefined : 'not superman';

const JarbInput = withJarb<string, string, Props>(Input);

describe('HoC: withJarb', () => {
  let jarbFieldParent: ShallowWrapper;
  let jarbField: ShallowWrapper;
  let formError: ShallowWrapper;

  let onBlurSpy: jest.Mock<any, any>;
  let onChangeSpy: jest.Mock<any, any>;

  function setup() {
    onBlurSpy = jest.fn();
    onChangeSpy = jest.fn();

    jarbFieldParent = shallow(
      <JarbInput
        name="firstName"
        jarb={{ validator: 'User.email', label: 'First name' }}
        validators={[isSuperman]}
        id="firstName"
        label="First name"
        placeholder="Please enter your first name"
      />
    );

    const input = { onBlur: onBlurSpy, onChange: onChangeSpy, value: 'value' };

    jarbField = shallow(
      // @ts-ignore
      jarbFieldParent.props().render({ input, meta: validMeta })
    );

    formError = shallow(
      // @ts-ignore
      jarbField.props().error.props.render({ input, meta: validMeta })
    );
  }

  test('ui', () => {
    setup();

    expect(toJson(jarbFieldParent)).toMatchSnapshot('withJarb => ui');
    expect(toJson(jarbField)).toMatchSnapshot('withJarb => ui => jarbField');
    expect(toJson(formError)).toMatchSnapshot('withJarb => ui => formError');
  });

  describe('events', () => {
    test('onChange: call onChange and remove back-end errors', () => {
      setup();

      jest.spyOn(reactErrorStore, 'clearErrorsForValidator');

      // @ts-ignore
      jarbField.props().onChange({ target: { value: 42 } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(42);

      expect(reactErrorStore.clearErrorsForValidator).toHaveBeenCalledTimes(1);
      expect(reactErrorStore.clearErrorsForValidator).toHaveBeenCalledWith(
        'User.email'
      );
    });

    test('onBlur should call onBlurSpy', () => {
      setup();

      // @ts-ignore
      jarbField.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });
});

interface Props {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: React.ReactNode;
  color?: string;
  valid?: boolean;
}

export default function Input(props: Props) {
  return (
    <input
      {...props}
      onChange={(event: { target: { value: string } }) =>
        props.onChange(event.target.value)
      }
    />
  );
}
