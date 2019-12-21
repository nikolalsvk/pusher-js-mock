import PusherChannelMock from "./pusher-channel-mock";

interface IChannels {
  [name: string]: any;
}

/** Class representing fake Pusher. */
class PusherMock {
  public channels: IChannels;

  /** Initialize PusherMock with empty channels object. */
  constructor() {
    this.channels = {};
  }

  /**
   * Get channel by its name.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  public channel(name: string) {
    if (!this.channels[name]) {
      this.channels[name] = new PusherChannelMock();
    }

    return this.channels[name];
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
