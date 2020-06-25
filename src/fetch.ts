import { global } from './utils';

let fetch = global.fetch && global.fetch.bind(global);

export const set = (f): any => {
  fetch = f;
};

export default fetch;
