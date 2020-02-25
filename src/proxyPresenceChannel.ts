import { PusherMock, PusherPresenceChannelMock } from '.';

interface IProxiedCallback {
  (): () => void;
  owner: string;
}

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
        // attach this client's info the member specific calls
        case 'me':
          return target.members.get(client.id);
        case 'myID':
          return client.id;

        // attach the owner of the callback so we can ignore it in future
        case 'bind':
          return function bind(eventName: string, callback: IProxiedCallback) {
            callback.owner = client.id;
            target.bind(eventName, callback);
          };

        // check the owner of the callback is not this client and then trigger it.
        case 'emit':
          return function emit(eventName: string, data?: any) {
            const callbacks = target.callbacks[eventName];
            if (callbacks) {
              callbacks.forEach(
                (cb: (data?: any) => void) =>
                  (cb as IProxiedCallback).owner !== client.id && cb(data)
              );
            }
          };

        // return other class members as they were
        default:
          return target[name];
      }
    },
  };

  return new Proxy(channel, handler);
};
