import { PusherMock, PusherPresenceChannelMock } from '../';
import { AuthInfo } from 'pusher-js';

describe('PusherPresenceChannelMock', () => {
  let channelMock: PusherPresenceChannelMock;

  beforeEach(() => {
    channelMock = new PusherPresenceChannelMock();
  });

  it(' sets a name (with a default fallback)', () => {
    expect(channelMock.name).toBe('presence-channel');
    const namedChannelMock = new PusherPresenceChannelMock('presence-custom-name');
    expect(namedChannelMock.name).toBe('presence-custom-name');
  });

  it('initializes members object', () => {
    expect(channelMock.members).toEqual({
      count: 0,
      members: {},
      me: null,
      myID: null,
    });
  });
});

describe('Proxied PusherPresenceChannelMock', () => {
  let client: PusherMock;
  let otherClient: PusherMock;
  let proxiedChannelMock: PusherPresenceChannelMock;
  let otherProxiedChannelMock: PusherPresenceChannelMock;

  const PRESENCE_CHANNEL = 'presence-channel';

  beforeEach(() => {
    client = new PusherMock('key', {
      authorizer: () => ({
        authorize: (socketId, callback) => {
          callback(false, ({ id: 'my-id', info: {} } as unknown) as AuthInfo);
        },
      }),
    });
    otherClient = new PusherMock('key', {
      authorizer: () => ({
        authorize: (socketId, callback) => {
          callback(false, ({ id: 'your-id', info: {} } as unknown) as AuthInfo);
        },
      }),
    });

    proxiedChannelMock = client.subscribe(PRESENCE_CHANNEL);
    otherProxiedChannelMock = otherClient.subscribe(PRESENCE_CHANNEL);
  });

  it(" doesn't proxy class members it doesn't care about", () => {
    expect(proxiedChannelMock.subscribed).toBe(true);
  });

  it(' add new members to the channel', () => {
    expect(proxiedChannelMock.members.count).toBe(2);
    expect(proxiedChannelMock.members.get('my-id')).toEqual({ id: 'my-id', info: {} });
    expect(proxiedChannelMock.members.get('your-id')).toEqual({ id: 'your-id', info: {} });
  });

  it(' correctly proxies the channel object per client', () => {
    expect(proxiedChannelMock.IS_PROXY).toBeDefined();

    expect(proxiedChannelMock.myID).toBe('my-id');
    expect(proxiedChannelMock.me).toEqual({ id: 'my-id', info: {} });
    expect(proxiedChannelMock.IS_PROXY).toBeDefined();
  });

  it(' allows multiple clients to subscribe', () => {
    expect(proxiedChannelMock.myID).toBe('my-id');
    expect(otherProxiedChannelMock.myID).toBe('your-id');

    expect(proxiedChannelMock.members.count).toBe(2);
  });

  describe('callback is not defined for given channel name', () => {
    it('returns null', () => {
      const callback = jest.fn();
      proxiedChannelMock.emit('custom-event');
      expect(callback).not.toHaveBeenCalled();
    });
  });

  it(' should not emit a members callback when that member emits an event', () => {
    const listener = jest.fn();
    proxiedChannelMock.bind('custom-event', listener);

    const otherListener = jest.fn();
    otherProxiedChannelMock.bind('custom-event', otherListener);

    proxiedChannelMock.emit('custom-event');
    expect(listener).toHaveBeenCalledTimes(0);
    expect(otherListener).toHaveBeenCalledTimes(1);

    otherProxiedChannelMock.emit('custom-event');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(otherListener).toHaveBeenCalledTimes(1);

    // cleanup
    proxiedChannelMock.unbind('custom-event', listener);
    otherProxiedChannelMock.unbind('custom-event', otherListener);
  });

  describe('#trigger', () => {
    it(' is an alias for emit', () => {
      let callback = jest.fn();
      proxiedChannelMock.bind('event', callback);
      proxiedChannelMock.trigger('event');
      expect(callback).toHaveBeenCalled();
    });
  });
  describe('Shared instance multiple clients', () => {
    it(' should trigger events cross-client', () => {
      // binding to the same event
      const listener = jest.fn();
      proxiedChannelMock.bind('client-event', listener);
      const otherListener = jest.fn();
      otherProxiedChannelMock.bind('client-event', otherListener);

      // should receive the others events
      proxiedChannelMock.emit('client-event');
      expect(listener).toHaveBeenCalledTimes(0);
      expect(otherListener).toHaveBeenCalledTimes(1);

      otherProxiedChannelMock.emit('client-event');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(otherListener).toHaveBeenCalledTimes(1);

      expect(proxiedChannelMock.myID).toBe('my-id');
      expect(otherProxiedChannelMock.myID).toBe('your-id');

      // cleanup
      client.unsubscribe('presence-channel');
      otherClient.unsubscribe('presence-channel');
    });
  });

  describe('#bind', () => {
    it('should not bind if client.id is undefined', () => {
      client.id = undefined;
      proxiedChannelMock.bind('never-bound-event', () => {});
      expect(proxiedChannelMock.callbacks['never-bound-event']).toBeUndefined();
    });
  });
});
