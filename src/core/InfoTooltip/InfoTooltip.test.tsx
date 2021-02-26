import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { InfoTooltip } from './InfoTooltip';
import Spinner from '../Spinner/Spinner';

describe('Component: InfoTooltip', () => {
  function setup({
    tooltip = 'tooltip content',
    size,
    className
  }: {
    tooltip?: React.ReactNode;
    size?: number;
    className?: string;
  }) {
    const props = {
      tooltip,
      size,
      className
    };

    const infoTooltip = shallow(<InfoTooltip {...props} />);

    return { infoTooltip };
  }

  describe('ui', () => {
    test('default', () => {
      const { infoTooltip } = setup({});
      expect(toJson(infoTooltip)).toMatchSnapshot(
        'Component: InfoTooltip => ui => default'
      );
    });

    test('custom content', () => {
      const { infoTooltip } = setup({
        tooltip: <Spinner size={10} color="primary" />
      });
      expect(toJson(infoTooltip)).toMatchSnapshot(
        'Component: InfoTooltip => ui => custom content'
      );
    });

    test('with size', () => {
      const { infoTooltip } = setup({ size: 10 });
      expect(infoTooltip.find('Icon').props().size).toBe(10);
    });
  });
});
