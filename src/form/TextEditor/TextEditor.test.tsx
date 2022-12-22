import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { TextEditor } from './TextEditor';
import userEvent from '@testing-library/user-event';

describe.skip('Component: TextEditor', () => {
  function setup({
    value,
    hasPlaceholder,
    hasLabel,
    hasModules,
    formats
  }: {
    value?: string;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    hasModules?: boolean;
    formats?: string[];
  }) {
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();
    const onFocusSpy = vi.fn();

    // Ignore the warnings about deprecated functionality, we will replace Quill sometime in the future
    vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    const props = {
      placeholder: hasPlaceholder ? 'Please enter your first name' : undefined,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      onFocus: onFocusSpy,
      error: 'Some error',
      valid: true,
      modules: hasModules
        ? {
            toolbar: ['bold']
          }
        : undefined,
      formats,
      id: hasLabel ? 'firstName' : undefined,
      label: 'First name',
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(
      <TextEditor color="success" {...props} />
    );

    return { container, props, rerender, onChangeSpy, onFocusSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({ value: 'Maarten' });
      expect(container).toMatchSnapshot();
    });

    test('with value', async () => {
      expect.assertions(0);
      setup({ value: 'Maarten' });
      await screen.findByText('Maarten');
    });

    test('with placeholder', () => {
      const { container } = setup({ hasPlaceholder: true });
      expect(
        // @ts-expect-error HTMLElement has property getAttribute
        container.firstChild?.firstChild?.lastChild?.firstChild?.getAttribute(
          'data-placeholder'
        )
      ).toBe('Please enter your first name');
    });

    test('without placeholder', () => {
      const { container } = setup({ hasPlaceholder: false });
      expect(
        // @ts-expect-error HTMLElement has property getAttribute
        container.firstChild?.firstChild?.lastChild?.firstChild?.getAttribute(
          'data-placeholder'
        )
      ).not.toBe('Please enter your first name');
    });

    test('with label', async () => {
      expect.assertions(0);
      setup({ hasLabel: true });
      await screen.findByText('First name');
    });

    test('without label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('First name')).toBeNull();
    });

    test('with modules', () => {
      setup({ hasModules: true });
      expect(screen.queryAllByRole('button').length).toBe(1);
      expect(
        screen.queryAllByRole('button')[0].classList.contains('ql-bold')
      ).toBe(true);
    });

    test('without modules', () => {
      setup({ hasModules: false });
      expect(
        screen.queryAllByRole('button')[1].classList.contains('ql-bold')
      ).toBe(true);
      expect(
        screen.queryAllByRole('button')[2].classList.contains('ql-italic')
      ).toBe(true);
    });

    test('with formats', () => {
      setup({ formats: ['italic'] });
      // We cannot check the formats, but it has to be covered
    });
  });

  describe('events', () => {
    test('onChange', async () => {
      expect.assertions(2);

      const { onChangeSpy } = setup({});

      // @ts-expect-error querySelector will not return null
      await userEvent.type(document.querySelector('.ql-editor'), 'Maarten');

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenLastCalledWith('<p><br></p><p>Maarten</p>');
    });

    test('onFocus', async () => {
      expect.assertions(1);

      const { onFocusSpy } = setup({});

      // @ts-expect-error querySelector will not return null
      await userEvent.click(document.querySelector('.ql-editor'));

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });

    test('onBlur', async () => {
      expect.assertions(1);

      const { onBlurSpy } = setup({ hasLabel: true });

      // @ts-expect-error querySelector will not return null
      await userEvent.type(document.querySelector('.ql-editor'), 'Maarten');
      await userEvent.click(screen.getByText('First name'));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { props, rerender } = setup({ value: 'Maarten' });

      expect(document.querySelector('.ql-editor')?.textContent).toBe('Maarten');

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<TextEditor {...newProps} />);

      expect(document.querySelector('.ql-editor')?.textContent).toBe('');
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({});

      expect(document.querySelector('.ql-editor')?.textContent).toBe('');

      const newProps = {
        ...props,
        value: 'Maarten'
      };

      rerender(<TextEditor {...newProps} />);

      expect(document.querySelector('.ql-editor')?.textContent).toBe('Maarten');
    });
  });
});
