import { Member } from 'pusher-js';
import Members from './members';
import PusherChannelMock from './pusher-channel-mock';
export interface IMember {
    id: string;
    info: Record<string, any>;
}
/** Basic augmentation of the PusherChannel class. */
declare class PusherPresenceChannelMock extends PusherChannelMock {
    members: Members;
    me: Member<Record<string, any>> | undefined;
    myID: string | undefined;
    /** Alias to match actual API for client events */
    trigger: (name: string, data?: any) => void;
    /**
     * Initialise members object when created.
     * `pusher-js` provides all the functionality we need.
     */
    constructor(name?: string);
}
export default PusherPresenceChannelMock;
