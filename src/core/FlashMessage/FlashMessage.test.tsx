import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FlashMessage } from './FlashMessage';

describe('Component: FlashMessage', () => {
  describe('ui', () => {
    test('normal', () => {
      const { container } = render(
        <FlashMessage color="danger">Danger commander</FlashMessage>
      );

      expect(container).toMatchSnapshot();
    });

    test('with extra css class', () => {
      const { container } = render(
        <FlashMessage className="extra-css-class" color="danger">
          Danger commander
        </FlashMessage>
      );

      expect(container.firstChild).toHaveClass('extra-css-class');
    });
  });

  test('onClose', () => {
    const onCloseSpy = jest.fn();

    render(
      <FlashMessage onClose={onCloseSpy}>Warning commander</FlashMessage>
    );

    fireEvent.click(screen.getByLabelText('Close'));

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});
