import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Page } from '@42.nl/spring-connect';

import { ValuePicker } from './ValuePicker';
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

describe('Component: ValuePicker', () => {
  function setup({
    options,
    multiple,
    canClear
  }: {
    options: Options<User>;
    multiple: boolean;
    value?: User | User[];
    canClear?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const { container, asFragment } = render(
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
        canClear={canClear}
      />
    );

    return { container, asFragment, onChangeSpy, onBlurSpy };
  }

  it('should when booting render a loading spinner and request an initial page', () => {
    const { promise } = testUtils.resolvablePromise<Page<User>>();
    const fetchOptionsSpy = jest.fn(({}) => promise);

    const { container } = setup({ options: fetchOptionsSpy, multiple: false });

    expect(container).toMatchSnapshot();

    expect(fetchOptionsSpy).toBeCalledTimes(1);
    expect(fetchOptionsSpy).toBeCalledWith({ query: '', page: 1, size: 1 });
  });

  describe('single', () => {
    describe('RadioGroup', () => {
      it('should render a `RadioGroup` component when async page `totalElements` is less than 4', async () => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContentAndExactSize([
            adminUser(),
            coordinatorUser(),
            userUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        const { asFragment } = setup({
          options: fetchOptionsSpy,
          multiple: false
        });

        await act(async () => {
          await promise;
        });

        expect(screen.queryAllByRole('radio').length).toBe(3);
        expect(asFragment()).toMatchSnapshot();

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
      });

      it('should render a `RadioGroup` component when options array length is less than 4', () => {
        setup({
          options: listOfUsers(),
          multiple: false
        });

        expect(screen.queryAllByRole('radio').length).toBe(3);
      });

      it('should render a `RadioGroup` component without clear button', () => {
        setup({
          options: listOfUsers(),
          multiple: false,
          canClear: false
        });

        expect(screen.queryByText('Clear')).not.toBeInTheDocument();
      });
    });

    describe('Select', () => {
      it('should render a `Select` component when async page `totalElements` is less than 11 but more than 3', async () => {
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

        const { asFragment } = setup({
          options: fetchOptionsSpy,
          multiple: false
        });

        await act(async () => {
          await promise;
        });

        expect(screen.queryByRole('combobox')).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();

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
      });

      it('should render a `Select` component when options array length is less than 11 but more than 3', () => {
        setup({
          options: [adminUser(), coordinatorUser(), userUser(), nobodyUser()],
          multiple: false
        });

        expect(screen.queryByRole('combobox')).toBeInTheDocument();
      });
    });

    describe('ModalPickerSingle', () => {
      it('should render a `ModalPickerSingle` when async page `totalElements` is more than than 10', async () => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContent([
            adminUser(),
            coordinatorUser(),
            userUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        const { asFragment } = setup({
          options: fetchOptionsSpy,
          multiple: false
        });

        await act(async () => {
          await promise;
        });

        expect(screen.queryByRole('button')).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();

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

        expect(screen.queryByRole('button')).toBeInTheDocument();
      });

      it('should render a `ModalPickerSingle` component without clear button', () => {
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
          multiple: false,
          canClear: false
        });

        expect(screen.queryByText('Clear')).not.toBeInTheDocument();
      });
    });
  });

  describe('multiple', () => {
    describe('CheckboxMultipleSelect', () => {
      it('should render a `CheckboxMultipleSelect` component when async page `totalElements` is less than 11', async () => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContentAndExactSize([
            adminUser(),
            coordinatorUser(),
            userUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        const { asFragment } = setup({
          options: fetchOptionsSpy,
          multiple: true
        });

        await act(async () => {
          await promise;
        });

        expect(screen.queryAllByRole('checkbox').length).toBe(3);
        expect(asFragment()).toMatchSnapshot();

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

        expect(screen.queryAllByRole('checkbox').length).toBe(10);
      });
    });

    describe('ModalPickerMultiple', () => {
      it('should render a `ModalPickerMultiple` when async page `totalElements` is more than 10', async () => {
        expect.assertions(5);

        const promise = Promise.resolve(
          testUtils.pageWithContent([
            adminUser(),
            coordinatorUser(),
            userUser()
          ])
        );

        const fetchOptionsSpy = jest.fn(({}) => promise);

        const { asFragment } = setup({
          options: fetchOptionsSpy,
          multiple: true
        });

        await act(async () => {
          await promise;
        });

        expect(screen.queryByRole('button')).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();

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

        expect(screen.queryByRole('button')).toBeInTheDocument();
      });

      it('should render a `ModalPickerMultiple` component without clear button', () => {
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
          multiple: true,
          canClear: false
        });

        expect(screen.queryByText('Clear')).not.toBeInTheDocument();
      });
    });
  });
});
