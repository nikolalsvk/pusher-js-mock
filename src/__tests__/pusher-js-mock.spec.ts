import { PusherMock } from '../index';

describe('PusherMock', () => {
  let pusherMock: PusherMock;

  beforeEach(() => {
    pusherMock = new PusherMock();
  });

  it('initializes channels object', () => {
    expect(pusherMock.channels).toEqual({});
  });

  describe('#channel', () => {
    it('returns instance of PusherChannelMock', () => {
      expect(pusherMock.channel('my-channel')).toBeDefined();
    });

    it('adds new channel to channels object', () => {
      pusherMock.channel('my-channel');
      expect(pusherMock.channels).toMatchObject({ 'my-channel': {} });
    });

    describe('channel is already added to channels object', () => {
      beforeEach(() => {
        pusherMock.channel('my-channel');
      });

      it('returns instance of PusherChannelMock', () => {
        expect(pusherMock.channel('my-channel')).toBeDefined();
      });

      it('adds new channel to channels object', () => {
        expect(pusherMock.channels).toMatchObject({ 'my-channel': {} });
      });
    });
  });

  describe('#subscribe', () => {
    it('returns instance of PusherChannelMock', () => {
      expect(pusherMock.channel('my-channel')).toBeDefined();
    });

    it('adds new channel to channels object', () => {
      pusherMock.subscribe('my-channel');
      expect(pusherMock.channels).toMatchObject({ 'my-channel': {} });
    });
  });

  describe('#unsubscribe', () => {
    describe('channel name is inside channels object', () => {
      it('removes channel from channels object', () => {
        pusherMock.subscribe('my-channel');
        pusherMock.unsubscribe('my-channel');
        expect(pusherMock.channels).toEqual({});
      });
    });

    describe('channel name is not inside channels object', () => {
      it('removes channel from channels object', () => {
        pusherMock.unsubscribe('my-channel');
        expect(pusherMock.channels).toEqual({});
      });
    });
  });
});
