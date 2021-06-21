import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FormButton } from './FormButton';

describe('Component: FormButton', () => {
  function setup() {
    return shallow(<FormButton formId="test" type="submit" icon="save" />);
  }
  test('ui', () => {
    const formButton = setup();
    expect(toJson(formButton)).toMatchSnapshot();
  });

  describe('events', () => {
    it('should dispatch an event when element with id exists', () => {
      const element = document.createElement('div');
      element.dispatchEvent = jest.fn();
      const getElementByIdSpy = jest
        .spyOn(document, 'getElementById')
        .mockReturnValue(element);

      const formButton = setup();

      // @ts-expect-error Test mock
      formButton
        .find('Button')
        .props()
        // @ts-expect-error Test mock
        .onClick();

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

      const formButton = setup();

      // @ts-expect-error Test mock
      formButton
        .find('Button')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(getElementByIdSpy).toBeCalledTimes(1);
      expect(getElementByIdSpy).toBeCalledWith('test');

      expect(element.dispatchEvent).toBeCalledTimes(0);
    });
  });
});
