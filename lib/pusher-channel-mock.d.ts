/** Interface for all the callbacks each Pusher event could potentially have */
interface ICallbacks {
    [key: string]: Array<() => void>;
}
/** Class representing a fake Pusher channel. */
declare class PusherChannelMock {
    name: string;
    callbacks: ICallbacks;
    subscribed: boolean;
    /** Initialize PusherChannelMock with callbacks object. */
    constructor(name?: string);
    /**
     * Bind callback to an event name.
     * @param {String} name - name of the event.
     * @param {Function} callback - callback to be called on event.
     */
    bind(name: string, callback: () => void): void;
    /**
     * Unbind callback from an event name.
     * @param {String} name - name of the event.
     * @param {Function} callback - callback to be called on event.
     */
    unbind(name: string, callback: () => void): void;
    /**
     * Emit event with data.
     * @param {String} name - name of the event.
     * @param {*} data - data you want to pass in to callback function that gets called.
     */
    emit(name: string, data?: any): void;
}
export default PusherChannelMock;
