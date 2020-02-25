import { PusherMock, PusherPresenceChannelMock } from '.';

/**
 * Proxies the instance of channel returned so we can still reference the
 * shared members object whilst passing our own ID & me properties
 */
export const proxyPresenceChannel = (channel: PusherPresenceChannelMock, client: PusherMock) => {
  /** Add the member to the members object when  */
  channel.members.addMember({
    user_id: client.id,
    user_info: client.info,
  });

  // emit channel events
  channel.emit('pusher:subscription_succeeded', {
    members: channel.members,
  });
  channel.emit('pusher:member_added', {
    id: client.id,
    info: client.info,
  });

  // proxy the request so me and myID remain unique to the client in question
  const handler = {
    get(target: PusherPresenceChannelMock, name: keyof PusherPresenceChannelMock) {
      switch (name) {
        case 'me':
          return target.members.get(client.id);
        case 'myID':
          return client.id;
        default:
          return target[name];
      }
    },
  };

  return new Proxy(channel, handler);
};
