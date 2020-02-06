// @flow

import { CAN_PASS_SIGN_TX_URL } from "./constants";
import logger from "./logger";

const SIGN_TRANSACTION_MESSAGE_TYPE = 'sign-transaction';

export const popup = (URL: string): Promise<any> => {
  if (typeof window === "undefined") throw new Error("Not Browser");
  const windowArea = {
    width: Math.floor(window.outerWidth * 0.8),
    height: Math.floor(window.outerHeight * 0.5),
    top: 0,
    left: 0
  };

  if (windowArea.width < 1000) {
    windowArea.width = 1000;
  }
  if (windowArea.height < 630) {
    windowArea.height = 630;
  }
  windowArea.left = Math.floor(
    window.screenX + (window.outerWidth - windowArea.width) / 2
  );
  windowArea.top = Math.floor(
    window.screenY + (window.outerHeight - windowArea.height) / 8
  );

  const sep = URL.indexOf("?") !== -1 ? "&" : "?";
  const url = `${URL}${sep}`;
  const windowOpts = `toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0,
    width=${windowArea.width},height=${windowArea.height},
    left=${windowArea.left},top=${windowArea.top}`;

  const authWindow = window.open(url, "producthuntPopup", windowOpts);

  // Create IE + others compatible event handler
  const eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  const eventRemoveMethod = window.removeEventListener
    ? "removeEventListener"
    : "detachEvent";
  const eventer = window[eventMethod];
  const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

  return new Promise((resolve, reject) => {
    const eventHandler = e => {
      // if (e.origin !== window.SITE_DOMAIN) {
      //   authWindow.close();
      //   reject(new Error('Not allowed'));
      // }

      if(!e.data){
        logger.debug("window opener return error", e);
        window[eventRemoveMethod](messageEvent, eventHandler, false)
        authWindow.close();
        reject(new Error("No event data"));
      }

      if (e.data.type === SIGN_TRANSACTION_MESSAGE_TYPE) {
        logger.debug("window opener return message", e.data);
        window[eventRemoveMethod](messageEvent, eventHandler, false)
        authWindow.close();
        resolve(e.data);
      } 
    }
    eventer(
      messageEvent,
      eventHandler,
      false
    );
  });
};

export const signTx = (
  txId: string,
  userId: string,
  userName: string
): Promise<any> => {
  const url = `${CAN_PASS_SIGN_TX_URL}?txId=${txId}&userId=${userId}&userName=${userName}`;
  return new Promise((resolve, reject) =>
    popup(url)
    .then(data => {
      if (data.type === SIGN_TRANSACTION_MESSAGE_TYPE) {
        if (data.error) {
          reject(new Error(data.error));
        }
        
        if (data.requestTxId === txId) {
          resolve(data.tx);
        }
      }
    })
  );
};
