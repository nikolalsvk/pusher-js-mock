import PusherMock from './pusher-js-mock';
/** Interface for storing channels */
export interface IChannels {
    [name: string]: any;
}
declare class PusherMockInstance {
    channels: IChannels;
    constructor();
    /**
     * Get channel by its name.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    channel(name: string, client?: PusherMock): any;
}
declare const _default: PusherMockInstance;
export default _default;
