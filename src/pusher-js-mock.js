import PusherChannelMock from './pusher-channel-mock';

/** Class representing fake Pusher. */
class PusherMock {
  /** Initialize PusherMock with empty channels object. */
  constructor() {
    this.channels = {};
  }

  /**
   * Get channel by its name.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  channel(name) {
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
  subscribe(name) {
    return this.channel(name);
  }
}

export default PusherMock;
