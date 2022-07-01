import React from 'react';
import { render } from '@testing-library/react';

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

    const { container } = render(
      <Card {...props}>{children}</Card>
    );

    return { container };
  }

  describe('ui', () => {
    test('basic', () => {
      const { container } = setup({});

      expect(container).toMatchSnapshot('Component: Card => ui => basic');
    });

    test('without header', () => {
      const { container } = setup({ hasHeader: false });

      expect(container).toMatchSnapshot();
    });

    test('without footer', () => {
      const { container } = setup({ hasFooter: false });

      expect(container).toMatchSnapshot();
    });
  });

  test('deprecated: modalHeaderClassName', () => {
    const { container } = render(
      <Card header="test" modalHeaderClassName="deprecated classes">This is the content</Card>
    );
    expect(container).toMatchSnapshot();
  });

  test('deprecated: modalBodyClassName', () => {
    const { container } = render(
      <Card modalBodyClassName="deprecated classes">This is the content</Card>
    );
    expect(container).toMatchSnapshot();
  });

  test('deprecated: modalFooterClassName', () => {
    const { container } = render(
      <Card footer="test" modalFooterClassName="deprecated classes">This is the content</Card>
    );
    expect(container).toMatchSnapshot();
  });
});
