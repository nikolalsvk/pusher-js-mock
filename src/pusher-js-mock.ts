import mockPusherInstance from './pusher-js-mock-instance';

/** Class representing fake Pusher Client. */
class PusherMock {
  public id: string;
  public info: Record<string, any>;
  public channels = mockPusherInstance.channels;
  public channel = mockPusherInstance.channel;

  /** Initialize PusherMock with empty channels object and generatedId if not provided. */
  constructor(
    id: string = Math.random()
      .toString(36)
      .substr(2, 9),
    info: Record<string, any> = {}
  ) {
    this.id = id;
    this.info = info;
  }

  /**
   * Mock subscribing to a channel.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  public subscribe(name: string) {
    return mockPusherInstance.channel(name, this);
  }

  /**
   * Unsubscribe from a mocked channel.
   * @param {String} name - name of the channel.
   */
  public unsubscribe(name: string) {
    if (name in mockPusherInstance.channels) {
      mockPusherInstance.channels[name].callbacks = {};
      delete mockPusherInstance.channels[name];
    }
  }
}

export default PusherMock;
