import { PusherMock, PusherPresenceChannelMock } from ".";
import Members from "./members";

export interface IProxiedCallback {
  (): (data?: any) => void;
  owner: string;
}

/**
 * Proxy custom members info to
 *
 * @param {Members} original The original members property on the channel
 * @param {PusherMock} client The client we're using to proxy the channel
 * @returns {Members} The proxied members property on the channel
 */
const proxyMembers = (original: Members, client: PusherMock) => {
  original.myID = client.id;
  original.me = {
    id: client.id,
    info: client.info
  };
  return original;
};

/**
 * Proxy the channel bind function and attach owner id for conditions in channel.emit
 *
 * @param original The channel being proxied
 * @param client The client we're using to proxy the channel
 * @returns void
 */
const proxyBind = (original: PusherPresenceChannelMock, client: PusherMock) => (
  eventName: string,
  callback: IProxiedCallback
) => {
  if (client.id) {
    callback.owner = client.id;
    original.bind(eventName, callback);
  }
};

/**
 * Proxy emit function and only trigger callbacks if conditions are correct, i.e.
 * - if the eventName is internal, only trigger the callback if the owner is me
 * - or if the eventName isn't internal, only call this callback if the owner is not me
 *
 * @param original The channel being proxied
 * @param client The client we're using to proxy the channel
 * @returns void
 */
const proxyEmit = (original: PusherPresenceChannelMock, client: PusherMock) => (
  eventName: string,
  data?: any
) => {
  const callbacks = original.callbacks[eventName];
  const internals = ["pusher:subscription_succeeded"];

  if (callbacks) {
    callbacks.forEach((cb: (data?: any) => void) => {
      if (
        (internals.includes(eventName) &&
          (cb as IProxiedCallback).owner === client.id) ||
        (!internals.includes(eventName) &&
          (cb as IProxiedCallback).owner !== client.id)
      ) {
        cb(data);
      }
    });
  }
};

/**
 * Create the proxied channel
 * @param {PusherPresenceChannelMock} channel the channel to be proxied
 * @param {PusherMock} client the client we'll use to proxy the channel
 * @returns {Proxy<PusherPresenceChannelMock>} the proxied channel
 */
export const proxyPresenceChannel = (
  channel: PusherPresenceChannelMock,
  client: PusherMock
) => {
  const handler = {
    /**
     * Proxies a channel and augments it with client specific information
     * @param target The channel we're proxying
     * @param key The attribute, property or method we're trapping
     * @returns {mixed} the result of the trapped function
     */
    get(
      target: PusherPresenceChannelMock,
      key: keyof PusherPresenceChannelMock
    ) {
      switch (key) {
        /** Attach this client's info the member specific calls */
        case "members":
          return proxyMembers(target.members, client);
        /** Attach the owner of the callback so we can ignore it in future */
        case "bind":
          return proxyBind(target, client);
        /** Emit callbacks on this channel, with conditions to check whether the callback should be called or not */
        case "emit":
          return proxyEmit(target, client);
        /** For developer experience, attach IS_PROXY flag to check whether the channel has been proxied or not */
        case "IS_PROXY":
          return true;
        default:
          return target[key];
      }
    }
  };

  return new Proxy(channel, handler);
};
