
export interface RequestSignTxOptions {
  broadcast: boolean;
  /**
   * It is additional authentications that are accompanied with the transaction.
   * An example of this param is that we add one more signature of a payer to transactions.
   */
  addAuths?: any[];
}
