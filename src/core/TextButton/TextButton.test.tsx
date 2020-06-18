import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TextButton from './TextButton';

describe('component: TextButton', () => {
  function setup({ className }: { className?: string }) {
    const onClickSpy = jest.fn();
    const textButton = shallow(
      <TextButton onClick={onClickSpy} className={className}>
        Clear
      </TextButton>
    );

    return {
      textButton,
      onClickSpy
    };
  }

  describe('ui', () => {
    test('standard', () => {
      const { textButton } = setup({});

      expect(toJson(textButton)).toMatchSnapshot();
    });

    test('with custom classname', () => {
      const { textButton } = setup({ className: 'yolo' });

      expect(toJson(textButton)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should when clicked call the onClick callback prop', () => {
      const { textButton, onClickSpy } = setup({});

      const event = new Event('click');

      // @ts-ignore
      textButton
        .find('u')
        .props()
        // @ts-ignore
        .onClick(event);

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(event);
    });
  });
});
