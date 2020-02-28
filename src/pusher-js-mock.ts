import { Config } from 'pusher-js';
import PusherMockInstance from './pusher-js-mock-instance';

/** Class representing fake Pusher Client. */
class PusherMock {
  public id: string | undefined = undefined;
  public info: Record<string, any> | undefined = undefined;
  public clientKey: string | undefined;
  public config: Config | undefined;

  public channels = PusherMockInstance.channels;
  public channel = PusherMockInstance.channel;

  /** Initialize PusherMock */
  constructor(clientKey?: string, config?: Config) {
    this.clientKey = clientKey;
    this.config = config;
  }

  /**
   * Mock subscribing to a channel.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  public subscribe(name: string) {
    if (name.includes('presence-')) {
      const callback = (errored: boolean, auth: any) => {
        if (!errored) {
          this.id = auth.id;
          this.info = auth.info;
        }
      };

      this.config?.authorizer
        ? this.config.authorizer({} as any, {}).authorize({ name } as any, callback)
        : callback(false, {
            id: Math.random()
              .toString(36)
              .substr(2, 9),
            info: {},
          } as any);
    }
    return PusherMockInstance.channel(name, this);
  }

  /**
   * Unsubscribe from a mocked channel.
   * @param {String} name - name of the channel.
   */
  public unsubscribe(name: string) {
    if (name in PusherMockInstance.channels) {
      PusherMockInstance.channels[name].callbacks = {};
      delete PusherMockInstance.channels[name];
    }
  }
}

export default PusherMock;
