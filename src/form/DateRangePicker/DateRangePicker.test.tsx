import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import DateRangePicker, { Value } from './DateRangePicker';

describe('Component: DateRangePicker', () => {
  let dateRangePicker: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onFocusSpy: jest.Mock<any, any>;

  function setup({ value, onFocus }: { value: Value; onFocus: boolean }) {
    onChangeSpy = jest.fn();
    onFocusSpy = jest.fn();

    dateRangePicker = shallow(
      <DateRangePicker
        value={value}
        onChange={onChangeSpy}
        onFocus={onFocus ? onFocusSpy : undefined}
        from={{
          id: 'fromId',
          label: 'From Date',
          placeholder: 'Please enter a From date',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm:ss',
          isDateAllowed: current => current.day() !== 0 && current.day() !== 6
        }}
        to={{
          id: 'toId',
          label: 'To Date',
          placeholder: 'Please enter a To date',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm:ss',
          isDateAllowed: current => current.day() !== 0 && current.day() !== 6
        }}
        color="danger"
        valid={false}
      />
    );
  }

  describe('ui', () => {
    test('no errors', () => {
      setup({
        value: {
          from: new Date(2000, 0, 1, 12, 30, 40),
          to: new Date(2010, 0, 1, 12, 30, 40)
        },
        onFocus: false
      });
      expect(toJson(dateRangePicker)).toMatchSnapshot(
        'Component: DateRangePicker => ui => no errors'
      );
      expect(dateRangePicker.find('div').length).toBe(0);
    });

    test('with errors', () => {
      setup({
        value: {
          from: new Date(2200, 0, 1, 12, 30, 40),
          to: new Date(2010, 0, 1, 12, 30, 40)
        },
        onFocus: false
      });
      expect(toJson(dateRangePicker)).toMatchSnapshot(
        'Component: DateRangePicker => ui => with errors'
      );
      expect(dateRangePicker.find('FormFeedback').length).toBe(1);
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      it('should send call onChange with the dates if everything is correct', () => {
        setup({
          value: {
            from: undefined,
            to: undefined
          },
          onFocus: false
        });

        const inputs = dateRangePicker.find('DateTimeInput');

        const from = inputs.at(0);
        const to = inputs.at(1);

        const fromDate = new Date(2000, 0, 1, 12, 30, 40);
        const toDate = new Date(2010, 0, 1, 12, 30, 40);

        //@ts-ignore
        from.props().onChange(fromDate);

        //@ts-ignore
        to.props().onChange(toDate);

        expect(onChangeSpy).toBeCalledTimes(2);
        expect(onChangeSpy).toHaveBeenLastCalledWith({
          from: fromDate,
          to: toDate
        });
      });

      it('should when the from date is after the to date call onChange with null, when changing the from date', () => {
        setup({
          value: {
            from: undefined,
            to: new Date(2010, 0, 1, 12, 30, 40)
          },
          onFocus: false
        });

        const from = dateRangePicker.find('DateTimeInput').at(0);

        //@ts-ignore
        from.props().onChange(new Date(2200, 0, 1, 12, 30, 40));

        expect(onChangeSpy).toBeCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);
      });

      it('should when from is undefined are defined call onChange with null, when changing the from date', () => {
        setup({
          value: {
            from: undefined,
            to: new Date(2010, 0, 1, 12, 30, 40)
          },
          onFocus: false
        });

        const from = dateRangePicker.find('DateTimeInput').at(0);

        //@ts-ignore
        from.props().onChange(null);

        expect(onChangeSpy).toBeCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);
      });

      it('should when the from date is after the to date call onChange with null, when changing the from date', () => {
        setup({
          value: {
            from: new Date(2200, 0, 1, 12, 30, 40),
            to: undefined
          },
          onFocus: false
        });

        const from = dateRangePicker.find('DateTimeInput').at(1);

        //@ts-ignore
        from.props().onChange(new Date(2010, 0, 1, 12, 30, 40));

        expect(onChangeSpy).toBeCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);
      });

      it('should when to is undefined are defined call onChange with null, when changing the to date', () => {
        setup({
          value: {
            from: new Date(2010, 0, 1, 12, 30, 40),
            to: undefined
          },
          onFocus: false
        });

        const from = dateRangePicker.find('DateTimeInput').at(1);

        //@ts-ignore
        from.props().onChange(null);

        expect(onChangeSpy).toBeCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);
      });
    });

    describe('onFocus', () => {
      it('should call onFocus when it is defined in the props', () => {
        setup({
          value: {
            from: undefined,
            to: new Date(2010, 0, 1, 12, 30, 40)
          },
          onFocus: true
        });

        const inputs = dateRangePicker.find('DateTimeInput');

        // @ts-ignore
        inputs.at(0).prop('onFocus')();

        expect(onFocusSpy).toBeCalledTimes(1);

        // @ts-ignore
        inputs.at(1).prop('onFocus')();

        expect(onFocusSpy).toBeCalledTimes(2);
      });

      it('should not call onFocus when it is undefined in the props', () => {
        setup({
          value: {
            from: undefined,
            to: new Date(2010, 0, 1, 12, 30, 40)
          },
          onFocus: false
        });

        const inputs = dateRangePicker.find('DateTimeInput');

        // @ts-ignore
        inputs.at(0).prop('onFocus')();

        expect(onFocusSpy).toBeCalledTimes(0);

        // @ts-ignore
        inputs.at(1).prop('onFocus')();

        expect(onFocusSpy).toBeCalledTimes(0);
      });
    });
  });
});
