import { render } from '@testing-library/react';

import { RadioGroup } from '../../form/RadioGroup/RadioGroup';

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
        label="Environment"
      />
    );

    const { container } = render(<Card {...props}>{children}</Card>);

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
});
