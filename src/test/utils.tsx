import { Page } from '@42.nl/spring-connect';

type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;

export function resolvablePromise<R>(): {
  promise: Promise<R>;
  resolve: PromiseResolve<R>;
} {
  let resolve: PromiseResolve<R> = () => undefined;

  const promise = new Promise<R>((r) => {
    resolve = r;
  });

  return { promise, resolve };
}

type PromiseReject = (reason?: any) => void;

export function rejectablePromise(): {
  promise: Promise<unknown>;
  reject: PromiseReject;
} {
  let reject: PromiseReject = () => undefined;

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
