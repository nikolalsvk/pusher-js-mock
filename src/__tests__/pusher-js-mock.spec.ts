import { PusherMock } from "../index";
import PusherChannelMock from "../pusher-channel-mock";
import PusherPresenceChannelMock from "../pusher-presence-channel-mock";
import { createClient } from "./pusher-presence-channel-mock.spec";
import PusherMockInstance from "../pusher-js-mock-instance";

describe("PusherMock", () => {
  let pusherMock: PusherMock;

  beforeEach(() => {
    PusherMockInstance.reset();
    pusherMock = new PusherMock();
  });

  it("initializes channels object", () => {
    expect(pusherMock.channels).toEqual({});
  });

  describe("#channel", () => {
    it("returns instance of PusherChannelMock", () => {
      expect(pusherMock.channel("my-channel")).toBeDefined();
    });

    it("adds new channel to channels object", () => {
      pusherMock.channel("my-channel");
      expect(pusherMock.channels).toMatchObject({ "my-channel": {} });
    });

    it("returns the correct type of channel based on channel name", () => {
      expect(pusherMock.channel("public-channel")).toBeInstanceOf(
        PusherChannelMock
      );
      expect(pusherMock.channel("presence-channel")).toBeInstanceOf(
        PusherPresenceChannelMock
      );

      pusherMock.unsubscribe("public-channel");
      pusherMock.unsubscribe("presence-channel");
    });

    describe("channel is already added to channels object", () => {
      beforeEach(() => {
        pusherMock.channel("my-channel");
      });

      it("returns instance of PusherChannelMock", () => {
        expect(pusherMock.channel("my-channel")).toBeDefined();
      });

      it("adds new channel to channels object", () => {
        expect(pusherMock.channels).toMatchObject({ "my-channel": {} });
      });
    });
  });

  describe("#subscribe", () => {
    it("returns instance of PusherChannelMock", () => {
      expect(pusherMock.channel("my-channel")).toBeDefined();
    });

    it("adds new channel to channels object", () => {
      pusherMock.subscribe("my-channel");
      expect(pusherMock.channels).toMatchObject({ "my-channel": {} });
    });

    it("subscribes to a presence channel", () => {
      pusherMock.subscribe("presence-channel");

      expect(pusherMock.channels).toMatchObject({ "presence-channel": {} });
    });
  });

  describe("#unsubscribe", () => {
    describe("channel name is inside channels object", () => {
      it("removes channel from channels object", () => {
        pusherMock.subscribe("my-channel");
        pusherMock.unsubscribe("my-channel");
        expect(pusherMock.channels).toEqual({});
      });
    });

    describe("channel name is not inside channels object", () => {
      it("removes channel from channels object", () => {
        pusherMock.unsubscribe("my-channel");
        expect(pusherMock.channels).toEqual({});
      });
    });

    describe("presence channels", () => {
      it("removes only own callbacks from the callbacks object", async () => {
        // arrange
        const client = new PusherMock("my-id");
        const otherClient = createClient("your-id", {});

        const channel = client.subscribe("presence-channel");
        const otherChannel = otherClient.subscribe("presence-channel");

        const listener = jest.fn();
        const otherListener = jest.fn();

        // act
        channel.bind("some-event", listener);
        otherChannel.bind("some-event", otherListener);

        otherClient.unsubscribe("presence-channel");
        PusherMockInstance.channels["presence-channel"].emit("some-event", {
          data: "testing"
        });

        // assert
        expect(listener).toHaveBeenCalledWith({ data: "testing" });
        expect(otherListener).not.toHaveBeenCalled();
        expect(
          PusherMockInstance.channels["presence-channel"].callbacks
        ).toEqual({ "some-event": [listener] });

        // expect channel removed
        client.unsubscribe("presence-channel");
        expect(PusherMockInstance.channels).toEqual({});
      });
    });
  });

  describe("authorizer", () => {
    it("should set a default ID and info if presence channel used and no auth config passed", () => {
      pusherMock.subscribe("presence-channel");
      expect(pusherMock.id).toBeDefined();
      expect(pusherMock.info).toBeDefined();
    });

    it("should leave id and info undefined if auth errored", () => {
      pusherMock.config = {
        authorizer: () => ({
          authorize: (socketId, callback) => {
            callback(true, undefined);
          }
        })
      };

      pusherMock.subscribe("presence-channel");

      expect(pusherMock.id).toBeUndefined();
      expect(pusherMock.info).toBeUndefined();
    });
  });
});
