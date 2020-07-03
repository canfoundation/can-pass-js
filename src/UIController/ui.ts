// import { SIGN_TRANSACTION_MESSAGE_TYPE, getSignTxURL, popup } from './utils'
import { UIUtils } from './index'

export const signTx = (txId: string): Promise<any> => {
  const url = new URL(UIUtils.getSignTxURL());
  url.searchParams.append('txId', txId);

  /* eslint-disable consistent-return */
  return UIUtils.popup(url).then(data => {
    console.log("data", data)

    if (data.type === UIUtils.SIGN_TRANSACTION_MESSAGE_TYPE) {
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.requestTxId === txId) {
        return data;
      }
    }
  });
};