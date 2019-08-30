import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: true });

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

  // @ts-ignore
  global.localStorage = {
    // @ts-ignore
    getItem: jest.fn(key => {
      // @ts-ignore
      return localStorageMockStore[key] || null;
    }),
    // @ts-ignore
    setItem: jest.fn((key, value) => {
      // @ts-ignore
      localStorageMockStore[key] = `${value}`;
    }),
    // @ts-ignore
    clear: jest.fn(() => {
      // @ts-ignore
      localStorageMockStore = {};
    })
  };

  let sessionStorageMockStore = {};

  // @ts-ignore
  global.sessionStorage = {
    // @ts-ignore
    getItem: jest.fn(key => {
      // @ts-ignore
      return sessionStorageMockStore[key] || null;
    }),
    // @ts-ignore
    setItem: jest.fn((key, value) => {
      // @ts-ignore
      sessionStorageMockStore[key] = `${value}`;
    }),
    // @ts-ignore
    clear: jest.fn(() => {
      // @ts-ignore
      sessionStorageMockStore = {};
    })
  };
}

// Mock useTranslation everywhere.
jest.mock('react-i18next', () => {
  // Get the actual react-i18next
  const originalModule = jest.requireActual('react-i18next');

  const useTranslation = {
    // @ts-ignore
    i18n: {
      language: 'en',
      changeLanguage: jest.fn()
    },
    tReady: true,
    // @ts-ignore
    t: (key, data) => {
      let fakeTranslation = key ? key : '{WRONG_NO_KEY}';

      if (data) {
        fakeTranslation += ` ${JSON.stringify(data)}`;
      }

      return fakeTranslation;
    }
  };

  // use react-i18next as is but mock useTranslation.
  return {
    ...originalModule,
    useTranslation: () => useTranslation
  };
});
