import PusherChannelMock from '../pusher-channel-mock';

describe('PusherChannelMock', () => {
  let channelMock;

  beforeEach(() => {
    channelMock = new PusherChannelMock();
  });

  it('initializes callbacks object', () => {
    expect(channelMock.callbacks).toEqual({});
  });

  describe('#bind', () => {
    it('adds name: callback to callbacks object', () => {
      const callback = () => {};
      channelMock.bind('my-channel', callback);

      expect(channelMock.callbacks).toMatchObject({ 'my-channel': callback });
      expect(channelMock.callbacks['my-channel']).toEqual(callback);
    });
  });

  describe('#emit', () => {
    describe('callback is defined for given channel name', () => {
      let callback;

      beforeEach(() => {
        callback = jest.fn();
        channelMock.bind('my-channel', callback);
      });

      it('calls callback', () => {
        channelMock.emit('my-channel');

        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('calls callback with data', () => {
        const data = 'you used to call me on my cellphone';
        channelMock.emit('my-channel', data);

        expect(callback).toBeCalledWith('you used to call me on my cellphone');
      });
    });

    describe('callback is not defined for given channel name', () => {
      it('returns null', () => {
        const callback = jest.fn();
        channelMock.emit('my-channel');

        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
});
