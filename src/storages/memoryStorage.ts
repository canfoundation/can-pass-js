const memoryStore = {};

export default {
  get(key) {
    return memoryStore[key];
  },

  set(key, value) {
    memoryStore[key] = value;
    return value;
  },

  remove(key) {
    delete memoryStore[key];
  },
};
