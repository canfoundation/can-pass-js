/* global test, expect */
import CanPass from "../index";
import Storage, { LOCAL_STORAGE, MEMORY_STORAGE } from "../storage";
// import { global } from "../utils";




describe("Initialize CanPass", () => {
  const info = {
    clientId: "leonardo",
    endPoint: "Hogwarts",
    signTxURL: "Harry Potter",
    version: "v1.0",
    store: MEMORY_STORAGE,
  };

  beforeEach(() => {
    // jest.resetAllMocks()
  })

  test("with memory", () => {
    CanPass.init(info);

    expect(Storage.read("clientId")).toEqual(info.clientId);
    expect(Storage.read("endPoint")).toEqual(info.endPoint);
    expect(Storage.read("signTxURL")).toEqual(info.signTxURL);
    expect(Storage.read("version")).toEqual(info.version);
  });

  test("with browser localStorage", () => {
    const mockWindow = {
      localStorage: {
        setItem: () => {},
      },
    };

    jest.mock("../utils", () => ({
      global: mockWindow
    }));
    const { global } = require('../utils')
    // expect(global).toEqual("");

    CanPass.init({ ...info, store: LOCAL_STORAGE });

    expect(Storage.read("clientId")).toEqual(info.clientId);
    expect(Storage.read("endPoint")).toEqual(info.endPoint);
    expect(Storage.read("signTxURL")).toEqual(info.signTxURL);
    expect(Storage.read("version")).toEqual(info.version);
  });
});
