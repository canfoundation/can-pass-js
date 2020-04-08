# can-pass-js

[![Build Status](https://travis-ci.org/canfoundation/can-pass-js.svg?branch=master)](https://travis-ci.org/canfoundation/can-pass-js)

[![NPM](https://img.shields.io/npm/v/can-pass-js.svg)](https://www.npmjs.org/package/can-pass-js)

[![https://nodei.co/npm/can-pass-js.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/can-pass-js.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/can-pass-js)

It is a sdk for can-pass which facilitates 3rd party 's developers experience when they are working with can-pass api.

#### Loading the SDK

Using script below to load the SDK.

```javascript
<script src="../lib/can-pass-api.js"></script>
```

After the SDK has loaded, it will call the `init` function, so you should define that function to init the SDK.

```javascript
(function () {
  const canPass = window.CanPass && window.CanPass.getInstance();

  if (canPass) {
    canPass.init({
      clientId: "leonardo",

      version: "1.0",
    });

    canPass.loginButton();
  }
})();
```

Replace {client-id} with your client ID and {api-version} with the API version to use. The latest version is 'v1.0'

Remember, you have to init the SDK before using any CanPass SDK methods.

The full script for embedding to your HTML

```html
<script src="../lib/can-pass-api.js"></script>

<script>
  (function () {
    const canPass = window.CanPass && window.CanPass.getInstance();

    if (canPass) {
      canPass.init({
        clientId: "{client-id}",

        version: "{api-version}",
      });

      // Start to use CanPass SDK from here.
    }
  })();
</script>
```

#### Import via yarn or npm

Run `yarn add can-pass-js` from terminal.

```javascript
import CanPass from "can-pass-js";

CanPass.init({
  clientId: "{client-id}",

  version: "{api-version}",
});

// Start to use CanPass SDK from here.
```

#### Login Button

Place this code wherever you want the plugin to appear login button on your page.

```html
<button
  class="can-pass-login-button"
  data-redirect-uri="https://app.com/login-success"
  data-state="1a2b3c"
  data-domain="https://test.cryptobadge.app"
  data-text="Sign in with Cryptobadge"
></button>
```

#### Reference

##### Init SDK

```
CanPass.init(options);
```

###### Parameters

`options` is an object to configure the SDK.

| Field     | Type              | Description                                                                  |
| --------- | ----------------- | ---------------------------------------------------------------------------- |
| clientId  | string (required) | The clientId generated by CanPass Admin Console                              |
| version   | string            | The version of API                                                           |
| store     | string            | The store which will be used to save data. Supported: `localStore`, `memory` |
| endPoint  | string            | The endpoint to request transaction information                              |
| signTxURL | string            | Sign transaction place                                                       |

##### Sign a transaction

`CanPass.signTx(tx, userId, userName, callback)`

After call that, it will open a new window to operate signing transaction. Input secret code to sign transaction (Browser required)

###### Parameters

| Name     | Type                  | Description                                             |
| -------- | --------------------- | ------------------------------------------------------- |
| tx       | object                | The body of transaction. For example: `{ actions: [] }` |
| userId   | string                | The userid of CAN account                               |
| userName | string                | The username of CAN account                             |
| callback | `(error, tx) => void` | The callback function when sign transaction.            |

##### Set credential manually

`CanPass.setCredentials(credentials)`

The 3rd party can set credential manually if they use external login flow.

`options` is an object contains tokens.

| Field       | Type   | Description     |
| ----------- | ------ | --------------- |
| accessToken | string | The accessToken |

#### Example

- [Login with Cryptobadge button](http://git.baikal.io/can/can-pass-api/tree/canary/example/index.html)

#### Development

###### Environment Variables

| Variable                      | Description                      |
| ----------------------------- | -------------------------------- |
| CAN_PASS_SIGN_TRANSACTION_URL | The signing transaction URL      |
| CAN_KEYS_ENDPOINT             | The graphQL endpoint of Can Keys |
| LOGIN_BUTTON_CLASS_NAME       | Name of login button class       |
| CB_WEB                        | Login with CryptoBadge URL       |

- To build run `yarn build`

* To test run `yarn test`

- To dev run `yarn watch`
