/** Interface for storing channels */
interface IChannels {
    [name: string]: any;
}
/** Class representing fake Pusher. */
declare class PusherMock {
    channels: IChannels;
    id: string;
    info: Record<string, any>;
    /** Initialize PusherMock with empty channels object and generatedId if not provided. */
    constructor(id?: string, info?: Record<string, any>);
    /**
     * Get channel by its name.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    channel(name: string): any;
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
