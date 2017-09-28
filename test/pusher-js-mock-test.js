import { expect } from 'chai'
import PusherMock from '../src/pusher-js-mock'

describe("PusherMock", () => {
  it("should have channels", () => {
    const pusherMock = new PusherMock()
    expect(pusherMock.channels).to.be.empty
  })
})
