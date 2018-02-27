import PusherMock from '../pusher-js-mock';

describe('PusherMock', () => {
  let pusherMock;

  beforeEach(() => {
    pusherMock = new PusherMock();
  });

  it('initializes channels object', () => {
    expect(pusherMock.channels).toEqual({})
  });

  describe('#channel', () => {
    it('returns instance of PusherChannelMock', () => {
      expect(pusherMock.channel('my-channel')).toBeDefined()
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
        expect(pusherMock.channel('my-channel')).toBeDefined()
      });

      it('adds new channel to channels object', () => {
        expect(pusherMock.channels).toMatchObject({ 'my-channel': {} });
      });
    });
  });

  describe('#subscribe', () => {
    it('returns instance of PusherChannelMock', () => {
      expect(pusherMock.channel('my-channel')).toBeDefined()
    });

    it('adds new channel to channels object', () => {
      pusherMock.subscribe('my-channel');
      expect(pusherMock.channels).toMatchObject({ 'my-channel': {} })
    });
  });
});
