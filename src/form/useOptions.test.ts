import { act, renderHook } from '@testing-library/react';

import { useOptions } from './useOptions';
import { pageOf } from '../utilities/page/page';
import { range } from 'lodash';
import { emptyPage, Page } from '@42.nl/spring-connect';
import { resolvablePromise } from '../test/utils';

type Option = {
  id: number;
  label: string;
};

function generateOptions(): Option[] {
  return range(1, 10).map((index) => ({
    id: index,
    label: `${index}`
  }));
}

describe('useOptions', () => {
  describe('when options is an array', () => {
    it('should turn the options into a page', () => {
      const { result } = renderHook(() => {
        const options = generateOptions();

        return useOptions({
          options,
          value: undefined,
          labelForOption: (option: Option) => option.label,
          isOptionEqual: (a, b) => a.id === b.id,
          reloadOptions: 'constant',
          query: '',
          pageNumber: 1,
          size: 2,
          optionsShouldAlwaysContainValue: false
        });
      });

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });
    });

    it('should filter case insensitive', () => {
      const { result } = renderHook(() => {
        const options: Option[] = [
          {
            id: 1,
            label: 'Nederland'
          },
          {
            id: 2,
            label: 'Duitsland'
          }
        ];

        return useOptions({
          options,
          labelForOption: (option: Option) => option.label,
          isOptionEqual: (a, b) => a.id === b.id,
          query: 'neder',
          pageNumber: 1,
          size: 2,
          optionsShouldAlwaysContainValue: false
        });
      });

      // should return the country by searching case-insensitive
      expect(result.current).toEqual({
        page: {
          first: true,
          last: true,
          number: 1,
          numberOfElements: 1,
          size: 1,
          totalElements: 1,
          totalPages: 1,
          content: [{ id: 1, label: 'Nederland' }]
        },
        loading: false
      });
    });

    it('should when the reloadOptions changes update the options', () => {
      const { result, rerender } = renderHook(
        ({ reloadOptions }) => {
          const options = generateOptions();

          return useOptions({
            options: reloadOptions === 'all' ? options : [options[0]],
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions,
            query: '',
            pageNumber: 1,
            size: 2,
            optionsShouldAlwaysContainValue: false
          });
        },
        {
          initialProps: {
            reloadOptions: 'all'
          }
        }
      );

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      rerender({ reloadOptions: 'filter' });

      expect(result.current).toEqual({
        page: {
          first: true,
          last: true,
          number: 1,
          numberOfElements: 1,
          size: 1,
          totalElements: 1,
          totalPages: 1,
          content: [{ id: 1, label: '1' }]
        },
        loading: false
      });
    });

    it('should when the query changes apply the query', () => {
      const { result, rerender } = renderHook(
        ({ query }) => {
          const options = generateOptions();

          return useOptions({
            options,
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions: 'constant',
            query,
            pageNumber: 1,
            size: 2,
            optionsShouldAlwaysContainValue: false
          });
        },
        {
          initialProps: {
            query: ''
          }
        }
      );

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      // There should be only 1 match for this label
      rerender({ query: '1' });
      expect(result.current).toEqual({
        page: {
          first: true,
          last: true,
          number: 1,
          numberOfElements: 1,
          size: 1,
          totalElements: 1,
          totalPages: 1,
          content: [{ id: 1, label: '1' }]
        },
        loading: false
      });
    });

    it('should when the pageNumber changes move the page', () => {
      const { result, rerender } = renderHook(
        ({ pageNumber }) => {
          const options = generateOptions();

          return useOptions({
            options,
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions: 'constant',
            query: '',
            pageNumber,
            size: 2,
            optionsShouldAlwaysContainValue: false
          });
        },
        {
          initialProps: {
            pageNumber: 1
          }
        }
      );

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      // Goto the second page
      rerender({ pageNumber: 2 });
      expect(result.current).toEqual({
        page: {
          first: false,
          last: false,
          number: 2,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 3, label: '3' },
            { id: 4, label: '4' }
          ]
        },
        loading: false
      });
    });

    it('should when the size changes update the options', () => {
      expect.assertions(2);

      const { result, rerender } = renderHook(
        ({ size }) => {
          const options = generateOptions();

          return useOptions({
            options,
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions: 'constant',
            query: '',
            pageNumber: 1,
            size,
            optionsShouldAlwaysContainValue: false
          });
        },
        {
          initialProps: {
            size: 2
          }
        }
      );

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      // Request 1 more item this time.
      rerender({ size: 3 });
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 3,
          size: 3,
          totalElements: 9,
          totalPages: 3,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' },
            { id: 3, label: '3' }
          ]
        },
        loading: false
      });
    });

    describe('adding the value to the page content behavior', () => {
      it('it should not prepend the value when optionsShouldAlwaysContainValue is false', () => {
        const { result } = renderHook(
          () => {
            const options = generateOptions();

            return useOptions({
              options,
              value: { id: 1337, label: '1337' },
              labelForOption: (option: Option) => option.label,
              isOptionEqual: (a, b) => a.id === b.id,
              reloadOptions: 'constant',
              query: '',
              pageNumber: 1,
              size: 2,
              optionsShouldAlwaysContainValue: false
            });
          },
          {
            initialProps: { pageNumber: 1 }
          }
        );

        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });
      });

      it('it should not prepend the value when value is falsy', () => {
        const { result } = renderHook(() => {
          const options = generateOptions();

          return useOptions({
            options,
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions: 'constant',
            query: '',
            pageNumber: 1,
            size: 2,
            optionsShouldAlwaysContainValue: true
          });
        });

        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });
      });

      it('it should not prepend the value when value is already in the page', () => {
        const { result } = renderHook(() => {
          const options = generateOptions();

          return useOptions({
            options,
            value: options[0],
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions: 'constant',
            query: '',
            pageNumber: 1,
            size: 2,
            optionsShouldAlwaysContainValue: true
          });
        });

        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });
      });

      it('it should prepend the value when the options is a singular value', () => {
        const { result, rerender } = renderHook(
          ({ pageNumber }) => {
            const options = generateOptions();

            return useOptions({
              options,
              value: { id: 1337, label: '1337' },
              labelForOption: (option: Option) => option.label,
              isOptionEqual: (a, b) => a.id === b.id,
              reloadOptions: 'constant',
              query: '',
              pageNumber,
              size: 2,
              optionsShouldAlwaysContainValue: true
            });
          },
          {
            initialProps: { pageNumber: 1 }
          }
        );

        // Test that the page useState sets the value initially
        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1337, label: '1337' },
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });

        // Test that when the watch changes that the value is appended as well
        rerender({ pageNumber: 2 });

        expect(result.current).toEqual({
          page: {
            first: false,
            last: false,
            number: 2,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1337, label: '1337' },
              { id: 3, label: '3' },
              { id: 4, label: '4' }
            ]
          },
          loading: false
        });
      });

      it('it should prepend all values not in the page when the options is an array', () => {
        const { result, rerender } = renderHook(
          ({ pageNumber }) => {
            const options = generateOptions();

            return useOptions({
              options,
              value: [
                { id: 1, label: 1 }, // Should not be added on the first page
                { id: 1337, label: '1337' }, // Should be added on both pages
                { id: 4242, label: '4242' }, // Should be added on both pages
                { id: 2, label: '2' } // Should not be added on the first page
              ],
              labelForOption: (option: Option) => option.label,
              isOptionEqual: (a, b) => a.id === b.id,
              reloadOptions: 'constant',
              query: '',
              pageNumber,
              size: 2,
              optionsShouldAlwaysContainValue: true
            });
          },
          {
            initialProps: { pageNumber: 1 }
          }
        );

        // Test that the page useState sets the value initially
        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1337, label: '1337' },
              { id: 4242, label: '4242' },
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });

        // Test that when the watch changes that the value is appended as well
        rerender({ pageNumber: 2 });

        expect(result.current).toEqual({
          page: {
            first: false,
            last: false,
            number: 2,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1, label: 1 },
              { id: 1337, label: '1337' },
              { id: 4242, label: '4242' },
              { id: 2, label: '2' },
              { id: 3, label: '3' },
              { id: 4, label: '4' }
            ]
          },
          loading: false
        });
      });
    });
  });

  describe('when options is a fetcher function', () => {
    it('it should fetch the options and set the loading state correctly', async () => {
      expect.assertions(4);

      const { promise, resolve } = resolvablePromise<Page<Option>>();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fetcher = jest.fn(({ size, page }) => {
        return promise;
      });

      const config = {
        options: fetcher,
        value: undefined,
        labelForOption: (option) => option.label,
        isOptionEqual: (a, b) => a.id === b.id,
        query: '',
        pageNumber: 1,
        size: 2,
        optionsShouldAlwaysContainValue: false
      };

      const { result } = renderHook(() => useOptions(config));

      // Should start by loading
      expect(result.current).toEqual({
        page: emptyPage(),
        loading: true
      });

      await act(async () => {
        await resolve(pageOf(generateOptions(), 1, 2));
      });

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(1);
      expect(fetcher).toBeCalledWith({ page: 1, query: '', size: 2 });
    });

    it('should when the reloadOptions changes re-fetch the options and go back in loading state', async () => {
      expect.assertions(8);

      const options = generateOptions();
      const { promise, resolve } = resolvablePromise<Page<Option>>();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fetcher = jest.fn(({ size, page }) => {
        return promise;
      });

      const { result, rerender } = renderHook(
        ({ reloadOptions }) => {
          return useOptions({
            options: fetcher,
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions,
            query: '',
            pageNumber: 1,
            size: 2,
            optionsShouldAlwaysContainValue: false
          });
        },
        {
          initialProps: {
            reloadOptions: 'all'
          }
        }
      );

      // Should start by loading
      expect(result.current).toEqual({
        page: emptyPage(),
        loading: true
      });

      await act(async () => {
        await resolve(pageOf(options, 1, 2));
      });

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(1);
      expect(fetcher).toBeCalledWith({ page: 1, query: '', size: 2 });

      rerender({ reloadOptions: 'filter' });

      // Should go back into loading with the previous page as content.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: true
      });

      await act(async () => {
        await resolve(pageOf(options, 1, 2));
      });

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(2);
      expect(fetcher).toHaveBeenLastCalledWith({ page: 1, query: '', size: 2 });
    });

    it('should when the query changes re-fetch the options and go back in loading state', async () => {
      expect.assertions(8);

      const options = generateOptions();
      const { promise, resolve } = resolvablePromise<Page<Option>>();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fetcher = jest.fn(({ size, page }) => {
        return promise;
      });

      const { result, rerender } = renderHook(
        ({ query }) => {
          return useOptions({
            options: fetcher,
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions: 'constant',
            query,
            pageNumber: 1,
            size: 2,
            optionsShouldAlwaysContainValue: false
          });
        },
        {
          initialProps: {
            query: ''
          }
        }
      );

      // Should start by loading
      expect(result.current).toEqual({
        page: emptyPage(),
        loading: true
      });

      await act(async () => {
        await resolve(pageOf(options, 1, 2));
      });

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(1);
      expect(fetcher).toBeCalledWith({ page: 1, query: '', size: 2 });

      rerender({ query: 'filter' });

      // Should go back into loading with the previous page as content.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: true
      });

      await act(async () => {
        await resolve(pageOf(options, 1, 2));
      });

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(2);
      expect(fetcher).toHaveBeenLastCalledWith({
        page: 1,
        query: 'filter',
        size: 2
      });
    });

    it('should when the pageNumber changes re-fetch the options and go back in loading state', async () => {
      expect.assertions(8);

      const options = generateOptions();
      const { promise: promise1, resolve: resolve1 } =
        resolvablePromise<Page<Option>>();
      const { promise: promise2, resolve: resolve2 } =
        resolvablePromise<Page<Option>>();

      const fetcher = jest
        .fn()
        .mockImplementationOnce(() => promise1)
        .mockImplementationOnce(() => promise2);

      const { result, rerender } = renderHook(
        ({ pageNumber }) => {
          return useOptions({
            options: fetcher,
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions: 'constant',
            query: '',
            pageNumber,
            size: 2,
            optionsShouldAlwaysContainValue: false
          });
        },
        {
          initialProps: {
            pageNumber: 1
          }
        }
      );

      // Should start by loading
      expect(result.current).toEqual({
        page: emptyPage(),
        loading: true
      });

      await act(async () => {
        await resolve1(pageOf(options, 1, 2));
      });

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(1);
      expect(fetcher).toBeCalledWith({ page: 1, query: '', size: 2 });

      rerender({ pageNumber: 2 });

      // Should go back into loading with the previous page as content.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: true
      });

      await act(async () => {
        await resolve2(pageOf(options, 2, 2));
      });

      // Check the next page is loaded
      expect(result.current).toEqual({
        page: {
          first: false,
          last: false,
          number: 2,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 3, label: '3' },
            { id: 4, label: '4' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(2);
      expect(fetcher).toHaveBeenLastCalledWith({ page: 2, query: '', size: 2 });
    });

    it('should when the size changes re-fetch the options and go back in loading state', async () => {
      expect.assertions(8);

      const options = generateOptions();
      const { promise: promise1, resolve: resolve1 } =
        resolvablePromise<Page<Option>>();
      const { promise: promise2, resolve: resolve2 } =
        resolvablePromise<Page<Option>>();

      const fetcher = jest
        .fn()
        .mockImplementationOnce(() => promise1)
        .mockImplementationOnce(() => promise2);

      const { result, rerender } = renderHook(
        ({ size }) => {
          return useOptions({
            options: fetcher,
            value: undefined,
            labelForOption: (option: Option) => option.label,
            isOptionEqual: (a, b) => a.id === b.id,
            reloadOptions: 'constant',
            query: '',
            pageNumber: 1,
            size,
            optionsShouldAlwaysContainValue: false
          });
        },
        {
          initialProps: {
            size: 2
          }
        }
      );

      // Should start by loading
      expect(result.current).toEqual({
        page: emptyPage(),
        loading: true
      });

      await act(async () => {
        await resolve1(pageOf(options, 1, 2));
      });

      // Check if the first page of 5 pages total is given.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(1);
      expect(fetcher).toBeCalledWith({ page: 1, query: '', size: 2 });

      rerender({ size: 3 });

      // Should go back into loading with the previous page as content.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 2,
          size: 2,
          totalElements: 9,
          totalPages: 5,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' }
          ]
        },
        loading: true
      });

      await act(async () => {
        await resolve2(pageOf(options, 1, 3));
      });

      // Request 1 more item this time.
      expect(result.current).toEqual({
        page: {
          first: true,
          last: false,
          number: 1,
          numberOfElements: 3,
          size: 3,
          totalElements: 9,
          totalPages: 3,
          content: [
            { id: 1, label: '1' },
            { id: 2, label: '2' },
            { id: 3, label: '3' }
          ]
        },
        loading: false
      });

      expect(fetcher).toBeCalledTimes(2);
      expect(fetcher).toHaveBeenLastCalledWith({ page: 1, query: '', size: 3 });
    });

    describe('adding the value to the page content behavior', () => {
      it('it should not prepend the value when optionsShouldAlwaysContainValue is false', async () => {
        expect.assertions(1);

        const { promise, resolve } = resolvablePromise<Page<Option>>();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const fetcher = jest.fn(({ size, page }) => {
          return promise;
        });

        const config = {
          options: fetcher,
          value: { id: 1337, label: '1337' },
          labelForOption: (option) => option.label,
          isOptionEqual: (a, b) => a.id === b.id,
          query: '',
          pageNumber: 1,
          size: 2,
          optionsShouldAlwaysContainValue: false
        };

        const { result } = renderHook(() => useOptions(config));

        await act(async () => {
          await resolve(pageOf(generateOptions(), 1, 2));
        });

        // Check if the first page of 5 pages total is given.
        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });
      });

      it('it should not prepend the value when value is falsy', async () => {
        expect.assertions(1);

        const { promise, resolve } = resolvablePromise<Page<Option>>();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const fetcher = jest.fn(({ size, page }) => {
          return promise;
        });

        const config = {
          options: fetcher,
          value: undefined,
          labelForOption: (option) => option.label,
          isOptionEqual: (a, b) => a.id === b.id,
          query: '',
          pageNumber: 1,
          size: 2,
          optionsShouldAlwaysContainValue: true
        };

        const { result } = renderHook(() => useOptions(config));

        await act(async () => {
          await resolve(pageOf(generateOptions(), 1, 2));
        });

        // Check if the first page of 5 pages total is given.
        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });
      });

      it('it should not prepend the value when value is already in the page', async () => {
        expect.assertions(1);

        const { promise, resolve } = resolvablePromise<Page<Option>>();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const fetcher = jest.fn(({ size, page }) => {
          return promise;
        });

        const config = {
          options: fetcher,
          value: { id: 1, label: '1' },
          labelForOption: (option) => option.label,
          isOptionEqual: (a, b) => a.id === b.id,
          query: '',
          pageNumber: 1,
          size: 2,
          optionsShouldAlwaysContainValue: true
        };

        const { result } = renderHook(() => useOptions(config));

        await act(async () => {
          await resolve(pageOf(generateOptions(), 1, 2));
        });

        // Check if the first page of 5 pages total is given.
        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });
      });

      it('it should prepend the value when the options is a singular value', async () => {
        expect.assertions(1);

        const { promise, resolve } = resolvablePromise<Page<Option>>();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const fetcher = jest.fn(({ size, page }) => {
          return promise;
        });

        const config = {
          options: fetcher,
          value: { id: 1337, label: '1337' },
          labelForOption: (option) => option.label,
          isOptionEqual: (a, b) => a.id === b.id,
          query: '',
          pageNumber: 1,
          size: 2,
          optionsShouldAlwaysContainValue: true
        };

        const { result } = renderHook(() => useOptions(config));

        await act(async () => {
          await resolve(pageOf(generateOptions(), 1, 2));
        });

        // Check if the first page of 5 pages total is given.
        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1337, label: '1337' },
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });
      });

      it('it should prepend all values not in the page when the options is an array', async () => {
        expect.assertions(1);

        const { promise, resolve } = resolvablePromise<Page<Option>>();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const fetcher = jest.fn(({ size, page }) => {
          return promise;
        });

        const config = {
          options: fetcher,
          value: [
            { id: 1, label: 1 }, // Should not be added again
            { id: 1337, label: '1337' }, // Should be added
            { id: 4242, label: '4242' }, // Should be added
            { id: 2, label: '2' } // Should not be added again
          ],
          labelForOption: (option) => option.label,
          isOptionEqual: (a, b) => a.id === b.id,
          query: '',
          pageNumber: 1,
          size: 2,
          optionsShouldAlwaysContainValue: true
        };

        const { result } = renderHook(() => useOptions(config));

        await act(async () => {
          await resolve(pageOf(generateOptions(), 1, 2));
        });

        expect(result.current).toEqual({
          page: {
            first: true,
            last: false,
            number: 1,
            numberOfElements: 2,
            size: 2,
            totalElements: 9,
            totalPages: 5,
            content: [
              { id: 1337, label: '1337' },
              { id: 4242, label: '4242' },
              { id: 1, label: '1' },
              { id: 2, label: '2' }
            ]
          },
          loading: false
        });
      });
    });
  });
});
