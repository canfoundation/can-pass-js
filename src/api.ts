// @flow
import storage from "./storage";
import fetch from "./fetch";
import { CAN_KEYS_ENDPOINT } from "./constants";
import { RequestSignTxOptions } from './types'

export const graphql = (body: {
  query: string;
  variables: {};
}): Promise<any> => {
  const accessToken = storage.read("accessToken");
  const endPoint = storage.read("endPoint") || CAN_KEYS_ENDPOINT;

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

export const requestTx = (transaction: any, signTxOption: RequestSignTxOptions): Promise<any> => {
  const { broadcast, addAuths} = signTxOption;

  const input: any = {
    transaction,
    trxOpt: {
      broadcast,
       expireSeconds: 30,
    }
  };

  if(!broadcast && addAuths) {
    // add additional authorization
    input.addAuths = addAuths;

    // add payer
    const actionsWithPayer = transaction.actions.map(action => ({
      ...action,
      authorization: [
        ...action.authorization,
        { actor: addAuths[0].actor, permission: "active" },
      ],
    }));

    input.transaction.actions = actionsWithPayer;
  }

  return graphql({
    query: `
    mutation signTransactionRequest($input: RequestSignTransactionInput!)  {
      requestSignTransaction(input: $input) {
        requestId
      }
    }
  `,
    variables: {
      input,
    }
  })
    .then(data => {
      return data.requestSignTransaction;
    })
    .catch(err => {
      throw err;
    });
  }
