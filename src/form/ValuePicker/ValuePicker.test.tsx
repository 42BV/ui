import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Page } from '@42.nl/spring-connect';

import ValuePicker from './ValuePicker';
import { Options } from '../option';

import { User } from '../../test/types';
import * as testUtils from '../../test/utils';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  nobodyUser,
  randomUser,
  userUser
} from '../../test/fixtures';
import { act } from 'react-dom/test-utils';

describe('Component: ValuePicker', () => {
  let valuePicker: ReactWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;

  function setup({
    options,
    multiple
  }: {
    options: Options<User>;
    multiple: true | false;
    value?: User | User[];
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    valuePicker = mount(
      <ValuePicker<User>
        multiple={multiple}
        id="bestFriend"
        label="Best friend"
        placeholder="Select your best friend"
        icon="face"
        canSearch={true}
        options={options}
        labelForOption={(user: User) => user.email}
        value={undefined}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
      />
    );
  }

  it('should when booting render a loading spinner and request an initial page', () => {
    const { promise } = testUtils.resolvablePromise<Page<User>>();
    const fetchOptionsSpy = jest.fn(({}) => promise);

    setup({ options: fetchOptionsSpy, multiple: false });

    expect(valuePicker.find('Spinner').exists()).toBe(true);
    expect(toJson(valuePicker)).toMatchSnapshot();

    expect(fetchOptionsSpy).toBeCalledTimes(1);
    expect(fetchOptionsSpy).toBeCalledWith({ query: '', page: 1, size: 1 });
  });

  describe('single', () => {
    describe('when RadioGroup', () => {
      it('should render a `RadioGroup` component when async page `totalElements` is less than 4', async (done) => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContentAndExactSize([
            adminUser(),
            coordinatorUser(),
            userUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        setup({
          options: fetchOptionsSpy,
          multiple: false
        });

        try {
          await act(async () => {
            await promise;
          });

          valuePicker.update();

          expect(valuePicker.find('RadioGroup').exists()).toBe(true);
          expect(toJson(valuePicker)).toMatchSnapshot();

          expect(fetchOptionsSpy).toBeCalledTimes(2);
          expect(fetchOptionsSpy).toBeCalledWith({
            query: '',
            page: 1,
            size: 1
          });
          expect(fetchOptionsSpy).toHaveBeenLastCalledWith({
            query: '',
            page: 1,
            size: 10
          });

          done();
        } catch (e) {
          console.error(e);
          done.fail();
        }
      });

      it('should render a `RadioGroup` component when options array length is less than 4', () => {
        setup({
          options: listOfUsers(),
          multiple: false
        });

        valuePicker.update();

        expect(valuePicker.find('RadioGroup').exists()).toBe(true);
      });
    });

    describe('when Select', () => {
      it('should render a `Select` component when async page `totalElements` is less than 11 but more than 3', async (done) => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContentAndExactSize([
            adminUser(),
            coordinatorUser(),
            userUser(),
            nobodyUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        setup({
          options: fetchOptionsSpy,
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
          expect(fetchOptionsSpy).toBeCalledWith({
            query: '',
            page: 1,
            size: 1
          });
          expect(fetchOptionsSpy).toHaveBeenLastCalledWith({
            query: '',
            page: 1,
            size: 10
          });

          done();
        } catch (e) {
          console.error(e);
          done.fail();
        }
      });

      it('should render a `Select` component when options array length is less than 11 but more than 3', () => {
        setup({
          options: [adminUser(), coordinatorUser(), userUser(), nobodyUser()],
          multiple: false
        });

        valuePicker.update();

        expect(valuePicker.find('Select').exists()).toBe(true);
      });
    });

    describe('when ModalPickerSingle', () => {
      it('should render a `ModalPickerSingle` when async page `totalElements` is more than than 10', async (done) => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContent([
            adminUser(),
            coordinatorUser(),
            userUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        setup({
          options: fetchOptionsSpy,
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
          expect(fetchOptionsSpy).toBeCalledWith({
            query: '',
            page: 1,
            size: 1
          });
          expect(fetchOptionsSpy).toHaveBeenLastCalledWith({
            query: '',
            page: 1,
            size: 10
          });

          done();
        } catch (e) {
          console.error(e);
          done.fail();
        }
      });

      it('should render a `ModalPickerSingle` component when options array length is more than than 10', () => {
        setup({
          options: [
            adminUser(),
            coordinatorUser(),
            userUser(),
            nobodyUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser()
          ],
          multiple: false
        });

        valuePicker.update();

        expect(valuePicker.find('ModalPickerSingle').exists()).toBe(true);
      });
    });
  });

  describe('multiple', () => {
    describe('when CheckboxMultipleSelect', () => {
      it('should render a `CheckboxMultipleSelect` component async page `totalElements` is less than 11', async (done) => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContentAndExactSize([
            adminUser(),
            coordinatorUser(),
            userUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        setup({
          options: fetchOptionsSpy,
          multiple: true
        });

        try {
          await act(async () => {
            await promise;
          });

          valuePicker.update();

          expect(valuePicker.find('CheckboxMultipleSelect').exists()).toBe(
            true
          );
          expect(toJson(valuePicker)).toMatchSnapshot();

          expect(fetchOptionsSpy).toBeCalledTimes(2);
          expect(fetchOptionsSpy).toBeCalledWith({
            query: '',
            page: 1,
            size: 1
          });
          expect(fetchOptionsSpy).toHaveBeenLastCalledWith({
            query: '',
            page: 1,
            size: 100
          });

          done();
        } catch (e) {
          console.error(e);
          done.fail();
        }
      });

      it('should render a `CheckboxMultipleSelect` component when options array length is less than 11', () => {
        setup({
          options: [
            adminUser(),
            coordinatorUser(),
            userUser(),
            nobodyUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser()
          ],
          multiple: true
        });

        valuePicker.update();

        expect(valuePicker.find('CheckboxMultipleSelect').exists()).toBe(true);
      });
    });

    describe('when ModalPickerMultiple', () => {
      it('should render a `ModalPickerMultiple` async page `totalElements` is more than 10', async (done) => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContent([
            adminUser(),
            coordinatorUser(),
            userUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        setup({
          options: fetchOptionsSpy,
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
          expect(fetchOptionsSpy).toBeCalledWith({
            query: '',
            page: 1,
            size: 1
          });
          expect(fetchOptionsSpy).toHaveBeenLastCalledWith({
            query: '',
            page: 1,
            size: 10
          });

          done();
        } catch (e) {
          console.error(e);
          done.fail();
        }
      });

      it('should render a `ModalPickerMultiple` component when options array length is more than 10', () => {
        setup({
          options: [
            adminUser(),
            coordinatorUser(),
            userUser(),
            nobodyUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser(),
            randomUser()
          ],
          multiple: true
        });

        valuePicker.update();

        expect(valuePicker.find('ModalPickerMultiple').exists()).toBe(true);
      });
    });
  });
});
