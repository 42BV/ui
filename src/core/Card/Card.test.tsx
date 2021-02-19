import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import RadioGroup from '../../form/RadioGroup/RadioGroup';

import { Card } from './Card';

describe('Component: Card', () => {
  function setup({
    hasHeader = true,
    hasFooter = true
  }: {
    hasHeader?: boolean;
    hasFooter?: boolean;
  }) {
    const props = {
      header: hasHeader ? 'A simple header' : undefined,
      footer: hasFooter ? 'A simple footer' : undefined
    };

    const children = (
      <RadioGroup<string>
        onChange={jest.fn()}
        options={['local', 'development', 'test', 'acceptation', 'production']}
        labelForOption={(v) => v}
      />
    );

    const card = shallow(<Card {...props}>{children}</Card>);

    return { card };
  }

  describe('ui', () => {
    test('basic', () => {
      const { card } = setup({});

      expect(toJson(card)).toMatchSnapshot('Component: Card => ui => basic');
    });

    test('without header', () => {
      const { card } = setup({ hasHeader: false });

      expect(toJson(card)).toMatchSnapshot(
        'Component: Card => ui => without header'
      );
    });

    test('without footer', () => {
      const { card } = setup({ hasFooter: false });

      expect(toJson(card)).toMatchSnapshot(
        'Component: Card => ui => without footer'
      );
    });
  });
});
