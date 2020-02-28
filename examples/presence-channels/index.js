import Pusher from 'pusher-js';
export const createClient = ({ id, info }) =>
  new Pusher('APP_KEY', {
    cluster: 'APP_CLUSTER',
    // see https://github.com/pusher/pusher-js#authorizer-function
    authorizer: ({ name }) => ({
      authorize: (socketId, callback) => {
        // do auth stuff
        callback(false, { id, info });
      },
    }),
  });
