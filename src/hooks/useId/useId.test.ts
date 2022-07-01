import { renderHook } from '@testing-library/react';

import { useId } from './useId';

import * as lodash from 'lodash';

jest.mock('lodash', () => {
  return {
    uniqueId: jest.fn()
  };
});

describe('useId', () => {
  test('that when an id is given that id will always be returned', () => {
    const { rerender, result } = renderHook<string, { id: string }>(
      (props) => useId({ id: props.id }),
      {
        initialProps: {
          id: '42'
        }
      }
    );

    // Initially it should be 42
    expect(result.current).toBe('42');

    // Now the user provides another id now that id should be used
    rerender({ id: '1337' });

    expect(result.current).toBe('1337');
  });

  test('that when no id is given that a unique id is generated and that id should be re-used', () => {
    // We start with uniqueId returning 42
    // @ts-expect-error Test mock
    lodash.uniqueId.mockReturnValue('42');

    const { rerender, result } = renderHook<string, { id?: string }>(
      (props) => useId({ id: props.id }),
      {
        initialProps: {
          id: undefined
        }
      }
    );

    expect(result.current).toBe('42');

    // A second call to uniqueId should return 43 now
    // @ts-expect-error Test mock
    lodash.uniqueId.mockReturnValue('43');

    // Rerender with undefined and check that 42 was reused.
    rerender({ id: undefined });
    expect(result.current).toBe('42');
  });

  test('that when no id is given initially, and then an id is given that that id is used instead', () => {
    // We start with uniqueId returning 42
    // @ts-expect-error Test mock
    lodash.uniqueId.mockReturnValue('42');

    const { rerender, result } = renderHook<string, { id?: string }>(
      (props) => useId({ id: props.id }),
      {
        initialProps: {
          id: undefined
        }
      }
    );

    // We start at the initial unique id given by lodash
    expect(result.current).toBe('42');

    // Now the user provides another id now that id should be used instead
    rerender({ id: '1337' });

    expect(result.current).toBe('1337');
  });
});
