import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { CardOpenClose } from './CardOpenClose';

describe('Component: CardOpenClose', () => {
  function setup({ isOpen }: { isOpen: boolean }) {
    const toggleSpy = jest.fn();

    const cardOpenClose = shallow(
      <CardOpenClose
        header="click this"
        isOpen={isOpen}
        toggle={toggleSpy}
        content={() => (
          <p>
            This is collapsable content that should not be included in the HTML
            when isOpen is false
          </p>
        )}
      />
    );

    return { cardOpenClose, toggleSpy };
  }

  describe('ui', () => {
    test('open', () => {
      const { cardOpenClose } = setup({ isOpen: true });

      expect(toJson(cardOpenClose)).toMatchSnapshot(
        'Component: CardOpenClose => ui => open'
      );
    });

    test('closed', () => {
      const { cardOpenClose } = setup({ isOpen: false });

      expect(toJson(cardOpenClose)).toMatchSnapshot(
        'Component: CardOpenClose => ui => closed'
      );
    });
  });

  describe('events', () => {
    it('should call toggle when the header is clicked', () => {
      const { cardOpenClose, toggleSpy } = setup({ isOpen: false });

      // @ts-expect-error Test mock
      cardOpenClose
        .find('CardHeader')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(toggleSpy).toHaveBeenCalledTimes(1);
    });
  });
});
