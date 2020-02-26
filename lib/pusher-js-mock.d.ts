/** Class representing fake Pusher Client. */
declare class PusherMock {
    id: string;
    info: Record<string, any>;
    channels: import("./pusher-js-mock-instance").IChannels;
    channel: (name: string, client?: PusherMock) => any;
    /** Initialize PusherMock with empty channels object and generatedId if not provided. */
    constructor(id?: string, info?: Record<string, any>);
    /**
     * Mock subscribing to a channel.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    subscribe(name: string): any;
    /**
     * Unsubscribe from a mocked channel.
     * @param {String} name - name of the channel.
     */
    unsubscribe(name: string): void;
}
export default PusherMock;
