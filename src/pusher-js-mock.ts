import { proxyPresenceChannel } from './proxyPresenceChannel';
import PusherChannelMock from './pusher-channel-mock';
import PusherPresenceChannelMock from './pusher-presence-channel-mock';

/** Interface for storing channels */
interface IChannels {
  [name: string]: any;
}

/** Class representing fake Pusher. */
class PusherMock {
  public channels: IChannels;
  public id: string;
  public info: Record<string, any>;

  /** Initialize PusherMock with empty channels object and generatedId if not provided. */
  constructor(
    id: string = Math.random()
      .toString(36)
      .substr(2, 9),
    info: Record<string, any> = {}
  ) {
    this.channels = {};
    this.id = id;
    this.info = info;
  }

  /**
   * Get channel by its name.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  public channel(name: string) {
    const presenceChannel = name.includes('presence-');
    if (!this.channels[name]) {
      this.channels[name] = presenceChannel
        ? new PusherPresenceChannelMock(name)
        : new PusherChannelMock(name);
    }

    return presenceChannel ? proxyPresenceChannel(this.channels[name], this) : this.channels[name];
  }

  /**
   * Mock subscribing to a channel.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  public subscribe(name: string) {
    return this.channel(name);
  }

  /**
   * Unsubscribe from a mocked channel.
   * @param {String} name - name of the channel.
   */
  public unsubscribe(name: string) {
    if (name in this.channels) {
      this.channels[name].callbacks = {};
      delete this.channels[name];
    }
  }
}

export default PusherMock;
