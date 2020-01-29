import { Page } from '@42.nl/spring-connect';

export function resolvablePromise<R>() {
  let resolve: (result?: Promise<R> | R) => void = () => undefined;

  const promise = new Promise<R>(r => {
    resolve = r;
  });

  return { promise, resolve };
}

export function rejectablePromise() {
  let reject: (error?: any) => void = () => undefined;

  const promise = new Promise((resolve, r) => {
    reject = r;
  });

  return { promise, reject };
}

export function pageWithContent<T>(content: T[]): Page<T> {
  return {
    content,
    last: false,
    totalElements: 100,
    totalPages: 10,
    size: content.length,
    number: 1,
    first: true,
    numberOfElements: content.length
  };
}

export function pageWithContentAndExactSize<T>(content: Array<T>): Page<T> {
  return {
    content,
    last: true,
    totalElements: content.length,
    totalPages: 1,
    size: content.length,
    number: 1,
    first: true,
    numberOfElements: content.length
  };
}

// Get a reference to setTimeout since jest can alter it when mocking timers.
const setTimeoutRef = window.setTimeout;
export function waitForUI(assertions: () => void, timeout?: number) {
  // Waiting one tick should be enough so the UI is updated.
  setTimeoutRef(() => {
    try {
      assertions();
    } catch (error) {
      console.error(error);
    }
  }, timeout || 1);
}
