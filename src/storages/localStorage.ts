import { global } from '../utils';

export default {
  get(key) {
    return global.localStorage.getItem(key);
  },

  set(key, value) {
    return global.localStorage.setItem(key, value);
  },

  remove(key) {
    global.localStorage.removeItem(key);
  },
};
