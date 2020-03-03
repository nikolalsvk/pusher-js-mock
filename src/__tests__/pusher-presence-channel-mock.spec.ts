import { PusherMock, PusherPresenceChannelMock } from "../";
import { AuthInfo } from "pusher-js";
import pusherJsMockInstance from "../pusher-js-mock-instance";

describe("PusherPresenceChannelMock", () => {
  let channelMock: PusherPresenceChannelMock;

  beforeEach(() => {
    channelMock = new PusherPresenceChannelMock();
  });

  it(" sets a name (with a default fallback)", () => {
    expect(channelMock.name).toBe("presence-channel");
    const namedChannelMock = new PusherPresenceChannelMock(
      "presence-custom-name"
    );
    expect(namedChannelMock.name).toBe("presence-custom-name");
  });

  it("initializes members object", () => {
    expect(channelMock.members).toEqual({
      count: 0,
      members: {},
      me: null,
      myID: null,
    });
  });
});

/**
 * Creates a mocked client for testing
 * @param id The ID to attach to the client
 * @param info The user info object
 */
const createClient = (id: string, info: any = {}) =>
  new PusherMock("key", {
    authorizer: () => ({
      authorize: (socketId, callback) => {
        callback(false, ({ id, info } as unknown) as AuthInfo);
      },
    }),
  });

describe("Proxied PusherPresenceChannelMock", () => {
  let client: PusherMock;
  let otherClient: PusherMock;
  let proxiedChannelMock: PusherPresenceChannelMock;
  let otherProxiedChannelMock: PusherPresenceChannelMock;

  const PRESENCE_CHANNEL = "presence-channel";

  beforeEach(() => {
    client = createClient("my-id", {});
    otherClient = createClient("your-id", {});

    proxiedChannelMock = client.subscribe(PRESENCE_CHANNEL);
    otherProxiedChannelMock = otherClient.subscribe(PRESENCE_CHANNEL);
  });

  it(" doesn't proxy class members it doesn't care about", () => {
    expect(proxiedChannelMock.subscribed).toBe(true);
  });

  it(" add new members to the channel", async () => {
    await expect(proxiedChannelMock.members.count).toBe(2);
    expect(proxiedChannelMock.members.get("my-id")).toEqual({
      id: "my-id",
      info: {},
    });
    expect(proxiedChannelMock.members.get("your-id")).toEqual({
      id: "your-id",
      info: {},
    });
  });

  it(" correctly proxies the channel object per client", async () => {
    await expect(proxiedChannelMock.members.myID).toBe("my-id");
    expect(proxiedChannelMock.members.me).toEqual({ id: "my-id", info: {} });
    expect(proxiedChannelMock.IS_PROXY).toBeDefined();
  });

  it(" allows multiple clients to subscribe", async () => {
    await expect(proxiedChannelMock.members.myID).toBe("my-id");
    expect(otherProxiedChannelMock.members.myID).toBe("your-id");

    expect(proxiedChannelMock.members.count).toBe(2);
  });

  it(" should not emit a members callback when that member emits an event", () => {
    const listener = jest.fn();
    proxiedChannelMock.bind("custom-event", listener);

    const otherListener = jest.fn();
    otherProxiedChannelMock.bind("custom-event", otherListener);

    proxiedChannelMock.emit("custom-event");
    expect(listener).toHaveBeenCalledTimes(0);
    expect(otherListener).toHaveBeenCalledTimes(1);

    otherProxiedChannelMock.emit("custom-event");
    expect(listener).toHaveBeenCalledTimes(1);
    expect(otherListener).toHaveBeenCalledTimes(1);

    // cleanup
    proxiedChannelMock.unbind("custom-event", listener);
    otherProxiedChannelMock.unbind("custom-event", otherListener);
  });

  it.skip(" should trigger internal events such as pusher:subscription_succeeded", async () => {
    const listener = jest.fn() as any;
    const client = createClient("my-id", {});
    const channel = client.subscribe("presence-channel");
    await channel.bind("pusher:subscription_succeeded", listener);
    expect(listener).toHaveBeenCalled();
  });

  describe("#trigger", () => {
    it(" is an alias for emit", () => {
      let callback = jest.fn();
      proxiedChannelMock.bind("event", callback);
      proxiedChannelMock.trigger("event");
      expect(callback).toHaveBeenCalled();
    });
  });
  describe("Shared instance multiple clients", () => {
    it(" should trigger events cross-client", () => {
      // binding to the same event
      const listener = jest.fn();
      proxiedChannelMock.bind("client-event", listener);
      const otherListener = jest.fn();
      otherProxiedChannelMock.bind("client-event", otherListener);

      // should receive the others events
      proxiedChannelMock.emit("client-event");
      expect(listener).toHaveBeenCalledTimes(0);
      expect(otherListener).toHaveBeenCalledTimes(1);

      otherProxiedChannelMock.emit("client-event");
      expect(listener).toHaveBeenCalledTimes(1);
      expect(otherListener).toHaveBeenCalledTimes(1);

      expect(proxiedChannelMock.members.myID).toBe("my-id");
      expect(otherProxiedChannelMock.members.myID).toBe("your-id");

      // cleanup
      client.unsubscribe("presence-channel");
      otherClient.unsubscribe("presence-channel");
    });
  });

  describe("#bind", () => {
    it("should not bind if client.id is undefined", () => {
      client.id = undefined;
      proxiedChannelMock.bind("never-bound-event", () => {});
      expect(proxiedChannelMock.callbacks["never-bound-event"]).toBeUndefined();
    });
  });

  describe("#subscribe", () => {
    it("should trigger internal events such as pusher:subscription_succeeded", async () => {
      const listener = jest.fn() as any;
      const client = createClient("my-id", {});
      const channel = client.subscribe("presence-channel");
      await channel.bind("pusher:subscription_succeeded", listener);
      expect(listener).toHaveBeenCalledTimes(1);
      await channel.unbind("pusher:subscription_succeeded", listener);
    });
    it("should trigger external events such as pusher:member_added", async () => {
      const listener = jest.fn() as any;
      const client = createClient("my-id", {});
      const otherClient = createClient("your-id", {});
      const channel = client.subscribe("presence-channel");
      await channel.bind("pusher:member_added", listener);
      await otherClient.subscribe("presence-channel");
      await expect(listener).toHaveBeenCalledTimes(1);
      await channel.unbind("pusher:member_added", listener);
    });
  });
  describe("#unsubscribe", () => {
    it("should trigger external events such as pusher:member_removed", async () => {
      const listener = jest.fn() as any;
      const client = createClient("my-id", {});
      const otherClient = createClient("your-id", {});
      const channel = client.subscribe("presence-channel");
      channel.bind("pusher:member_removed", listener);
      otherClient.subscribe("presence-channel");
      otherClient.unsubscribe("presence-channel");

      await expect(listener).toHaveBeenCalledTimes(1);
      channel.unbind("pusher:member_removed", listener);
    });
  });
});
