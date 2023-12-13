import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TextButton } from './TextButton';

describe('component: TextButton', () => {
  function setup({ className }: { className?: string }) {
    const onClickSpy = jest.fn();
    const { container } = render(
      <TextButton onClick={onClickSpy} className={className}>
        Clear
      </TextButton>
    );

    return { container, onClickSpy };
  }

  describe('ui', () => {
    test('standard', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with custom classname', () => {
      const { container } = setup({ className: 'yolo' });
      expect(container.firstChild).toHaveClass('yolo');
    });
  });

  describe('events', () => {
    it('should when clicked call the onClick callback prop', () => {
      const { onClickSpy } = setup({});

      fireEvent.click(screen.getByRole('button'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
