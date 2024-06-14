import { proxyPresenceChannel } from "./proxy-presence-channel";
import PusherChannelMock from "./pusher-channel-mock";
import PusherMock from "./pusher-js-mock";
import PusherPresenceChannelMock from "./pusher-presence-channel-mock";

/** Interface for storing channels */
export interface IChannels {
  [name: string]: any;
}

class PusherMockInstance {
  public channels: IChannels;
  public connection: any;

  constructor() {
    this.channels = {};
    this.connection = new PusherChannelMock("connection");
    this.channel = this.channel.bind(this);
  }

  /**
   * Get channel by its name.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  public channel(name: string, client: PusherMock = new PusherMock()) {
    const presenceChannel = name.includes("presence-");
    if (!this.channels[name]) {
      this.channels[name] = presenceChannel
        ? new PusherPresenceChannelMock(name)
        : new PusherChannelMock(name);
    }

    const channel = presenceChannel
      ? proxyPresenceChannel(this.channels[name], client)
      : this.channels[name];

    return new Proxy(channel, {
      get(target, key) {
        switch (key) {
          case "pusher":
            return client;
          default:
            return target[key];
        }
      }
    });
  }

  /**
   * Resets the instance to a fresh state, i.e. no channels.
   */
  public reset() {
    this.channels = {};
  }
}

export default new PusherMockInstance();
