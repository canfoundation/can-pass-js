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
    signTxURL: "Harry Potter",
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

fdescribe("UI CanPass", () => {
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

    expect(ref instanceof Promise).toBeTruthy();
  });

  it("signTx success", async () => {
    const requestTxId = "123";
    const resolvedVal = {
      type: UIUtils.SIGN_TRANSACTION_MESSAGE_TYPE,
      requestTxId,
    };
    

    const spyOnPopup = jest.spyOn(UIUtils, "popup");
    spyOnPopup.mockReturnValueOnce(new Promise(resolve => resolve(resolvedVal)));
    // spyOnPopup.mockReturnValueOnce(
    //   new Promise(resolve => resolve(rejectedVal))
    // );

    const resolvedResponse = await signTx(requestTxId);
    // const rejectedResponse = await signTx(requestTxId);

    expect(spyOnPopup).toHaveBeenCalledTimes(1);
    expect(resolvedResponse).toEqual(resolvedVal);
    // expect(rejectedResponse).toEqual(rejectedVal);
  });
  // it("signTx failed", async () => {
  //   const requestTxId = "123";
  //   const rejectedVal = {
  //     error: "huh?",
  //   };

  //   const spyOnPopup = jest.spyOn(UIUtils, "popup");
  //   spyOnPopup.mockReturnValueOnce(
  //     new Promise((_, reject) => reject(rejectedVal))
  //   );

  //   const rejectedResponse = await signTx(requestTxId);

  //   expect(spyOnPopup).toHaveBeenCalledTimes(1);
  //   expect(rejectedResponse).toEqual(rejectedVal);
  // });
});
