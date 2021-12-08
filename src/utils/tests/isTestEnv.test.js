import { isTestEnv } from '../isTestEnv';

describe('isTestEnv function', () => {
  it('return true when execution context is in "test" env', () => {
    expect(isTestEnv()).toBeTruthy();
  });
});
