import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import lodash from 'lodash';

import SearchInput, { Props } from './SearchInput';
import { Input } from 'reactstrap';

describe('Component: SearchInput', () => {
  function setup({
    debounce,
    showIcon,
    debounceSettings,
    showLabel,
    withChildren,
    canClear
  }: {
    debounce?: number;
    showIcon?: boolean;
    debounceSettings?: lodash.DebounceSettings;
    showLabel?: boolean;
    withChildren?: boolean;
    canClear?: boolean;
  }) {
    const debounceCancelSpy = jest.fn();

    // @ts-expect-error Test mock
    jest.spyOn(lodash, 'debounce').mockImplementation((fn) => {
      // @ts-expect-error Test mock
      fn.cancel = debounceCancelSpy;
      return fn;
    });

    const onChangeSpy = jest.fn();

    const props: Props = {
      defaultValue: '',
      debounce,
      debounceSettings,
      onChange: onChangeSpy,
      placeholder: 'Search...',
      canClear
    };

    if (showLabel) {
      props.id = 'search';
      props.label = 'Search';
    }

    if (withChildren) {
      // eslint-disable-next-line react/display-name
      props.children = () => <h1>Children</h1>;
    }

    switch (showIcon) {
      case true:
        props.showIcon = true;
        break;
      case false:
        props.showIcon = false;
        break;
      default:
        break;
    }

    const searchInput = shallow(<SearchInput {...props} />);

    return { searchInput, onChangeSpy, debounceCancelSpy };
  }

  describe('ui', () => {
    test('with icon', () => {
      const { searchInput } = setup({ showIcon: true });

      expect(toJson(searchInput)).toMatchSnapshot();
    });

    test('with icon when undefined', () => {
      const { searchInput } = setup({ showIcon: undefined });

      expect(toJson(searchInput)).toMatchSnapshot();
    });

    test('without icon', () => {
      const { searchInput } = setup({ showIcon: false });

      expect(toJson(searchInput)).toMatchSnapshot();
    });

    test('with label', () => {
      const { searchInput } = setup({ showIcon: false, showLabel: true });

      expect(toJson(searchInput)).toMatchSnapshot();
    });

    test('with label and children', () => {
      const { searchInput } = setup({
        showIcon: false,
        showLabel: true,
        withChildren: true
      });

      expect(toJson(searchInput)).toMatchSnapshot();
    });

    test('with value', () => {
      jest
        .spyOn(React, 'useRef')
        .mockReturnValueOnce({ current: { value: 'test' } });

      const { searchInput } = setup({});

      expect(toJson(searchInput)).toMatchSnapshot();
    });

    test('without clear button', () => {
      jest
        .spyOn(React, 'useRef')
        .mockReturnValueOnce({ current: { value: 'test' } });

      const { searchInput } = setup({ canClear: false });

      expect(toJson(searchInput)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should debounce by 500 by default', () => {
      const { searchInput, onChangeSpy } = setup({ showIcon: true });

      // @ts-expect-error Test mock
      searchInput
        .find(Input)
        .props()
        // @ts-expect-error Test mock
        .onChange({ target: { value: 'Maarten' } });

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('Maarten');

      expect(lodash.debounce).toBeCalledTimes(1);
      // @ts-expect-error Test mock
      expect(lodash.debounce.mock.calls[0][1]).toBe(500);
      // @ts-expect-error Test mock
      expect(lodash.debounce.mock.calls[0][2]).toBe(undefined);
    });

    it('should be able to debounce with a custom value', () => {
      const { searchInput, onChangeSpy } = setup({
        showIcon: true,
        debounce: 10
      });

      // @ts-expect-error Test mock
      searchInput
        .find(Input)
        .props()
        // @ts-expect-error Test mock
        .onChange({ target: { value: 'Maarten' } });

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('Maarten');

      expect(lodash.debounce).toBeCalledTimes(1);
      // @ts-expect-error Test mock
      expect(lodash.debounce.mock.calls[0][1]).toBe(10);
    });

    it('should debounce with settings when settings are defined', () => {
      const debounceSettings = { leading: true, trailing: false };

      const { searchInput, onChangeSpy } = setup({
        showIcon: true,
        debounceSettings
      });

      // @ts-expect-error Test mock
      searchInput
        .find(Input)
        .props()
        // @ts-expect-error Test mock
        .onChange({ target: { value: 'M' } });

      // Trailing will cause the first character to go through immediately
      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('M');

      expect(lodash.debounce).toBeCalledTimes(1);
      // @ts-expect-error Test mock
      expect(lodash.debounce.mock.calls[0][2]).toBe(debounceSettings);
    });

    it('should allow the user to take full control of the value through the children render prop', (done) => {
      const onChangeSpy = jest.fn();
      const cancel = jest.fn();

      // @ts-expect-error Test mock
      jest.spyOn(lodash, 'debounce').mockImplementation((fn) => {
        // @ts-expect-error Test mock
        fn.cancel = cancel;
        return fn;
      });

      const searchInput = mount(
        <SearchInput
          defaultValue=""
          debounce={300}
          onChange={onChangeSpy}
          showIcon={true}
        >
          {(searchInput, { setValue }) => {
            // At this time the ref is null so it wont be called
            setValue('not called');

            setTimeout(() => {
              setValue('external change');
            }, 0);

            return searchInput;
          }}
        </SearchInput>
      );

      setTimeout(() => {
        expect(onChangeSpy).toBeCalledTimes(1);
        expect(onChangeSpy).toBeCalledWith('external change');

        expect(cancel).toBeCalledTimes(1);

        // @ts-expect-error Test mock
        expect(searchInput.find('Input').props().innerRef.current.value).toBe(
          'external change'
        );

        done();
      }, 5);
    });

    describe('onKeyUp behavior', () => {
      it('should on "ENTER" press set the value immediately', () => {
        const { searchInput, onChangeSpy } = setup({ showIcon: true });

        // @ts-expect-error Test mock
        searchInput
          .find(Input)
          .props()
          // @ts-expect-error Test mock
          .onKeyUp({ key: 'Enter', currentTarget: { value: 'Maarten' } });

        expect(onChangeSpy).toBeCalledTimes(1);
        expect(onChangeSpy).toBeCalledWith('Maarten');
      });

      it('should on letters other "ENTER" wait for the debounce', () => {
        const { searchInput, onChangeSpy } = setup({ showIcon: true });

        // @ts-expect-error Test mock
        searchInput
          .find(Input)
          .props()
          // @ts-expect-error Test mock
          .onKeyUp({ key: 'a', currentTarget: { value: 'Maarten' } });

        expect(onChangeSpy).toBeCalledTimes(0);
      });
    });

    it('should clear value when clear icon is clicked', () => {
      jest
        .spyOn(React, 'useRef')
        .mockReturnValueOnce({ current: { value: 'test' } });

      const { searchInput, onChangeSpy, debounceCancelSpy } = setup({});

      // @ts-expect-error Test mock
      searchInput
        .find('Icon')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('');

      expect(debounceCancelSpy).toHaveBeenCalledTimes(1);

      // @ts-expect-error Test mock
      expect(searchInput.find('Input').props().innerRef.current.value).toBe('');
    });
  });
});
