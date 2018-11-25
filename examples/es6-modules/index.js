import Pusher from 'pusher-js';

export const MESSAGE_CHANNEL = 'messages';

class PusherClassExample {
  constructor() {
    // You can get your APP_KEY and APP_CLUSTER from the Pusher dashboard.
    const APP_KEY = 'APP_KEY';
    const APP_CLUSTER = 'APP_CLUSTER';

    this.socket = new Pusher(APP_KEY, {
      cluster: APP_CLUSTER,
    });
  }

  listenForMessages() {
    const channel = this.socket.subscribe(MESSAGE_CHANNEL);

    return channel;
  }

  stopListeneningForMessages() {
    this.socket.unsubscribe(MESSAGE_CHANNEL);
  }
}

export default PusherClassExample;
