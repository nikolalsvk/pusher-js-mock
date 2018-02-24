import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import PusherChannelMock from '../pusher-channel-mock';

chai.use(dirtyChai);
chai.use(sinonChai);

describe('PusherChannelMock', () => {
  let channelMock;

  beforeEach(() => {
    channelMock = new PusherChannelMock();
  });

  it('initializes callbacks object', () => {
    expect(channelMock.callbacks).to.be.empty();
  });

  describe('#bind', () => {
    it('adds name: callback to callbacks object', () => {
      const callback = () => {};
      channelMock.bind('my-channel', callback);

      expect(channelMock.callbacks).to.have.all.keys('my-channel');
      expect(channelMock.callbacks['my-channel']).to.equal(callback);
    });
  });

  describe('#emit', () => {
    describe('callback is defined for given channel name', () => {
      let callback;

      beforeEach(() => {
        callback = sinon.spy();
        channelMock.bind('my-channel', callback);
      });

      it('calls callback', () => {
        channelMock.emit('my-channel');

        expect(callback).to.have.been.called();
      });

      it('calls callback with data', () => {
        const data = 'you used to call me on my cellphone';
        channelMock.emit('my-channel', data);

        expect(callback).to.have.been.calledWith('you used to call me on my cellphone');
      });
    });

    describe('callback is not defined for given channel name', () => {
      it('returns null', () => {
        const callback = sinon.spy();
        channelMock.emit('my-channel');

        expect(callback).to.not.have.been.called();
      });
    });
  });
});
