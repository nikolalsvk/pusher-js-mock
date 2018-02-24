import PusherMock from './pusher-js-mock';

/**
 * Class represents fake PusherFactory.
 *
 * @example
 * import { PusherFactoryMock } from "pusher-js-mock";
 *
 * ...
 *
 * beforeEach(() => {
 *   const pusherFactoryMock = new PusherFactoryMock()
 *
 *   window.PusherFactory = pusherFactoryMock
 *
 *   pusher = pusherFactoryMock.pusherClient()
 * })
 */
class PusherFactoryMock {
  /**
   * Initialize PusherFactoryMock with pusherKey and sets a
   * pusherClientInstance
   * @param {String} pusherKey - Pusher app key
   */
  constructor(pusherKey) {
    this.pusherKey = pusherKey;
    this.pusherClientInstance = new PusherMock();
  }

  /**
   * Getter for pusherClientInstance
   * @returns {PusherMock} PusherMock object that reprents pusherClient
   */
  pusherClient() {
    return this.pusherClientInstance;
  }
}

export default PusherFactoryMock;
