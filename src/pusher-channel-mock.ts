/** Interface for all the callbacks each Pusher event could potentially have */
interface ICallbacks {
  [key: string]: Array<() => void>;
}

/** Class representing a fake Pusher channel. */
class PusherChannelMock {
  public name: string;
  public callbacks: ICallbacks;
  public subscribed: boolean = true;

  /** Initialize PusherChannelMock with callbacks object. */
  constructor(name: string = "public-channel") {
    this.name = name;
    this.callbacks = {};
  }

  /**
   * Bind callback to an event name.
   * @param {String} name - name of the event.
   * @param {Function} callback - callback to be called on event.
   */
  public bind(name: string, callback: () => void) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(callback);
  }

  /**
   * Unbind callback from an event name.
   * @param {String} name - name of the event.
   * @param {Function} callback - callback to be called on event.
   */
  public unbind(name: string, callback: () => void) {
    this.callbacks[name] = (this.callbacks[name] || []).filter(
      cb => cb !== callback
    );
  }

  /**
   * Unbind callbacks from all the events.
   */
  public unbind_all() {
    this.callbacks = {};
  }

  /**
   * Emit event with data.
   * @param {String} name - name of the event.
   * @param {*} data - data you want to pass in to callback function that gets called.
   */
  public emit(name: string, data?: any) {
    const callbacks = this.callbacks[name];

    if (callbacks) {
      callbacks.forEach((cb: (data?: any) => void) => cb(data));
    }
  }

  /**
   * Trigger event with data.
   * @param {String} name - name of the event.
   * @param {*} data - data you want to pass in to callback function that gets called.
   */
  public trigger(name: string, data?: any) {
    this.emit(name, data);
  }
}

export default PusherChannelMock;
