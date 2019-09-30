import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicResize } from './EpicResize';

describe('Component: EpicResize', () => {
  test('ui', () => {
    const epicResize = shallow(<EpicResize width={300} onResize={jest.fn()} />);

    expect(toJson(epicResize)).toMatchSnapshot();
  });

  describe('events', () => {
    it('should resize with a throttle', () => {
      let mouseMove;
      let mouseUp;

      jest.spyOn(window, 'addEventListener').mockImplementation((type, fn) => {
        if (type === 'mousemove') {
          mouseMove = fn;
        } else {
          mouseUp = fn;
        }
      });

      const onResizeSpy = jest.fn();

      const epicResize = mount(
        <EpicResize width={300} onResize={onResizeSpy} />
      );

      epicResize
        .find('div')
        .props()
        // @ts-ignore
        .onMouseDown({ clientX: 300 });

      expect(document.body.style.cursor).toBe('col-resize');
      expect(document.body.classList.contains('user-select-none')).toBe(true);

      const preventDefaultSpy = jest.fn();

      mouseMove({ clientX: 342, preventDefault: preventDefaultSpy });
      expect(onResizeSpy).toBeCalledTimes(1);
      expect(onResizeSpy).toBeCalledWith(342);
      expect(preventDefaultSpy).toBeCalledTimes(1);

      // This should be throttled
      mouseMove({ clientX: 380, preventDefault: preventDefaultSpy });
      expect(onResizeSpy).toBeCalledTimes(1);
      expect(preventDefaultSpy).toBeCalledTimes(2);

      mouseUp();

      expect(document.body.style.cursor).toBe('default');
      expect(document.body.classList.contains('user-select-none')).toBe(false);
    });

    it('should not allow resizing to below the initial width', () => {
      let mouseMove;

      jest.spyOn(window, 'addEventListener').mockImplementation((type, fn) => {
        if (type === 'mousemove') {
          mouseMove = fn;
        }
      });

      const onResizeSpy = jest.fn();

      const epicResize = mount(
        <EpicResize width={300} onResize={onResizeSpy} />
      );

      epicResize
        .find('div')
        .props()
        // @ts-ignore
        .onMouseDown({ clientX: 300 });

      expect(document.body.style.cursor).toBe('col-resize');
      expect(document.body.classList.contains('user-select-none')).toBe(true);

      const preventDefaultSpy = jest.fn();

      // Should not go below initial width
      mouseMove({ clientX: 280, preventDefault: preventDefaultSpy });
      expect(onResizeSpy).toBeCalledTimes(1);
      expect(onResizeSpy).toBeCalledWith(300);
      expect(preventDefaultSpy).toBeCalledTimes(1);
    });
  });
});
