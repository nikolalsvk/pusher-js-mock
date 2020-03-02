import { PusherMock, PusherPresenceChannelMock } from ".";
import Members from "./members";

export interface IProxiedCallback {
  (): (data?: any) => void;
  owner: string;
}

/**
 * Proxies the instance of channel returned so we can still reference the
 * shared members object whilst passing our own ID & me properties
 *
 * @param {PusherPresenceChannelMock} channel The channel we're mocking
 * @param {PusherMock} client the client we want to use to proxy the channel
 */
export const proxyPresenceChannel = (
  channel: PusherPresenceChannelMock,
  client: PusherMock
) => {
  const proxiedChannel = proxyChannel(channel, client);
  emitConnectionEvents(proxiedChannel, client);
  return proxiedChannel;
};

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
    info: client.info,
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
const proxyChannel = (
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
    },
  };

  return new Proxy(channel, handler);
};

/**
 * Emit connection events triggered by pusher
 * @param {PusherPresenceChannelMock} channel the channel we want to trigger this on
 * @param client the client we're using to emit the connection events
 * @returns void
 */
const emitConnectionEvents = async (
  channel: PusherPresenceChannelMock,
  client: PusherMock
) => {
  /** setTimeout simulates the async nature of adding members */
  await Promise.resolve();

  channel.members.addMember({
    user_id: client.id,
    user_info: client.info,
  });

  /** Add the member to the members object when proxied.  */
  channel.emit("pusher:member_added", {
    id: client.id,
    info: client.info,
  });

  /** Emit internal event */
  channel.emit("pusher:subscription_succeeded", channel.members);
};
