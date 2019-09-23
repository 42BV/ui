/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import FlashMessage from './FlashMessage';

describe('Component: FlashMessage', () => {
  describe('ui', () => {
    test('normal', () => {
      const flashMessage = shallow(
        <FlashMessage color="danger">Danger commander</FlashMessage>
      );
  
      expect(toJson(flashMessage)).toMatchSnapshot();
    });

    test('with extra css class', () => {
      const flashMessage = shallow(
        <FlashMessage className="extra-css-class" color="danger">Danger commander</FlashMessage>
      );
  
      expect(flashMessage.find('.extra-css-class').exists()).toBe(true);
    });
  })

  test('onClose', () => {
    const onCloseSpy = jest.fn();

    const flashMessage = shallow(
      <FlashMessage onClose={onCloseSpy}>
        Warning commander
      </FlashMessage>
    );

    flashMessage
      .find('Alert')
      .props()
      // @ts-ignore
      .toggle();

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});
