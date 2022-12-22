import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import lodash from 'lodash';

import { Props, SearchInput } from './SearchInput';

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
    const onChangeSpy = vi.fn();

    const props: Props = {
      id: 'search',
      defaultValue: '',
      debounce,
      debounceSettings,
      onChange: onChangeSpy,
      placeholder: 'Search...',
      canClear,
      showIcon: showIcon,
      label: 'Search',
      hiddenLabel: !showLabel,
      children: withChildren ? () => <h1>Children</h1> : undefined
    };

    const { container } = render(<SearchInput {...props} />);

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({ showIcon: undefined });
      expect(container).toMatchSnapshot();
    });

    test('with icon', async () => {
      expect.assertions(0);
      setup({ showIcon: true });
      await screen.queryByText('search');
    });

    test('without icon', () => {
      setup({ showIcon: false });
      expect(screen.queryByText('search')).toBeNull();
    });

    test('with label', async () => {
      expect.assertions(0);
      setup({ showLabel: true });
      await screen.findByText('Search');
      await screen.findByLabelText('Search');
    });

    test('with label and children', async () => {
      expect.assertions(0);
      setup({ withChildren: true });
      await screen.findByText('Children');
    });

    test('with value', async () => {
      expect.assertions(1);

      vi.spyOn(React, 'useRef').mockReturnValueOnce({
        current: { value: 'test' }
      });

      const { container } = setup({});

      await screen.findByText('close');
      expect(container).toMatchSnapshot();
    });

    test('without clear button', () => {
      vi.spyOn(React, 'useRef').mockReturnValueOnce({
        current: { value: 'test' }
      });

      setup({ canClear: false });

      expect(screen.queryByText('close')).toBeNull();
    });
  });

  describe('events', () => {
    it('should debounce by 500 by default', () => {
      const debounceSpy = vi
        .spyOn(lodash, 'debounce')
        // @ts-expect-error Test mock
        .mockImplementation((fn, debounce) => {
          expect(debounce).toBe(500);
          return fn;
        });

      const { onChangeSpy } = setup({
        showIcon: true,
        showLabel: true
      });

      fireEvent.change(screen.getByLabelText('Search'), {
        target: { value: 'Maarten' }
      });

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('Maarten');

      expect(debounceSpy).toBeCalledTimes(2);
      expect(debounceSpy.mock.calls[0][1]).toBe(500);
      expect(debounceSpy.mock.calls[0][2]).toBe(undefined);
    });

    it('should be able to debounce with a custom value', () => {
      const debounceSpy = vi
        .spyOn(lodash, 'debounce')
        // @ts-expect-error Test mock
        .mockImplementation((fn, debounce) => {
          expect(debounce).toBe(10);
          return fn;
        });

      const { onChangeSpy } = setup({
        showIcon: true,
        showLabel: true,
        debounce: 10
      });

      fireEvent.change(screen.getByLabelText('Search'), {
        target: { value: 'Maarten' }
      });

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('Maarten');

      expect(debounceSpy).toBeCalledTimes(2);
      expect(debounceSpy.mock.calls[0][1]).toBe(10);
    });

    it('should debounce with settings when settings are defined', () => {
      const debounceSpy = vi
        .spyOn(lodash, 'debounce')
        // @ts-expect-error Test mock
        .mockImplementation((fn, debounce) => {
          expect(debounce).toBe(500);
          return fn;
        });

      const debounceSettings = { leading: true, trailing: false };

      const { onChangeSpy } = setup({
        showIcon: true,
        showLabel: true,
        debounceSettings
      });

      fireEvent.change(screen.getByLabelText('Search'), {
        target: { value: 'M' }
      });

      // Trailing will cause the first character to go through immediately
      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('M');

      expect(debounceSpy).toBeCalledTimes(2);
      expect(debounceSpy.mock.calls[0][2]).toBe(debounceSettings);
    });

    it('should allow the user to take full control of the value through the children render prop', async () => {
      expect.assertions(4);

      const onChangeSpy = vi.fn();
      const cancel = vi.fn();

      // @ts-expect-error Test mock
      vi.spyOn(lodash, 'debounce').mockImplementation((fn) => {
        // @ts-expect-error Test mock
        fn.cancel = cancel;
        return fn;
      });

      render(
        <SearchInput
          label="Search"
          defaultValue=""
          debounce={300}
          onChange={onChangeSpy}
          showIcon={true}
        >
          {(searchInput, { setValue }) => {
            // At this time the ref is null, so it won't be called
            setValue('not called');

            setTimeout(() => {
              setValue('external change');
            }, 0);

            return searchInput;
          }}
        </SearchInput>
      );

      expect(await screen.findByDisplayValue('external change')).toBeDefined();

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith('external change');

      expect(cancel).toBeCalledTimes(1);
    });

    describe('onKeyUp behavior', () => {
      it('should on pressing "ENTER" set the value immediately', () => {
        // @ts-expect-error Test mock
        vi.spyOn(lodash, 'debounce').mockImplementation((fn) => {
          return fn;
        });

        const { onChangeSpy } = setup({
          showLabel: true
        });

        fireEvent.change(screen.getByLabelText('Search'), {
          target: { value: 'Maarten' }
        });

        expect(onChangeSpy).toBeCalledTimes(1);
        expect(onChangeSpy).toBeCalledWith('Maarten');

        fireEvent.keyUp(screen.getByLabelText('Search'), { key: 'Enter' });

        expect(onChangeSpy).toBeCalledTimes(2);
        expect(onChangeSpy).toBeCalledWith('Maarten');
      });

      it('should on letters other than "ENTER" wait for the debounce', () => {
        const { onChangeSpy } = setup({
          showIcon: true,
          showLabel: true
        });

        fireEvent.keyUp(screen.getByLabelText('Search'), {
          key: 'a',
          currentTarget: { value: 'Maarten' }
        });

        expect(onChangeSpy).toBeCalledTimes(0);
      });
    });

    it('should clear value when clear icon is clicked', () => {
      vi.spyOn(React, 'useRef').mockReturnValueOnce({
        current: { value: 'test' }
      });

      const debounceCancelSpy = vi.fn();

      // @ts-expect-error Test mock
      vi.spyOn(lodash, 'debounce').mockImplementation((fn) => {
        // @ts-expect-error Test mock
        fn.cancel = debounceCancelSpy;
        return fn;
      });

      const { onChangeSpy } = setup({});

      fireEvent.click(screen.getByText('close'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('');

      expect(debounceCancelSpy).toHaveBeenCalledTimes(1);
    });
  });
});
