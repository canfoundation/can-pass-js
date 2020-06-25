import { global } from './utils';
/* eslint-disable import/no-mutable-exports */
let fetch = global.fetch && global.fetch.bind(global);

export const set = (f): any => {
  fetch = f;
};

export default fetch;
