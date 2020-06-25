import storage, { initialize as initializeStorage } from './storage';
import * as api from './api';
import { openPopup, signTx } from './ui';
import loginButton from './login-button';
import { set as setFetch } from './fetch';
import logger, { Logger } from './logger';
import { RequestSignTxOptions } from './types';

declare global {
  interface Window {
    CanPass: any;
  }
}

export interface CanPassApiConfig {
  clientId: string;
  version: string;
  endPoint?: string; // can-keys
  signTxURL?: string;
  store?: string;
  fetch?: () => Promise<any>;
  logger?: Logger;
}

const canPass = {
  init(config: CanPassApiConfig) {
    if (config.store) initializeStorage(config.store);
    if (config.fetch) setFetch(config.fetch);

    storage.write('clientId', config.clientId);
    storage.write('version', config.version);
    storage.write('endPoint', config.endPoint);
    storage.write('signTxURL', config.signTxURL);

    logger.setLogger(config.logger);
    return config;
  },

  setCredentials(credentials: { idToken: string; accessToken: string }) {
    storage.write('accessToken', credentials.accessToken);
    storage.write('idToken', credentials.idToken);
    return credentials;
  },

  // eslint-disable-next-line
  signTx(
    tx: { actions: Array<any> },
    signTxOption?: RequestSignTxOptions,
    callback?: (error: any, data?: any) => any,
  ): Promise<any> {
    if (callback === undefined) {
      const fn = this.signTx;
      return new Promise((resolve, reject) => {
        fn(tx, signTxOption, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    return api
      .requestTx(tx, signTxOption)
      .then(requestedTx => {
        const { requestId } = requestedTx;
        return signTx(requestId);
      })
      .then(data => callback(null, data))
      .catch(err => callback(err));
  },

  loginButton() {
    const clientId = storage.read('clientId');
    loginButton(clientId);
  },

  api() {
    logger.debug('calling api method');
    return 0;
  },
};

// const CanPass = (function factory() {
//   let initialized = false;
//
//   const handler = {
//     // Force to init the SDK before using any methods
//     get(target, prop) {
//       if (prop === 'init') {
//         initialized = true;
//       }
//       if (prop !== 'init' && !initialized) {
//         throw new Error('You need to init the SDK first.');
//       }
//       return target[prop];
//     },
//   };
//
//   return new Proxy(canPass, handler);
// }());

// if (typeof window !== 'undefined') {
//   window.CanPass = CanPass;
//
//   const canPassAsyncInit = window.canPassAsyncInit || function init() {};
//   canPassAsyncInit();
// }

/* eslint-disable func-names */
const CanPass = (function () {
  let instance;

  function createInstance() {
    return canPass;
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
}());

if (typeof window !== 'undefined') {
  window.CanPass = CanPass;
}

export { openPopup };
export default canPass;
