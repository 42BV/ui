import { configure, getConfig } from './config';

test('config', () => {
  expect(getConfig()).toEqual({ showRequiredMarkInLabel: true });
  configure({ showRequiredMarkInLabel: false });
  expect(getConfig()).toEqual({ showRequiredMarkInLabel: false });
  configure({ showRequiredMarkInLabel: true });
  expect(getConfig()).toEqual({ showRequiredMarkInLabel: true });
});
