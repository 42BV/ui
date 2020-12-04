import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { EpicCell } from './EpicCell';

describe('Component: EpicCell', () => {
  function setup({ hasOnRowClick = true }: { hasOnRowClick?: boolean }) {
    const onRowClickSpy = jest.fn();
    const onHoverChangedSpy = jest.fn();

    const epicCell = shallow(
      <EpicCell
        width={300}
        height={44}
        // @ts-expect-error Test mock
        onRowClick={hasOnRowClick ? onRowClickSpy : undefined}
        onHoverChanged={hasOnRowClick ? onHoverChangedSpy : undefined}
      >
        epic cell
      </EpicCell>
    );

    return { epicCell, onRowClickSpy, onHoverChangedSpy };
  }

  test('ui', () => {
    const { epicCell } = setup({});

    expect(toJson(epicCell)).toMatchSnapshot();
  });

  describe('events', () => {
    describe('onRowClick', () => {
      test(`when onRowClick exists and when clicking the EpicCell's div it should call onRowClick with the event`, () => {
        const { epicCell, onRowClickSpy } = setup({});

        // Will match the useRef initial value of null
        const fakeEvent = { target: null };

        // @ts-expect-error Test mock
        epicCell
          .find('div')
          .props()
          // @ts-expect-error Test mock
          .onClick(fakeEvent);

        expect(onRowClickSpy).toBeCalledTimes(1);
        expect(onRowClickSpy).toBeCalledWith(fakeEvent);
      });

      test(`when onRowClick exists and when not clicking the EpicCell's div it should not call onRowClick`, () => {
        const { epicCell, onRowClickSpy } = setup({});

        // Will not match the useRef initial value of null
        const fakeEvent = { target: 42 };

        // @ts-expect-error Test mock
        epicCell
          .find('div')
          .props()
          // @ts-expect-error Test mock
          .onClick(fakeEvent);

        expect(onRowClickSpy).toBeCalledTimes(0);
      });

      test(`when onRowClick does not exist and when clicking the EpicCell's div it should not call onRowClick`, () => {
        const { epicCell } = setup({ hasOnRowClick: false });

        const onClick = epicCell.find('div').props().onClick;

        expect(onClick).toBe(undefined);
      });
    });

    describe('hover behaviour', () => {
      it('should when onRowClick exists call onHoverChanged when hovering over the div', () => {
        const { epicCell, onHoverChangedSpy } = setup({});

        // @ts-expect-error Test mock
        epicCell
          .find('div')
          .props()
          // @ts-expect-error Test mock
          .onMouseEnter();

        expect(onHoverChangedSpy).toBeCalledTimes(1);
        expect(onHoverChangedSpy).toBeCalledWith(true);

        // @ts-expect-error Test mock
        epicCell
          .find('div')
          .props()
          // @ts-expect-error Test mock
          .onMouseLeave();

        expect(onHoverChangedSpy).toBeCalledTimes(2);
        expect(onHoverChangedSpy).toBeCalledWith(false);
      });

      it('should when onRowClick does not exist not call onHoverChanged when hovering over the div', () => {
        const { epicCell } = setup({ hasOnRowClick: false });

        const { onMouseEnter, onMouseLeave } = epicCell.find('div').props();

        expect(onMouseEnter).toBe(undefined);
        expect(onMouseLeave).toBe(undefined);
      });
    });
  });
});
