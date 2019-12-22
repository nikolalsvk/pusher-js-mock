import { PusherFactoryMock } from "../index";

describe("PusherFactoryMock", () => {
  let pusherFactoryMock: PusherFactoryMock;

  beforeEach(() => {
    const pusherKey = "19ir1pkcj13";
    pusherFactoryMock = new PusherFactoryMock(pusherKey);
  });

  it("initializes pusherKey", () => {
    expect(pusherFactoryMock.pusherKey).toEqual("19ir1pkcj13");
  });

  describe("pusherClient", () => {
    it("return an object", () => {
      expect(pusherFactoryMock.pusherClient()).toBeDefined();
    });
  });
});
