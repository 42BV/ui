import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import lodash from 'lodash';

import SearchInput from './SearchInput';
import { Input } from 'reactstrap';

describe('Component: SearchInput', () => {
  function setup({
    debounce,
    showIcon,
    debounceSettings
  }: {
    debounce?: number;
    showIcon?: boolean;
    debounceSettings?: lodash.DebounceSettings;
  }) {
    // @ts-ignore
    jest.spyOn(lodash, 'debounce').mockImplementation(fn => {
      return fn;
    });

    const onChangeSpy = jest.fn();

    const searchInput = shallow(
      <SearchInput
        value=""
        debounce={debounce}
        debounceSettings={debounceSettings}
        onChange={onChangeSpy}
        showIcon={showIcon}
        placeholder="Search..."
      />
    );

    return { searchInput, onChangeSpy };
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
  });

  describe('events', () => {
    it('should debounce by 500 by default', () => {
      const { searchInput, onChangeSpy } = setup({ showIcon: true });

      // @ts-ignore
      searchInput
        .find(Input)
        .props()
        // @ts-ignore
        .onChange({ target: { value: 'Maarten' } });

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('Maarten');

      expect(lodash.debounce).toBeCalledTimes(1);
      // @ts-ignore
      expect(lodash.debounce.mock.calls[0][1]).toBe(500);
      // @ts-ignore
      expect(lodash.debounce.mock.calls[0][2]).toBe(undefined);
    });

    it('should be able to debounce with a custom value', () => {
      const { searchInput, onChangeSpy } = setup({
        showIcon: true,
        debounce: 10
      });

      // @ts-ignore
      searchInput
        .find(Input)
        .props()
        // @ts-ignore
        .onChange({ target: { value: 'Maarten' } });

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('Maarten');

      expect(lodash.debounce).toBeCalledTimes(1);
      // @ts-ignore
      expect(lodash.debounce.mock.calls[0][1]).toBe(10);
    });

    it('should debounce with settings when settings are defined', () => {
      const debounceSettings = { leading: true, trailing: false };

      const { searchInput, onChangeSpy } = setup({
        showIcon: true,
        debounceSettings
      });

      // @ts-ignore
      searchInput
        .find(Input)
        .props()
        // @ts-ignore
        .onChange({ target: { value: 'M' } });

      // Trailing will cause the first character to go through immediately
      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('M');

      expect(lodash.debounce).toBeCalledTimes(1);
      // @ts-ignore
      expect(lodash.debounce.mock.calls[0][2]).toBe(debounceSettings);
    });

    it('should allow the user to take full control of the value through the children render prop', done => {
      const onChangeSpy = jest.fn();
      const cancel = jest.fn();

      // @ts-ignore
      jest.spyOn(lodash, 'debounce').mockImplementation(fn => {
        // @ts-ignore
        fn.cancel = cancel;
        return fn;
      });

      const searchInput = mount(
        <SearchInput
          value=""
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

        // @ts-ignore
        expect(searchInput.find('Input').props().innerRef.current.value).toBe(
          'external change'
        );

        done();
      }, 5);
    });

    describe('onKeyUp behavior', () => {
      it('should on "ENTER" press set the value immediately', () => {
        const { searchInput, onChangeSpy } = setup({ showIcon: true });

        // @ts-ignore
        searchInput
          .find(Input)
          .props()
          // @ts-ignore
          .onKeyUp({ key: 'Enter', currentTarget: { value: 'Maarten' } });

        expect(onChangeSpy).toBeCalledTimes(1);
        expect(onChangeSpy).toBeCalledWith('Maarten');
      });

      it('should on letters other "ENTER" wait for the debounce', () => {
        const { searchInput, onChangeSpy } = setup({ showIcon: true });

        // @ts-ignore
        searchInput
          .find(Input)
          .props()
          // @ts-ignore
          .onKeyUp({ key: 'a', currentTarget: { value: 'Maarten' } });

        expect(onChangeSpy).toBeCalledTimes(0);
      });
    });
  });
});
