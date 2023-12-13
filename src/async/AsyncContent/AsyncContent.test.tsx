import { fireEvent, render, screen } from '@testing-library/react';

import { AsyncContent, isEmptyList, isEmptyPage } from './AsyncContent';
import { emptyPage } from '@42.nl/spring-connect';
import { pageOfUsers } from '../../test/fixtures';

type State = {
  isLoading: boolean;
  isFulfilled?: boolean;
  isError?: boolean;
  data?: string;
  error?: string;
  reload?: () => void;
  refetch?: () => void;
};

describe('Component: AsyncContent', () => {
  function setup({
    state,
    showRetryButton = undefined,
    isEmpty = undefined,
    emptyContent = undefined
  }: {
    state: State;
    showRetryButton?: boolean;
    isEmpty?: () => boolean;
    emptyContent?: (data: string) => React.ReactNode;
  }) {
    jest.spyOn(console, 'error');

    const { container } = render(
      <AsyncContent
        // @ts-expect-error Test mock
        state={state}
        showRetryButton={showRetryButton}
        isEmpty={isEmpty}
        emptyContent={emptyContent}
      >
        {(data: string) => <h2>{data}</h2>}
      </AsyncContent>
    );

    return { container };
  }

  describe('when loading', () => {
    test('React Query v5+', () => {
      const state = {
        isPending: true,
        isLoading: false,
        refetch: () => undefined
      };

      const { container } = setup({ state });
      expect(container).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('React Async & React Query <= v4', () => {
      const state = {
        isLoading: true,
        refetch: () => undefined
      };

      const { container } = setup({ state });
      expect(container).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('when fulfilled', () => {
    test('when not empty', () => {
      const state = {
        isLoading: false,
        isError: false,
        data: 'important data',
        refetch: () => undefined
      };

      const { container } = setup({ state });

      expect(container).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('when empty', () => {
      const state = {
        isLoading: false,
        isError: false,
        data: 'important data',
        refetch: () => undefined
      };

      const { container } = setup({ state, isEmpty: () => true });

      expect(container).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(0);
    });

    test('when empty with custom empty ', () => {
      const state = {
        isLoading: false,
        isError: false,
        data: 'important data',
        refetch: () => undefined
      };

      const { container } = setup({
        state,
        isEmpty: () => true,
        // eslint-disable-next-line react/display-name
        emptyContent: (data) => {
          expect(data).toBe('important data');

          return <h1>Custom renderer</h1>;
        }
      });

      expect(container).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('when rejected', () => {
    test('with retry button', () => {
      const refetchSpy = jest.fn();

      jest.spyOn(console, 'error').mockImplementation(jest.fn());
      const state = {
        isLoading: false,
        isError: true,
        error: 'something error',
        refetch: refetchSpy
      };

      const { container } = setup({ state, showRetryButton: true });

      expect(container).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('something error');

      fireEvent.click(screen.getByText('Retry'));

      expect(refetchSpy).toHaveBeenCalledTimes(1);
    });

    test('without retry button', () => {
      jest.spyOn(console, 'error').mockImplementation(jest.fn());
      const state = {
        isLoading: false,
        isError: true,
        error: 'something error',
        refetch: () => undefined
      };

      const { container } = setup({ state, showRetryButton: false });

      expect(container).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('something error');
    });

    test('should not render when showRetryButton is undefined', () => {
      const refetchSpy = jest.fn();

      jest.spyOn(console, 'error').mockImplementation(jest.fn());
      const state = {
        isLoading: false,
        isError: true,
        error: 'something error',
        refetch: refetchSpy
      };

      const { container } = setup({ state });

      expect(container).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('something error');
    });
  });

  describe('deprecated React Async', () => {
    describe('when fulfilled', () => {
      test('when not empty', () => {
        const state = {
          isLoading: false,
          isFulfilled: true,
          data: 'important data',
          reload: () => undefined
        };

        const { container } = setup({ state });

        expect(container).toMatchSnapshot();
        expect(console.error).toHaveBeenCalledTimes(0);
      });

      test('when empty', () => {
        const state = {
          isLoading: false,
          isFulfilled: true,
          data: 'important data',
          reload: () => undefined
        };

        const { container } = setup({ state, isEmpty: () => true });

        expect(container).toMatchSnapshot();
        expect(console.error).toHaveBeenCalledTimes(0);
      });

      test('when empty with custom empty ', () => {
        const state = {
          isLoading: false,
          isFulfilled: true,
          data: 'important data',
          reload: () => undefined
        };

        const { container } = setup({
          state,
          isEmpty: () => true,
          // eslint-disable-next-line react/display-name
          emptyContent: (data) => {
            expect(data).toBe('important data');

            return <h1>Custom renderer</h1>;
          }
        });

        expect(container).toMatchSnapshot();
        expect(console.error).toHaveBeenCalledTimes(0);
      });
    });

    describe('when rejected', () => {
      test('with retry button', () => {
        const reloadSpy = jest.fn();

        jest.spyOn(console, 'error').mockImplementation(jest.fn());
        const state = {
          isLoading: false,
          isFulfilled: false,
          error: 'something error',
          reload: reloadSpy
        };

        const { container } = setup({ state, showRetryButton: true });

        expect(container).toMatchSnapshot();
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('something error');

        fireEvent.click(screen.getByText('Retry'));

        expect(reloadSpy).toHaveBeenCalledTimes(1);
      });

      test('without retry button', () => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn());
        const state = {
          isLoading: false,
          isFulfilled: false,
          error: 'something error',
          reload: () => undefined
        };

        const { container } = setup({ state, showRetryButton: false });

        expect(container).toMatchSnapshot();
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('something error');
      });

      test('should not render when showRetryButton is undefined', () => {
        const reloadSpy = jest.fn();

        jest.spyOn(console, 'error').mockImplementation(jest.fn());
        const state = {
          isLoading: false,
          isFulfilled: false,
          error: 'something error',
          reload: reloadSpy
        };

        const { container } = setup({ state });

        expect(container).toMatchSnapshot();
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('something error');
      });
    });
  });
});

describe('isEmptyPage', () => {
  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmptyPage(emptyPage())).toBe(true);
  });

  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmptyPage(pageOfUsers())).toBe(false);
  });
});

describe('isEmptyList', () => {
  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmptyList([])).toBe(true);
  });

  it('should consider it empty when the totalElements is zero', () => {
    expect(isEmptyList(pageOfUsers().content)).toBe(false);
  });
});
