import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as reactErrorStore from '@42.nl/react-error-store';

import withJarb from './withJarb';
import * as useHasErrors from './useHasErrors/useHasErrors';

import { validMeta } from '../../test/fixtures';

const isSuperman = (value: string) =>
  value === 'superman' ? undefined : 'not superman';

const JarbInput = withJarb<string, string, Props>(Input);

describe('HoC: withJarb', () => {
  let jarbFieldParent: ShallowWrapper;
  let jarbField: ShallowWrapper;
  let formError: ShallowWrapper;

  let onBlurSpy: jest.Mock;
  let onChangeSpy: jest.Mock;

  function setup() {
    onBlurSpy = jest.fn();
    onChangeSpy = jest.fn();

    jest
      .spyOn(useHasErrors, 'useHasErrors')
      .mockImplementation(() => [false, jest.fn()]);

    jarbFieldParent = shallow(
      <JarbInput
        name="firstName"
        jarb={{ validator: 'User.email', label: 'First name' }}
        validators={[isSuperman]}
        asyncValidators={[isSuperman]}
        asyncValidatorsDebounce={5000}
        id="firstName"
        label="First name"
        placeholder="Please enter your first name"
        // Should pass `passedFieldProps`
        initialValue="beheer@42.nl"
        format={() => 'yolo'}
        formatOnBlur={false}
        parse={() => 'oloy'}
      />
    );

    const input = { onBlur: onBlurSpy, onChange: onChangeSpy, value: 'value' };

    jarbField = shallow(
      // @ts-expect-error Test mock
      jarbFieldParent.props().render({ input, meta: validMeta })
    );

    formError = shallow(
      // @ts-expect-error Test mock
      jarbField.props().error.props.render({ input, meta: validMeta })
    );
  }

  test('ui', () => {
    setup();

    expect(toJson(jarbFieldParent)).toMatchSnapshot('withJarb => ui');
    expect(toJson(jarbField)).toMatchSnapshot('withJarb => ui => jarbField');
    expect(toJson(formError)).toMatchSnapshot('withJarb => ui => formError');
  });

  test('errorMode: tooltip', () => {
    jest
      .spyOn(useHasErrors, 'useHasErrors')
      .mockImplementation(() => [true, jest.fn()]);

    const jarbInput = shallow(
      <JarbInput
        name="firstName"
        jarb={{ validator: 'User.email', label: 'First name' }}
        validators={[isSuperman]}
        initialValue="beheer@42.nl"
        errorMode="tooltip"
      />
    );

    const input = { onBlur: onBlurSpy, onChange: onChangeSpy, value: 'value' };

    const tooltip = shallow(
      jarbInput.props().render({ input, meta: validMeta })
    );

    const tooltipFormError = shallow(
      tooltip
        .props()
        // @ts-expect-error Test mock
        .content.props.children[1].props.render({ input, meta: validMeta })
    );

    expect(toJson(tooltip)).toMatchSnapshot(
      'withJarb => errorMode: tooltip => jarbField'
    );
    expect(toJson(tooltipFormError)).toMatchSnapshot(
      'withJarb => errorMode: tooltip => formError'
    );
  });

  it('should throw an error when detecting illegal props', () => {
    expect(() =>
      // @ts-expect-error Test mock
      shallow(<JarbInput value="test" onChange={() => undefined} />)
    ).toThrowErrorMatchingSnapshot();
  });

  describe('events', () => {
    test('onChange: call onChange and remove back-end errors', () => {
      setup();

      jest.spyOn(reactErrorStore, 'clearErrorsForValidator');

      // @ts-expect-error Test mock
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

      // @ts-expect-error Test mock
      jarbField.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });
});

type Props = {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: React.ReactNode;
  color?: string;
  valid?: boolean;
};

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
