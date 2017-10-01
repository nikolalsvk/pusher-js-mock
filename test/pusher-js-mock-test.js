import { expect } from 'chai'
import PusherMock from '../src/pusher-js-mock'

describe("PusherMock", () => {
  let pusherMock;

  beforeEach(() => {
    pusherMock = new PusherMock();
  })

  it("should have channels", () => {
    expect(pusherMock.channels).to.be.empty;
  })

  describe("#channel", () => {
    it("returns instance of PusherChannelMock", () => {
      expect(pusherMock.channel("my-channel")).to.be.an('object');
    })

    it("adds new channel to channels array", () => {
      pusherMock.channel("my-channel");
      expect(pusherMock.channels).to.have.all.keys("my-channel");
    })

    describe("channel is already added to channels array", () => {
      beforeEach(() => {
        pusherMock.channel("my-channel");
      })

      it("returns instance of PusherChannelMock", () => {
        expect(pusherMock.channel("my-channel")).to.be.an('object');
      })

      it("adds new channel to channels array", () => {
        expect(pusherMock.channels).to.have.all.keys("my-channel");
      })
    })
  })

  describe("#subscribe", () => {
    it("returns instance of PusherChannelMock", () => {
      expect(pusherMock.subscribe("my-channel")).to.be.an('object');
    })

    it("adds new channel to channels array", () => {
      pusherMock.subscribe("my-channel");
      expect(pusherMock.channels).to.have.all.keys("my-channel");
    })
  })
})
