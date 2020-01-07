// @flow
import storage from './storage';
import { CAN_WALLET_GRAPHQL_ENDPOINT } from './constants';
import fetch from './fetch';

export const graphql = (body: {query: string, variables: {}}): Promise<any> => {
  const accessToken = storage.read('accessToken');
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bear ${accessToken}`,
    },
    body: JSON.stringify({
      query: body.query,
      variables: body.variables,
    }),
  };
  return new Promise((resolve, reject) => {
    const parseJson = (res) => res.json();
    return fetch(CAN_WALLET_GRAPHQL_ENDPOINT, config)
      .then(parseJson)
      .then((response) => {
        if (response.errors) {
          reject(response.errors);
        } else {
          resolve(response.data);
        }
      });
  });
};

export const requestTx = (tx: any, userId: string): Promise<any> => graphql({
  query: `
    mutation signTransactionRequest($input: RequestSignTransactionInput!)  {
      requestSignTransaction(input: $input) {
        requestId
      }
    }
  `,
  variables: {
    input: {
      transaction: tx,
      userId,
      serviceId: storage.read('clientId'),
      autoRedirect: false,
    },
  },
}).then((data) => data.requestSignTransaction);
