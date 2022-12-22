import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
