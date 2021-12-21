import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { CrudHeader } from './CrudHeader';
import { EpicSort } from '../../../EpicTable/widgets/EpicSort/EpicSort';
import Input from '../../../../form/Input/Input';

describe('Component: CrudHeader', () => {
  describe('ui', () => {
    test('default', () => {
      const crudHeader = shallow(
        <CrudHeader width={300}>
          crud header
        </CrudHeader>
      );

      expect(toJson(crudHeader)).toMatchSnapshot();
    });

    test('with resize', () => {
      const crudHeader = mount(
        <CrudHeader width={300} onResize={jest.fn()}>
          epic header
        </CrudHeader>
      );

      expect(toJson(crudHeader)).toMatchSnapshot();
    });

    test('with sort', () => {
      const crudHeader = shallow(
        <CrudHeader width={300} onSort={jest.fn()}>
          crud header
        </CrudHeader>
      );

      expect(toJson(crudHeader)).toMatchSnapshot();
    });

    test('with search', () => {
      const crudHeader = shallow(
        <CrudHeader width={300} onSearch={jest.fn()}>
          crud header
        </CrudHeader>
      );

      expect(toJson(crudHeader)).toMatchSnapshot();
    });

    test('with sort and search', () => {
      const crudHeader = shallow(
        <CrudHeader width={300} onSort={jest.fn()} onSearch={jest.fn()}>
          crud header
        </CrudHeader>
      );

      expect(toJson(crudHeader)).toMatchSnapshot();
    });

    test('with search options', () => {
      const crudHeader = shallow(
        <CrudHeader width={300} onSearch={jest.fn()} options={['crud', 'header']} labelForOption={(option) => option}>
          crud header
        </CrudHeader>
      );

      expect(toJson(crudHeader)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should call onSort when the user clicks the sorting button', () => {
      const onSortSpy = jest.fn();

      const crudHeader = mount(
        <CrudHeader width={300} height={44} onSort={onSortSpy}>
          epic header
        </CrudHeader>
      );

      crudHeader
        .find(EpicSort)
        .props()
        .onChange('ASC');

      expect(onSortSpy).toBeCalledTimes(1);
      expect(onSortSpy).toBeCalledWith('ASC');
    });

    it('should call onSearch when the user types in the search field', () => {
      const onSearchSpy = jest.fn();

      const crudHeader = mount(
        <CrudHeader width={300} height={44} onSearch={onSearchSpy}>
          epic header
        </CrudHeader>
      );

      crudHeader
        .find(Input)
        .props()
        .onChange('test');

      expect(onSearchSpy).toBeCalledTimes(1);
      expect(onSearchSpy).toBeCalledWith('test');
    });
  });
});
