import { global } from './utils';

// eslint-disable-next-line import/no-mutable-exports
let { fetch } = global;

export const set = (f) => {
  fetch = f;
};

export default fetch;
