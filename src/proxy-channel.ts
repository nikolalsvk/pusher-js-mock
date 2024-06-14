import { PusherChannelMock, PusherMock } from ".";

/**
 * Create the proxied channel
 * @param {PusherChannelMock} channel the channel to be proxied
 * @param {PusherMock} client the client we'll use to proxy the channel
 * @returns {Proxy<PusherChannelMock>} the proxied channel
 */
export const proxyChannel = (
  channel: PusherChannelMock,
  client: PusherMock
) => {
  const handler = {
    /**
     * Proxies a channel and augments it with client specific information
     * @param target The channel we're proxying
     * @param key The attribute, property or method we're trapping
     * @returns {mixed} the result of the trapped function
     */
    get(target: PusherChannelMock, key: keyof PusherChannelMock) {
      switch (key) {
        case "IS_PROXY":
          return true;
        case "pusher":
          return client;
        default:
          return target[key];
      }
    }
  };

  return new Proxy(channel, handler);
};
