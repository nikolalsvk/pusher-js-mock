import { PusherMock, PusherPresenceChannelMock } from '../';
import { proxyPresenceChannel } from '../proxyPresenceChannel';

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
  let channelMock: PusherPresenceChannelMock;
  let proxiedChannelMock: PusherPresenceChannelMock;
  let otherProxiedChannelMock: PusherPresenceChannelMock;

  beforeEach(() => {
    const client = new PusherMock('my-id', {});
    const otherClient = new PusherMock('your-id', {});

    channelMock = new PusherPresenceChannelMock();
    proxiedChannelMock = proxyPresenceChannel(channelMock, client);
    otherProxiedChannelMock = proxyPresenceChannel(channelMock, otherClient);
  });

  it(" doesn't proxy class members it doesn't care about", () => {
    expect(proxiedChannelMock.subscribed).toBe(true);
  });

  it(' add new members to the channel', () => {
    expect(channelMock.members.count).toBe(2);
    expect(channelMock.members.get('my-id')).toEqual({ id: 'my-id', info: {} });
    expect(channelMock.members.get('your-id')).toEqual({ id: 'your-id', info: {} });
  });

  it(' correctly proxies the channel object per client', () => {
    expect(channelMock.myID).toBeUndefined;
    expect(channelMock.me).toBeUndefined();
    expect(channelMock.IS_PROXY).toBeUndefined();

    expect(proxiedChannelMock.myID).toBe('my-id');
    expect(proxiedChannelMock.me).toEqual({ id: 'my-id', info: {} });
    expect(proxiedChannelMock.IS_PROXY).toBeDefined();
  });

  it(' allows multiple clients to subscribe', () => {
    expect(proxiedChannelMock.myID).toBe('my-id');
    expect(otherProxiedChannelMock.myID).toBe('your-id');

    expect(channelMock.members.count).toBe(2);
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
      channelMock.bind('event', callback);
      channelMock.trigger('event');
      expect(callback).toHaveBeenCalled();
    });
  });
});
