import { PusherChannelMock } from ".";
import { IProxiedCallback } from "./proxy-presence-channel";
import { emitConnectionEvents, emitDisconnectionEvents } from "./pusher-events";
import PusherMockInstance from "./pusher-js-mock-instance";
import { isPresenceChannel } from "./pusher-presence-channel-mock";

export interface IPusherMockOptions {
  authorizer: (
    channel: PusherChannelMock
  ) => {
    authorize: (
      socketId: string,
      callback: (error: boolean, authInfo: any) => void
    ) => void;
  };
}

/** Class representing fake Pusher Client. */
class PusherMock {
  public id: string | undefined = undefined;
  public info: Record<string, any> | undefined = undefined;
  public clientKey: string | undefined;
  public config: IPusherMockOptions | undefined;

  public connection = PusherMockInstance.connection;
  public channels = PusherMockInstance.channels;
  public channel = PusherMockInstance.channel;

  /** Initialize PusherMock */
  constructor(clientKey?: string, config?: IPusherMockOptions) {
    this.clientKey = clientKey;
    this.config = config;
    this.setAuthInfo = this.setAuthInfo.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  public setAuthInfo(errored: boolean, auth: any) {
    if (!errored) {
      this.id = auth.id;
      this.info = auth.info;
    }
  }

  /**
   * Mock subscribing to a channel.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  public subscribe(name: string) {
    const channel = PusherMockInstance.channel(name, this);

    if (isPresenceChannel(channel)) {
      this.config?.authorizer
        ? this.config
            .authorizer({} as any)
            .authorize(channel as any, this.setAuthInfo)
        : this.setAuthInfo(false, {
            id: Math.random()
              .toString(36)
              .substr(2, 9),
            info: {}
          } as any);
      emitConnectionEvents(channel, this);
    }

    return channel;
  }

  /**
   * Unsubscribe from a mocked channel.
   * @param {String} name - name of the channel.
   */
  public unsubscribe(name: string) {
    if (name in PusherMockInstance.channels) {
      const channel = PusherMockInstance.channel(name, this);

      if (isPresenceChannel(channel)) {
        this.unsubscribePresence(name);
      } else {
        // public channel
        PusherMockInstance.channels[name].callbacks = {};
        delete PusherMockInstance.channels[name];
      }
    }
  }

  /**
   * Bind a callback to an event on all channels
   * @param {String} name - name of the event to bind to.
   * @param {Function} callback - callback to be called on event.
   */
  public bind(name: string, callback: () => void) {
    Object.keys(this.channels).forEach(channelName => {
      this.channel(channelName).bind(name, callback);
    });
  }

  /**
   * Unbind a callback from an event on all channels
   * @param {String} name - name of the event to unbind from.
   * @param {Function} callback - callback to be called on event.
   */
  public unbind(name: string, callback: () => void) {
    Object.keys(this.channels).forEach(channelName => {
      this.channel(channelName).unbind(name, callback);
    });
  }

  /**
   * Returns a list of all channels
   */
  public allChannels() {
    return Object.values(this.channels);
  }

  /**
   * Unsubscribe from a mocked presence channel.
   * @param {String} name - name of the channel.
   */
  private unsubscribePresence(name: string) {
    const channel = PusherMockInstance.channels[name];
    emitDisconnectionEvents(channel, this);

    for (const key of Object.keys(channel.callbacks)) {
      // filter out any callbacks that are our own
      channel.callbacks[key] = channel.callbacks[key].filter(
        (cb: IProxiedCallback) => cb.owner !== this.id
      );

      // delete the callback list if there are no callbacks left
      if (channel.callbacks[key].length === 0) {
        delete channel.callbacks[key];
      }
    }

    // if there are no callback events left, delete the channel
    if (Object.keys(Object.assign({}, channel.callbacks)).length === 0) {
      delete PusherMockInstance.channels[name];
    }
  }
}

export default PusherMock;
