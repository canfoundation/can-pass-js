// @flow

import { CAN_PASS_SIGN_TX_URL } from './constants';
import logger from './logger';
import storage from './storage';

const SIGN_TRANSACTION_MESSAGE_TYPE = 'sign-transaction';
const CURRENT_WINDOW = 'currentWindowRef';

const getSignTxURL = () => storage.read('signTxURL') || CAN_PASS_SIGN_TX_URL;

const randomString = () => (+new Date() * Math.random()).toString(36).substring(0, 8);

export const openPopup = (asyncPopup?: boolean, url?: string) => {
  if (typeof window === 'undefined') throw new Error('Not Browser');
  const windowArea = {
    width: Math.floor(window.outerWidth * 0.8),
    height: Math.floor(window.outerHeight * 0.5),
    top: 0,
    left: 0,
  };

  if (windowArea.width < 1000) {
    windowArea.width = 1000;
  }
  if (windowArea.height < 630) {
    windowArea.height = 630;
  }
  windowArea.left = Math.floor(
    window.screenX + (window.outerWidth - windowArea.width) / 2,
  );
  windowArea.top = Math.floor(
    window.screenY + (window.outerHeight - windowArea.height) / 8,
  );

  const windowOpts = `toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0,
    width=${windowArea.width},height=${windowArea.height},
    left=${windowArea.left},top=${windowArea.top}`;

  const authWindow = window.open(
    url || getSignTxURL(),
    'producthuntPopup',
    windowOpts,
  );
  if (!asyncPopup) {
    // a workaround way to handle if users close the pop-up
    const windowRef = randomString();
    window[CURRENT_WINDOW] = windowRef;
    window[windowRef] = authWindow;
  }

  return authWindow;
};

const popup = (URL: URL): Promise<any> => {
  let url = URL.toString();
  const sep = url.indexOf('?') !== -1 ? '&' : '?';
  url = `${url}${sep}`;

  const currentWindow = window[window[CURRENT_WINDOW]];
  let authWindow;

  if (currentWindow) {
    currentWindow.location.href = url;
  } else {
    authWindow = openPopup(true, url);
  }
  // Create IE + others compatible event handler
  const eventMethod = window.addEventListener
    ? 'addEventListener'
    : 'attachEvent';
  const eventRemoveMethod = window.removeEventListener
    ? 'removeEventListener'
    : 'detachEvent';
  const eventer = window[eventMethod];
  const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

  const cleanUp = (eventHandler) => {
    window[eventRemoveMethod](messageEvent, eventHandler, false);
    if (currentWindow) {
      currentWindow.close();
      delete window[window[CURRENT_WINDOW]];
    }
    if (authWindow) authWindow.close();
  };

  return new Promise((resolve, reject) => {
    const eventHandler = (e) => {
      // if (e.origin !== window.SITE_DOMAIN) {
      //   authWindow.close();
      //   reject(new Error('Not allowed'));
      // }

      if (!e.data) {
        logger.debug('window opener return error', e);
        cleanUp(eventHandler);
        reject(new Error('No event data'));
      }

      if (e.data.type === SIGN_TRANSACTION_MESSAGE_TYPE) {
        logger.debug('window opener return message', e.data);
        cleanUp(eventHandler);
        resolve(e.data);
      }
    };
    eventer(messageEvent, eventHandler, false);
  });
};

export const signTx = (txId: string): Promise<any> => {
  const url = new URL(getSignTxURL());
  url.searchParams.append('txId', txId);

  return popup(url).then((data) => {
    if (data.type === SIGN_TRANSACTION_MESSAGE_TYPE) {
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.requestTxId === txId) {
        return data.trx;
      }
    }
  });
};
