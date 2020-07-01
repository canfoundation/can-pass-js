import localStore from './storages/localStorage';
import memoryStore from './storages/memoryStorage';

const prefix = 'CanPass.';

export const LOCAL_STORAGE = 'localStorage';
export const MEMORY_STORAGE = 'memory';

const storageMap = {
  [LOCAL_STORAGE]: localStore,
  [MEMORY_STORAGE]: memoryStore,
};

let storage = localStore;

export const initialize = (type: string) => {
  console.log("initialize -> type", type)
  storage = storageMap[type] || storageMap[MEMORY_STORAGE];
};

export default ({
  read(name: string): string {
    return storage.get(`${prefix}${name}`);
  },

  write(name: string, value: string) {
    return storage.set(`${prefix}${name}`, value);
  },

  remove(name: string) {
    return storage.remove(`${prefix}${name}`);
  },
});
