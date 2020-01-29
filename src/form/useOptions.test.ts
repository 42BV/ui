import { renderHook } from '@testing-library/react-hooks';

import { useOptions } from './useOptions';
import {
  userUser,
  coordinatorUser,
  adminUser,
  nobodyUser
} from '../test/fixtures';
import { pageOf } from '../utilities/page/page';

describe('useOptions', () => {
  describe('when optionsOrFetcher is an array', () => {
    test('that the options are used as is and loading is false', () => {
      const config = {
        optionsOrFetcher: [userUser, coordinatorUser, adminUser],
        value: userUser,
        optionForValue: user => user.email,
        isOptionEqual: (a, b) => a.id === b.id
      };

      const { result } = renderHook(() => useOptions(config));

      expect(result.current).toEqual({
        options: [userUser, coordinatorUser, adminUser],
        loading: false
      });
    });

    test('that when the value is set but not in options that it is added to the options on the first place', () => {
      const config = {
        optionsOrFetcher: [userUser, coordinatorUser, adminUser],
        value: nobodyUser,
        optionForValue: user => user.email,
        isOptionEqual: (a, b) => a.id === b.id
      };

      const { result } = renderHook(() => useOptions(config));

      expect(result.current).toEqual({
        options: [nobodyUser, userUser, coordinatorUser, adminUser],
        loading: false
      });
    });
  });

  describe('when optionsOrFetcher is an a function', () => {
    test('that when `optionsOrFetcher` is an a function that the options are fetched', async () => {
      const config = {
        optionsOrFetcher: () =>
          Promise.resolve(pageOf([adminUser, userUser], 1)),
        value: undefined,
        optionForValue: user => user.email,
        isOptionEqual: (a, b) => a.id === b.id
      };

      const { result, waitForNextUpdate } = renderHook(() =>
        useOptions(config)
      );

      expect(result.current).toEqual({
        options: [],
        loading: true
      });

      await waitForNextUpdate();

      expect(result.current).toEqual({
        options: [adminUser, userUser],
        loading: false
      });
    });

    test('that when the value is set but not in options that it is added to the options on the first place', async () => {
      const config = {
        optionsOrFetcher: () =>
          Promise.resolve(pageOf([adminUser, userUser], 1)),
        value: nobodyUser,
        optionForValue: user => user.email,
        isOptionEqual: (a, b) => a.id === b.id
      };

      const { result, waitForNextUpdate } = renderHook(() =>
        useOptions(config)
      );

      expect(result.current).toEqual({
        options: [nobodyUser],
        loading: true
      });

      await waitForNextUpdate();

      expect(result.current).toEqual({
        options: [nobodyUser, adminUser, userUser],
        loading: false
      });
    });
  });
});
