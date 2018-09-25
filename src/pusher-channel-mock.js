/** Class representing a fake Pusher channel. */
class PusherChannelMock {
  /** Initialize PusherChannelMock with callbacks object. */
  constructor() {
    this.callbacks = {};
  }

  /**
   * Bind callback to an event name.
   * @param {String} name - name of the event.
   * @param {Function} callback - callback to be called on event.
   */
  bind(name, callback) {
    this.callbacks[name] = callback;
  }

  /**
   * Emit event with data.
   * @param {String} name - name of the event.
   * @param {*} data - data you wan't to pass in to callback function that gets * called.
   */
  emit(name, data) {
    const callback = this.callbacks[name];

    if (callback) {
      callback(data);
    }
  }
}

module.exports = PusherChannelMock;
