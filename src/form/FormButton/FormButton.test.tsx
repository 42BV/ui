import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormButton } from './FormButton';

describe('Component: FormButton', () => {
  function setup() {
    const { container } = render(
      <FormButton formId="test" type="submit" icon="save">
        Save
      </FormButton>
    );
    
    return { container };
  }
  
  test('ui', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  describe('events', () => {
    it('should dispatch an event when element with id exists', () => {
      const element = document.createElement('div');
      element.dispatchEvent = jest.fn();
      const getElementByIdSpy = jest
        .spyOn(document, 'getElementById')
        .mockReturnValue(element);

      setup();

      fireEvent.click(screen.getByRole('button'));

      expect(getElementByIdSpy).toBeCalledTimes(1);
      expect(getElementByIdSpy).toBeCalledWith('test');

      expect(element.dispatchEvent).toBeCalledTimes(1);
      expect(element.dispatchEvent).toBeCalledWith(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    });

    it('should not dispatch an event when element with id does not exist', () => {
      const element = document.createElement('div');
      element.dispatchEvent = jest.fn();
      const getElementByIdSpy = jest.spyOn(document, 'getElementById');

      setup();

      fireEvent.click(screen.getByRole('button'));

      expect(getElementByIdSpy).toBeCalledTimes(1);
      expect(getElementByIdSpy).toBeCalledWith('test');

      expect(element.dispatchEvent).toBeCalledTimes(0);
    });
  });
});
