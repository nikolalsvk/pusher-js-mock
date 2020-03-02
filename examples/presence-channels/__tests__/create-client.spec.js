import createClient from "../create-client";

// mock the authorize function and pusher
jest.mock("pusher-js", () => require("../../../src/pusher-js-mock"));
jest.mock("../getAuthSomehow", () => ({
  getAuthSomehow: (id, info) => ({ id, info }),
}));

it("should create a presence channel", async () => {
  // arrange: create pusher client
  const pusher = createClient({ id: "my-id", info: { role: "moderator" } });

  // act: required to ensure pusher events are called, i.e. pusher:member_added
  const presenceChannel = await pusher.subscribe("presence-channel");

  // assert: presenceChannel has the properties we expect it to.
  expect(presenceChannel.members.myID).toBe("my-id");
  expect(presenceChannel.members.me).toEqual({
    id: "my-id",
    info: { role: "moderator" },
  });
  expect(presenceChannel.members.members).toEqual({
    "my-id": { role: "moderator" },
  });
});
