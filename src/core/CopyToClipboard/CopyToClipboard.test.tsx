import React from 'react';
import { fireEvent, screen, render, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CopyToClipboard } from './CopyToClipboard';
import { Color } from '../types';

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
    const writeTextSpy = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy
      }
    });

    const { container } = render(
      <CopyToClipboard id={id} className={className} buttonColor={buttonColor} text={text}>
        This is a very long text that should hide behind the copy button at the end of the line.
        It should be horizontally scrollable so you should be able to see the entire line of text,
        but it should not be wrapped to multiple lines, it still has to be one long line of text.
      </CopyToClipboard>
    );

    return { container, writeTextSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with className', () => {
      const { container } = setup({ className: 'extra-class' });
      expect(container.firstChild).toHaveClass('extra-class');
    });

    test('with button color', () => {
      setup({ buttonColor: 'secondary' });
      expect(screen.getByText('content_copy')).toHaveClass('text-secondary');
    });

    test('without button color', () => {
      setup({});
      expect(screen.getByText('content_copy')).toHaveClass('text-primary');
    });

    test('with custom text', () => {
      setup({ text: { copied: '42 the best!' } });
      fireEvent.click(screen.getByText('content_copy'));
      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
      expect(screen.queryByText('42 the best!')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should copy to clipboard when button is clicked', () => {
      const element = document.createElement('div');
      element.innerText = 'Copy this text!';
      const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(element);

      const { writeTextSpy } = setup({ id: 'test' });

      fireEvent.click(screen.getByText('content_copy'));

      expect(getElementByIdSpy).toHaveBeenCalledTimes(1);
      expect(getElementByIdSpy).toHaveBeenCalledWith('test');
      expect(writeTextSpy).toHaveBeenCalledTimes(1);
      expect(writeTextSpy).toHaveBeenCalledWith('Copy this text!');
      expect(screen.queryByText('Copied!')).toBeInTheDocument();
    });

    it('should hide "Copied!" text after a second', async () => {
      expect.assertions(2);

      jest.useFakeTimers();
      setup({});

      fireEvent.click(screen.getByText('content_copy'));

      expect(screen.queryByText('Copied!')).toBeInTheDocument();

      await act(() => {
        jest.runAllTimers();
      });

      expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
    });
  });
});
