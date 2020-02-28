import { PusherMock, PusherPresenceChannelMock } from '.';

export interface IProxiedCallback {
  (): () => void;
  owner: string;
}

/**
 * Proxies the instance of channel returned so we can still reference the
 * shared members object whilst passing our own ID & me properties
 */
export const proxyPresenceChannel = (channel: PusherPresenceChannelMock, client: PusherMock) => {
  // proxy the request so me and myID remain unique to the client in question
  const handler = {
    get(target: PusherPresenceChannelMock, key: keyof PusherPresenceChannelMock) {
      switch (key) {
        // attach this client's info the member specific calls
        case 'members':
          const original = target[key];
          // if (client.id) {
          original.myID = client.id;
          original.me = {
            id: client.id,
            info: client.info,
          };
          // }
          return original;
        // attach the owner of the callback so we can ignore it in future
        case 'bind':
          return function bind(eventName: string, callback: IProxiedCallback) {
            if (client.id) {
              callback.owner = client.id;
              target.bind(eventName, callback);
            }
          };

        // check the owner of the callback is not this client and then trigger it.
        case 'emit':
          return function emit(eventName: string, data?: any) {
            const callbacks = target.callbacks[eventName];
            const internals = ['pusher:subscription_succeeded'];

            if (callbacks) {
              callbacks.forEach((cb: (data?: any) => void) => {
                // if the eventName is internal, only call this callback if the owner is me
                // if the eventName isn't internal, only call this callback if the owner is not me
                if (
                  (internals.includes(eventName) && (cb as IProxiedCallback).owner === client.id) ||
                  (!internals.includes(eventName) && (cb as IProxiedCallback).owner !== client.id)
                ) {
                  cb(data);
                }
              });
            }
          };
        case 'IS_PROXY':
          return true;

        // return other class members as they were
        default:
          return target[key];
      }
    },
  };

  const proxiedChannel = new Proxy(channel, handler);

  setTimeout(() => {
    proxiedChannel.members.addMember({
      user_id: client.id,
      user_info: client.info,
    });

    /** Add the member to the members object when proxied.  */
    proxiedChannel.emit('pusher:member_added', {
      id: client.id,
      info: client.info,
    });

    proxiedChannel.emit('pusher:subscription_succeeded', proxiedChannel.members);
  });

  return proxiedChannel;
};
