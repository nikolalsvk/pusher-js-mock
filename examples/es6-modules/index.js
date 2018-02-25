import Pusher from 'pusher-js';

class PusherClassExample {
  constructor() {
    // You can get your APP_KEY and APP_CLUSTER from the Pusher dashboard.
    const APP_KEY = "APP_KEY"
    const APP_CLUSTER = "APP_CLUSTER"

    this.socket = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
    });
  }

  subscribeToChannel(channelName) {
    const channel = this.socket.subscribe(channelName)

    return channel
  }
}

export default PusherClassExample
