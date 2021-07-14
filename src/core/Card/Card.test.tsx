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
      footer: hasFooter ? 'A simple footer' : undefined,
      cardHeaderClassName: 'card-header',
      cardBodyClassName: 'card-body',
      cardFooterClassName: 'card-footer'
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

  test('deprecated: modalHeaderClassName', () => {
    const card = shallow(<Card header="test" modalHeaderClassName="deprecated classes">This is the content</Card>);
    expect(toJson(card)).toMatchSnapshot(
      'Component: Card => deprecated: modalHeaderClassName'
    );
  });

  test('deprecated: modalBodyClassName', () => {
    const card = shallow(<Card modalBodyClassName="deprecated classes">This is the content</Card>);
    expect(toJson(card)).toMatchSnapshot(
      'Component: Card => deprecated: modalBodyClassName'
    );
  });

  test('deprecated: modalFooterClassName', () => {
    const card = shallow(<Card footer="test" modalFooterClassName="deprecated classes">This is the content</Card>);
    expect(toJson(card)).toMatchSnapshot(
      'Component: Card => deprecated: modalFooterClassName'
    );
  });
});
