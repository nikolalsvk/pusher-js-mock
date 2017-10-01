import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import PusherMock from '../src/pusher-js-mock';

chai.use(dirtyChai);

describe('PusherMock', () => {
  let pusherMock;

  beforeEach(() => {
    pusherMock = new PusherMock();
  });

  it('initializes channels object', () => {
    expect(pusherMock.channels).to.be.empty();
  });

  describe('#channel', () => {
    it('returns instance of PusherChannelMock', () => {
      expect(pusherMock.channel('my-channel')).to.be.an('object');
    });

    it('adds new channel to channels object', () => {
      pusherMock.channel('my-channel');
      expect(pusherMock.channels).to.have.all.keys('my-channel');
    });

    describe('channel is already added to channels object', () => {
      beforeEach(() => {
        pusherMock.channel('my-channel');
      });

      it('returns instance of PusherChannelMock', () => {
        expect(pusherMock.channel('my-channel')).to.be.an('object');
      });

      it('adds new channel to channels object', () => {
        expect(pusherMock.channels).to.have.all.keys('my-channel');
      });
    });
  });

  describe('#subscribe', () => {
    it('returns instance of PusherChannelMock', () => {
      expect(pusherMock.subscribe('my-channel')).to.be.an('object');
    });

    it('adds new channel to channels object', () => {
      pusherMock.subscribe('my-channel');
      expect(pusherMock.channels).to.have.all.keys('my-channel');
    });
  });
});
