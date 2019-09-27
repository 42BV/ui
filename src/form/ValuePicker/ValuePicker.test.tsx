import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Page } from '@42.nl/spring-connect';

import ValuePicker from './ValuePicker';
import { FetchOptionsCallback } from '../types';

import { User } from '../../test/types';
import * as testUtils from '../../test/utils';
import { adminUser, coordinatorUser, userUser } from '../../test/fixtures';
import { act } from 'react-dom/test-utils';

describe('Component: ValuePicker', () => {
  let valuePicker: ReactWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({
    fetchOptions,
    multiple
  }: {
    fetchOptions: FetchOptionsCallback<User>;
    multiple: true | false;
    value?: User | User[];
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    valuePicker = mount(
      // @ts-ignore
      <ValuePicker<User>
        multiple={multiple}
        id="bestFriend"
        label="Best friend"
        placeholder="Select your best friend"
        canSearch={true}
        fetchOptions={fetchOptions}
        optionForValue={(user: User) => user.email}
        value={undefined}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
      />
    );
  }

  it('should when booting render a loading spinner and request an initial page', () => {
    const { promise } = testUtils.resolvablePromise<Page<User>>();

    const fetchOptionsSpy = jest.fn(() => promise);

    setup({ fetchOptions: fetchOptionsSpy, multiple: false });

    expect(valuePicker.find('Spinner').exists()).toBe(true);
    expect(toJson(valuePicker)).toMatchSnapshot();

    expect(fetchOptionsSpy).toBeCalledTimes(1);
    expect(fetchOptionsSpy).toBeCalledWith('', 1, 1);
  });

  describe('single', () => {
    it('should render a `Select` component when `totalElements` is less than 11', async done => {
      const promise = Promise.resolve(
        testUtils.pageWithContentAndExactSize([
          adminUser,
          coordinatorUser,
          userUser
        ])
      );

      const fetchOptionsSpy = jest.fn(() => promise);

      setup({
        fetchOptions: fetchOptionsSpy,
        multiple: false
      });

      try {
        await act(async () => {
          await promise;
        });

        valuePicker.update();

        expect(valuePicker.find('Select').exists()).toBe(true);
        expect(toJson(valuePicker)).toMatchSnapshot();

        expect(fetchOptionsSpy).toBeCalledTimes(2);
        expect(fetchOptionsSpy).toBeCalledWith('', 1, 1);
        expect(fetchOptionsSpy).toHaveBeenLastCalledWith('', 1, 10);

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });

    it('should render a `ModalPickerSingle` when `totalElements` is less than 11', async done => {
      const promise = Promise.resolve(
        testUtils.pageWithContent([adminUser, coordinatorUser, userUser])
      );

      const fetchOptionsSpy = jest.fn(() => promise);

      setup({
        fetchOptions: fetchOptionsSpy,
        multiple: false
      });

      try {
        await act(async () => {
          await promise;
        });

        valuePicker.update();

        expect(valuePicker.find('ModalPickerSingle').exists()).toBe(true);
        expect(toJson(valuePicker)).toMatchSnapshot();

        expect(fetchOptionsSpy).toBeCalledTimes(2);
        expect(fetchOptionsSpy).toBeCalledWith('', 1, 1);
        expect(fetchOptionsSpy).toHaveBeenLastCalledWith('', 1, 10);

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });
  });

  describe('multiple', () => {
    it('should render a `CheckboxMultipleSelect` component when `totalElements` is less than 11', async done => {
      const promise = Promise.resolve(
        testUtils.pageWithContentAndExactSize([
          adminUser,
          coordinatorUser,
          userUser
        ])
      );

      const fetchOptionsSpy = jest.fn(() => promise);

      setup({
        fetchOptions: fetchOptionsSpy,
        multiple: true
      });

      try {
        await act(async () => {
          await promise;
        });

        valuePicker.update();

        expect(valuePicker.find('CheckboxMultipleSelect').exists()).toBe(true);
        expect(toJson(valuePicker)).toMatchSnapshot();

        expect(fetchOptionsSpy).toBeCalledTimes(2);
        expect(fetchOptionsSpy).toBeCalledWith('', 1, 1);
        expect(fetchOptionsSpy).toHaveBeenLastCalledWith('', 1, 10);

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });

    it('should render a `ModalPickerMultiple` when `totalElements` is less than 11', async done => {
      const promise = Promise.resolve(
        testUtils.pageWithContent([adminUser, coordinatorUser, userUser])
      );

      const fetchOptionsSpy = jest.fn(() => promise);

      setup({
        fetchOptions: fetchOptionsSpy,
        multiple: true
      });

      try {
        await act(async () => {
          await promise;
        });

        valuePicker.update();

        expect(valuePicker.find('ModalPickerMultiple').exists()).toBe(true);
        expect(toJson(valuePicker)).toMatchSnapshot();

        expect(fetchOptionsSpy).toBeCalledTimes(2);
        expect(fetchOptionsSpy).toBeCalledWith('', 1, 1);
        expect(fetchOptionsSpy).toHaveBeenLastCalledWith('', 1, 10);

        done();
      } catch (e) {
        console.error(e);
        done.fail();
      }
    });
  });
});