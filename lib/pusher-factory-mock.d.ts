import PusherMock from './pusher-js-mock';
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
declare class PusherFactoryMock {
    pusherKey: string;
    pusherClientInstance: PusherMock;
    /**
     * Initialize PusherFactoryMock with pusherKey and sets a
     * pusherClientInstance
     * @param {String} pusherKey - Pusher app key
     */
    constructor(pusherKey: string, ...args: any[]);
    /**
     * Getter for pusherClientInstance
     * @returns {PusherMock} PusherMock object that reprents pusherClient
     */
    pusherClient(): PusherMock;
}
export default PusherFactoryMock;
