import { vi } from 'vitest';
import { TextEncoder } from 'util';
import { configure } from '@testing-library/react';

global.TextEncoder = TextEncoder;

configure({
  computedStyleSupportsPseudoElements: true
});

beforeEach(() => {
  // Re-create the fake storages for each test the stores always start fresh.
  setupStorages();
});
afterEach(() => {
  vi.restoreAllMocks();
});

// Create fake versions of localStorage and sessionStorage.
/* istanbul ignore next */
function setupStorages() {
  let localStorageMockStore = {};

  // @ts-expect-error override for custom store in test
  global.localStorage = {
    getItem: vi.fn((key) => {
      return localStorageMockStore[key] || null;
    }),
    setItem: vi.fn((key, value) => {
      localStorageMockStore[key] = `${value}`;
    }),
    clear: vi.fn(() => {
      localStorageMockStore = {};
    })
  };

  let sessionStorageMockStore = {};

  // @ts-expect-error override for custom store in test
  global.sessionStorage = {
    getItem: vi.fn((key) => {
      return sessionStorageMockStore[key] || null;
    }),
    setItem: vi.fn((key, value) => {
      sessionStorageMockStore[key] = `${value}`;
    }),
    clear: vi.fn(() => {
      sessionStorageMockStore = {};
    })
  };
}
