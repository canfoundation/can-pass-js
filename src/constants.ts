const LOGIN_BUTTON_CLASS_NAME =
  process.env.LOGIN_BUTTON_CLASS_NAME || "can-pass-login-button";

const CAN_PASS_SIGN_TX_URL =
  process.env.CAN_PASS_SIGN_TRANSACTION_URL ||
  "http://can-pass.canfoundation.io/sign-transaction";

const CAN_KEYS_ENDPOINT = "https://prod.api.cryptobadge.app/can-keys/graphql";

export { CAN_KEYS_ENDPOINT, CAN_PASS_SIGN_TX_URL, LOGIN_BUTTON_CLASS_NAME };
