import React from 'react';
import { render } from '@testing-library/react';

import { EpicDetail } from './EpicDetail';
import { fireEvent, screen } from '@testing-library/react';

describe('Component: EpicDetail', () => {
  function setup() {
    const onCloseSpy = jest.fn();


    const { container } = render(
      <EpicDetail onClose={onCloseSpy}>
        <h1>children</h1>
      </EpicDetail>
    );

    return { container, onCloseSpy };
  }

  test('ui', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  describe('events', () => {
    it('should call the onClose callback when the close button is clicked', () => {
      const { onCloseSpy } = setup();

      fireEvent.click(screen.getByText('close'));

      expect(onCloseSpy).toBeCalledTimes(1);
    });
  });
});
