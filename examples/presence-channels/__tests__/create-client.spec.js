import createClient from "../create-client";

// mock the authorize function and pusher
jest.mock("pusher-js", () => {
  const Pusher = require("pusher-js-mock").PusherMock;

  return Pusher;
});
jest.mock("../getAuthSomehow", () => ({
  getAuthSomehow: (id, info) => ({ id, info })
}));

describe("presence channels", () => {
  it("should create a presence channel", async () => {
    // arrange: create pusher client
    const pusher = createClient({ id: "my-id", info: { role: "moderator" } });

    // act: required to ensure pusher events are called, i.e. pusher:member_added
    const presenceChannel = await pusher.subscribe("presence-channel");

    // assert: presenceChannel has the properties we expect it to.
    expect(presenceChannel.members.myID).toBe("my-id");
    expect(presenceChannel.members.me).toEqual({
      id: "my-id",
      info: { role: "moderator" }
    });
    expect(presenceChannel.members.members).toEqual({
      "my-id": { role: "moderator" }
    });
  });

  it("should emit presence-channel events", async () => {
    const client = createClient({ id: "my-id" });
    const channel = client.subscribe("presence-channel");
    const listener = jest.fn();

    /**
     * On bind, pusher:subscription_succeded will trigger
     * for the client subscribing. Other clients will be
     * notified via pusher:member_added as below.
     */
    await channel.bind("pusher:subscription_succeeded", listener);
    expect(listener).toHaveBeenCalledTimes(1);

    /**
     * Create and subscribe a new client that will trigger the
     * pusher:member_added event. This only gets triggered for
     * clients are not the client subscribing
     */
    channel.bind("pusher:member_added", listener);
    const otherClient = createClient({ id: "your-id" });
    await otherClient.subscribe("presence-channel");
    expect(listener).toHaveBeenCalledTimes(2);

    /**
     * Unsubscribe the otherClient to trigger pusher:member_removed.
     * This only gets triggered for clients that are not the client
     * unsubscribing.
     */
    channel.bind("pusher:member_removed", listener);
    await otherClient.unsubscribe("presence-channel");
    expect(listener).toHaveBeenCalledTimes(3);
  });
});
