import { Member } from 'pusher-js';
import Members from './members';
import PusherChannelMock from './pusher-channel-mock';

export interface IMember {
  id: string;
  info: Record<string, any>;
}

/** Basic augmentation of the PusherChannel class. */
class PusherPresenceChannelMock extends PusherChannelMock {
  public members: Members;
  public me: Member<Record<string, any>> | undefined;
  public myID: string | undefined;

  /**
   * Initialise members object when created.
   * `pusher-js` provides all the functionality we need.
   */
  constructor(name: string = 'presence-channel') {
    super(name);
    this.members = new Members();
  }
}

export default PusherPresenceChannelMock;
