// @flow
import storage from "./storage";
import fetch from "./fetch";

export const graphql = (body: {
  query: string;
  variables: {};
}): Promise<any> => {
  const accessToken = storage.read("accessToken");
  const endPoint = storage.read("endPoint") || 'https://dev.api.cryptobadge.app/can-keys-test/graphql';

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      query: body.query,
      variables: body.variables
    })
  };
  return fetch(endPoint, config)
    .then(res => res.json())
    .then(response => {
      if (response.errors) {
        throw response.errors;
      } else {
        return response.data;
      }
    })
    .catch(err => {
      throw err;
    });
};

export const requestTx = (tx: any, userId: string): Promise<any> =>
  graphql({
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
        serviceId: storage.read("clientId"),
        autoRedirect: false
      }
    }
  })
    .then(data => {
      return data.requestSignTransaction;
    })
    .catch(err => {
      throw err;
    });
