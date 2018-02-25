import PusherClassExample from '../index'
import Pusher from 'pusher-js';

jest.mock("pusher-js", () => {
  const Pusher = require('../../../src/pusher-js-mock')

  return Pusher
})

describe("PusherClassExample", () => {
  let pusherClassExample

  beforeEach(() => {
    pusherClassExample = new PusherClassExample()
  })

  describe("subscribeToChannel", () => {
    it("returns a channel", () => {
      expect(pusherClassExample.subscribeToChannel("my-channel")).toEqual({ callbacks: {} })
    })
  })
})
