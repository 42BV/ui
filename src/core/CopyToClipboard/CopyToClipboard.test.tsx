import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { CopyToClipboard } from './CopyToClipboard';
import { Color } from '../types';
import { resolvablePromise } from '../../test/utils';

describe('Component: CopyToClipboard', () => {
  function setup({
    id,
    className,
    buttonColor,
    text
  }: {
    id?: string;
    className?: string;
    buttonColor?: Color;
    text?: { copied: string };
  }) {
    const { promise, resolve } = resolvablePromise();
    const writeTextSpy = vi.fn().mockReturnValue(promise);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy
      }
    });

    const { container } = render(
      <CopyToClipboard
        id={id}
        className={className}
        buttonColor={buttonColor}
        text={text}
      >
        This is a very long text that should hide behind the copy button at the
        end of the line. It should be horizontally scrollable so you should be
        able to see the entire line of text, but it should not be wrapped to
        multiple lines, it still has to be one long line of text.
      </CopyToClipboard>
    );

    return { container, writeTextSpy, resolve };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with className', () => {
      const { container } = setup({ className: 'extra-class' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('extra-class')).toBe(true);
    });

    test('with button color', () => {
      setup({ buttonColor: 'secondary' });
      expect(
        screen.getByText('content_copy').classList.contains('text-secondary')
      ).toBe(true);
    });

    test('without button color', () => {
      setup({});
      expect(
        screen.getByText('content_copy').classList.contains('text-primary')
      ).toBe(true);
    });

    test('with custom text', async () => {
      expect.assertions(1);

      const { resolve } = setup({ text: { copied: '42 the best!' } });

      fireEvent.click(screen.getByText('content_copy'));

      resolve();

      await screen.findByText('42 the best!');

      expect(screen.queryByText('Copied!')).toBeNull();
    });
  });

  describe('events', () => {
    it('should copy to clipboard when button is clicked', async () => {
      expect.assertions(4);

      const element = document.createElement('div');
      element.innerText = 'Copy this text!';
      const getElementByIdSpy = vi
        .spyOn(document, 'getElementById')
        .mockReturnValue(element);

      const { writeTextSpy, resolve } = setup({ id: 'test' });

      fireEvent.click(screen.getByText('content_copy'));

      resolve();

      await screen.findByText('Copied!');

      expect(getElementByIdSpy).toHaveBeenCalledTimes(1);
      expect(getElementByIdSpy).toHaveBeenCalledWith('test');
      expect(writeTextSpy).toHaveBeenCalledTimes(1);
      expect(writeTextSpy).toHaveBeenCalledWith('Copy this text!');
    });

    it('should hide "Copied!" text after a second', async () => {
      expect.assertions(1);

      vi.useFakeTimers();
      const { resolve } = setup({});

      fireEvent.click(screen.getByText('content_copy'));

      resolve();

      await screen.findByText('Copied!');

      await act(() => {
        vi.runAllTimers();
      });

      expect(screen.queryByText('Copied!')).toBeNull();
    });
  });
});
