/* global test, expect */
import CanPass from '../index';

CanPass.init({
  appId: 'leonardo',
  version: 'v1.0',
  store: 'memory',
});

test('api', () => {
  expect(CanPass.api()).toBe(0);
});
