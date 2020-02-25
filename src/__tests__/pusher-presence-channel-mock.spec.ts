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
  beforeEach(() => {
    const client = new PusherMock('my-id', {});
    channelMock = new PusherPresenceChannelMock();
    proxiedChannelMock = proxyPresenceChannel(channelMock, client);
  });

  it(' adds a new member to the channel', () => {
    expect(channelMock.members.count).toBe(1);
    expect(channelMock.members.get('my-id')).toEqual({ id: 'my-id', info: {} });
  });

  it(' correctly proxies the channel object per client', () => {
    expect(channelMock.myID).toBe(undefined);
    expect(channelMock.me).toBe(undefined);

    expect(proxiedChannelMock.myID).toBe('my-id');
    expect(proxiedChannelMock.me).toEqual({ id: 'my-id', info: {} });
  });

  it(' allows multiple clients to subscribe', () => {
    const otherClient = new PusherMock('your-id', {});
    const otherProxiedChannelMock = proxyPresenceChannel(channelMock, otherClient);

    expect(proxiedChannelMock.myID).toBe('my-id');
    expect(otherProxiedChannelMock.myID).toBe('your-id');

    expect(channelMock.members.count).toBe(2);
  });

  it(" doesn'nt proxy class members it doesn'nt care about", () => {
    expect(proxiedChannelMock.subscribed).toBe(true);
  });
});
