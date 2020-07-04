/**
 * @jest-environment jsdom
 */

import CanPass from "../index";
import Storage, { LOCAL_STORAGE, MEMORY_STORAGE } from "../storage";
import { UIUtils, signTx } from "../UIController";

describe("Initialize CanPass", () => {
  const info = {
    clientId: "leonardo",
    endPoint: "Hogwarts",
    signTxURL: "https://can-pass.canfoundation.io/sign-transaction",
    version: "v1.0",
    store: MEMORY_STORAGE,
  };

  const assertResults = () => {
    expect(Storage.read("clientId")).toEqual(info.clientId);
    expect(Storage.read("endPoint")).toEqual(info.endPoint);
    expect(Storage.read("signTxURL")).toEqual(info.signTxURL);
    expect(Storage.read("version")).toEqual(info.version);
  };

  it("with memory", () => {
    CanPass.init(info);

    assertResults();
  });

  it("with browser localStorage", () => {
    CanPass.init({ ...info, store: LOCAL_STORAGE });

    assertResults();
  });
});

describe("UI CanPass", () => {
  let expectedSigntxUrl;
  const windowRef = "windowRef";
  const signTxUrl = "http://can-pass.canfoundation.io/";
  const orginalWindowObject = { ...window };

  window.open = jest.fn().mockImplementation(signTxUrl => {
    expectedSigntxUrl = signTxUrl;

    return windowRef;
  });

  beforeEach(() => {
    expectedSigntxUrl = null;
    jest.clearAllMocks();

    // reset window object
    window = orginalWindowObject;
    if (window[UIUtils.CURRENT_WINDOW])
      delete window[window[UIUtils.CURRENT_WINDOW]];
  });

  it("openPopup function", () => {
    const newPopup = UIUtils.openPopup(undefined, signTxUrl);

    expect(expectedSigntxUrl).toEqual(signTxUrl);
    expect(newPopup).toEqual(windowRef);
  });

  it("popup function", () => {
    const ref = UIUtils.popup(signTxUrl);

    // TODO add more test cases here
    expect(ref instanceof Promise).toBeTruthy();
  });

  it("signTx function", async () => {
    const requestTxId = "123";
    const resolvedVal = {
      type: UIUtils.SIGN_TRANSACTION_MESSAGE_TYPE,
      requestTxId,
    };

    const rejectedVal = {
      type: UIUtils.SIGN_TRANSACTION_MESSAGE_TYPE,
      error: "huh?",
    };

    const spyOnPopup = jest.spyOn(UIUtils, "popup");

    spyOnPopup
    .mockReturnValueOnce(
      new Promise(resolve => resolve(resolvedVal))
    ).mockReturnValueOnce(
      new Promise(resolve => resolve(rejectedVal))
    );

    try {
      const resolvedResponse = await signTx(requestTxId);
      await signTx(requestTxId);

      expect(spyOnPopup).toHaveBeenCalledTimes(2);
      expect(resolvedResponse).toEqual(resolvedVal);

    } catch(e) {
      expect(e.message).toEqual(rejectedVal.error);
    }
  });
});
