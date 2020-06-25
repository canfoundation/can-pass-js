import { global } from './utils';

let fetch = global.fetch && global.fetch.bind(global);

export const set = (f) => {
  fetch = f;
};

export default fetch;
