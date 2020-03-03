import Members from "./members";
import PusherChannelMock from "./pusher-channel-mock";

/** Basic augmentation of the PusherChannel class. */
class PusherPresenceChannelMock extends PusherChannelMock {
  public members: Members;

  /** Alias to match actual API for client events */
  public trigger = this.emit;
  public IS_PROXY?: boolean;

  /**
   * Initialise members object when created.
   * `pusher-js` provides all the functionality we need.
   * @param name The name of the channel to initialise
   * @returns PusherPresenceChannelMock the mocked presence channel
   */
  constructor(name: string = "presence-channel") {
    super(name);
    this.members = new Members();
  }
}

export default PusherPresenceChannelMock;
