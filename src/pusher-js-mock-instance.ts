import { proxyPresenceChannel } from "./proxyPresenceChannel";
import PusherChannelMock from "./pusher-channel-mock";
import PusherMock from "./pusher-js-mock";
import PusherPresenceChannelMock from "./pusher-presence-channel-mock";

/** Interface for storing channels */
export interface IChannels {
  [name: string]: any;
}

class PusherMockInstance {
  public channels: IChannels;

  constructor() {
    this.channels = {};
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

    return presenceChannel
      ? proxyPresenceChannel(this.channels[name], client)
      : this.channels[name];
  }
}

export default new PusherMockInstance();
