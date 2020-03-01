import PusherMock from "./pusher-js-mock";

/**
 * Class represents fake PusherFactory.
 *
 * @example <caption>Example of mocking global Pusher instance</caption>
 *
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
  public pusherKey: string;
  public pusherClientInstance: PusherMock;

  /**
   * Initialize PusherFactoryMock with pusherKey and sets a
   * pusherClientInstance
   * @param {String} pusherKey - Pusher app key
   */
  constructor(pusherKey: string, ...args: any[]) {
    this.pusherKey = pusherKey;
    this.pusherClientInstance = new PusherMock(...args);
  }

  /**
   * Getter for pusherClientInstance
   * @returns {PusherMock} PusherMock object that reprents pusherClient
   */
  public pusherClient() {
    return this.pusherClientInstance;
  }
}

export default PusherFactoryMock;
