import * as components from '../src/index';

describe('core', () => {
  it('should contain exports', () => {
    expect(components).toMatchSnapshot();
  });
});
