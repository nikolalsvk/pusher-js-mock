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
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(callback);
  }

  /**
   * Unbind callback from an event name.
   * @param {String} name - name of the event.
   * @param {Function} callback - callback to be called on event.
   */
  unbind(name, callback) {
    this.callbacks[name] = (this.callbacks[name] || []).filter(cb => cb !== callback);
  }

  /**
   * Emit event with data.
   * @param {String} name - name of the event.
   * @param {*} data - data you want to pass in to callback function that gets * called.
   */
  emit(name, data) {
    const callbacks = this.callbacks[name];

    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

module.exports = PusherChannelMock;
