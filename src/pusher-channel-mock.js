/** Class representing fake Pusher channel. */
export default class PusherChannelMock {
  constructor() {
    this.callbacks = {};
  }

  bind(name, callback) {
    this.callbacks[name] = callback;
  }

  emit(name, data) {
    const callback = this.callbacks[name];

    if (callback) {
      callback(data);
    }
  }
}
