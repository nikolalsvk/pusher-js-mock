import { PusherMock, PusherPresenceChannelMock } from ".";

/**
 * Emit connection events triggered by pusher
 * @param {PusherPresenceChannelMock} channel the channel we want to trigger this on
 * @param client the client we're using to emit the connection events
 * @returns void
 */
export const emitConnectionEvents = async (
  channel: PusherPresenceChannelMock,
  client: PusherMock
) => {
  /** setTimeout simulates the async nature of adding members */
  await Promise.resolve();

  /** Add member to the members object */
  channel.members.addMember({
    user_id: client.id,
    user_info: client.info,
  });

  /** emit external event to other connected clients */
  channel.emit("pusher:member_added", {
    id: client.id,
    info: client.info,
  });

  /** Emit internal event */
  channel.emit("pusher:subscription_succeeded", channel.members);
};

/**
 * Emit disconnection events triggered by pusher
 * @param {PusherPresenceChannelMock} channel the channel we want to trigger this on
 * @param client the client we're using to emit the connection events
 * @returns void
 */
export const emitDisconnectionEvents = (
  channel: PusherPresenceChannelMock,
  client: PusherMock
) => {
  /** Remove member from the members object */
  channel.members.removeMember({
    user_id: client.id,
    user_info: client.info,
  });

  /** emit external event to other connected clients */
  channel.emit("pusher:member_removed", {
    id: client.id,
    info: client.info,
  });
};
