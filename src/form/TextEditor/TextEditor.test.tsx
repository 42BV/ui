import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import TextEditor from './TextEditor';
import userEvent from '@testing-library/user-event';

describe('Component: TextEditor', () => {
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
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();
    const onFocusSpy = jest.fn();

    // Ignore the warnings about deprecated functionality, we will replace Quill sometime in the future
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

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
      label: hasLabel ? 'First name' : undefined
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

    test('with value', () => {
      setup({ value: 'Maarten' });
      expect(screen.queryByText('Maarten')).toBeInTheDocument();
    });

    test('with placeholder', () => {
      const { container } = setup({ hasPlaceholder: true });
      expect(container.firstChild?.firstChild?.lastChild?.firstChild).toHaveAttribute('data-placeholder', 'Please enter your first name');
    });

    test('without placeholder', () => {
      const { container } = setup({ hasPlaceholder: false });
      expect(container.firstChild?.firstChild?.lastChild?.firstChild).not.toHaveAttribute('data-placeholder', 'Please enter your first name');
    });

    test('with label', () => {
      setup({ hasLabel: true });
      expect(screen.queryByText('First name')).toBeInTheDocument();
    });

    test('without label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('First name')).not.toBeInTheDocument();
    });

    test('with modules', () => {
      setup({ hasModules: true });
      expect(screen.queryAllByRole('button').length).toBe(1);
      expect(screen.queryAllByRole('button')[0]).toHaveClass('ql-bold');
    });

    test('without modules', () => {
      setup({ hasModules: false });
      expect(screen.queryAllByRole('button')[1]).toHaveClass('ql-bold');
      expect(screen.queryAllByRole('button')[2]).toHaveClass('ql-italic');
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

      rerender(
        <TextEditor {...newProps} />
      );

      expect(document.querySelector('.ql-editor')?.textContent).toBe('');
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({});

      expect(document.querySelector('.ql-editor')?.textContent).toBe('');

      const newProps = {
        ...props,
        value: 'Maarten'
      };

      rerender(
        <TextEditor {...newProps} />
      );

      expect(document.querySelector('.ql-editor')?.textContent).toBe('Maarten');
    });
  });
});
