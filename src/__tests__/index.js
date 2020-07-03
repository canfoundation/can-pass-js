/**
 * @jest-environment jsdom
 */

import CanPass from "../index";
import Storage, { LOCAL_STORAGE, MEMORY_STORAGE } from "../storage";

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
  }

  it("with memory", () => {
    CanPass.init(info);

    assertResults();
  });

  it("with browser localStorage", () => {
    CanPass.init({ ...info, store: LOCAL_STORAGE });

    expect(Storage.read("clientId")).toEqual(info.clientId);
    expect(Storage.read("endPoint")).toEqual(info.endPoint);
    expect(Storage.read("signTxURL")).toEqual(info.signTxURL);
    expect(Storage.read("version")).toEqual(info.version);
  });
});
