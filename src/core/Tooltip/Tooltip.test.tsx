import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Tooltip from './Tooltip';

describe('Component: Tooltip', () => {
  describe('ui', () => {
    test('default', () => {
      const tooltip = shallow(
        <Tooltip content={<> Tooltip Content </>}>
          <div>The tooltip should be wrapped around this div, in a span</div>
        </Tooltip>
      );
      expect(toJson(tooltip)).toMatchSnapshot(
        'Component: Tooltip => ui => default'
      );
    });

    test('with custom tag', () => {
      const tooltip = shallow(
        <Tooltip tag="div" content="Tooltip content">
          <div>The tooltip should be wrapped around this div, in a div</div>
        </Tooltip>
      );
      expect(toJson(tooltip)).toMatchSnapshot(
        'Component: Tooltip => ui => with tag'
      );
    });

    test('with class', () => {
      const tooltip = shallow(
        <Tooltip className="extra-classnames" content={<> Tooltip content </>}>
          <div>The tooltip should be wrapped around this div, in a div</div>
        </Tooltip>
      );
      expect(tooltip.find('span').props().className).toBe('extra-classnames');
    });

    test('with style', () => {
      const tooltip = mount(
        <Tooltip
          style={{ marginTop: 5, padding: 10 }}
          content={<> Tooltip content </>}
        >
          <div>The tooltip should be wrapped around this div, in a div</div>
        </Tooltip>
      );

      //Test is the concat of the 'outline:0' css property goes well with additional provided css properties.
      expect(tooltip.find('span').props().style).toEqual({
        outline: 0,
        marginTop: 5,
        padding: 10
      });
    });
  });

  test('with style, override outline', () => {
    const tooltip = mount(
      <Tooltip style={{ outline: 20 }} content={<> Tooltip content </>}>
        <div>The tooltip should be wrapped around this div, in a div</div>
      </Tooltip>
    );

    //Test if the outline is overriden when specified
    expect(tooltip.find('span').props().style).toEqual({ outline: 20 });
  });
});
