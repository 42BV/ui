import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();

  // Re-create the fake storages for each test the stores always start fresh.
  setupStorages();
});

// Create fake versions of localStorage and sessionStorage.
/* istanbul ignore next */
function setupStorages() {
  let localStorageMockStore = {};

  // @ts-expect-error override for custom store in test
  global.localStorage = {
    getItem: jest.fn((key) => {
      return localStorageMockStore[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      localStorageMockStore[key] = `${value}`;
    }),
    clear: jest.fn(() => {
      localStorageMockStore = {};
    })
  };

  let sessionStorageMockStore = {};

  // @ts-expect-error override for custom store in test
  global.sessionStorage = {
    getItem: jest.fn((key) => {
      return sessionStorageMockStore[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      sessionStorageMockStore[key] = `${value}`;
    }),
    clear: jest.fn(() => {
      sessionStorageMockStore = {};
    })
  };
}
