import { createClient } from '../index';
jest.mock('pusher-js', () => require('../../../src/pusher-js-mock'));

// mock the response from the authorize endpoint
global.fetch = jest
  .fn()
  .mockImplementation(() =>
    Promise.resolve({ json: () => ({ id: 'my-id', info: { role: 'moderator' } }) })
  );

test('should mock presence channels', () => {
  const pusher = createClient({ id: 'my-id', info: { role: 'moderator' } });
  const channel = pusher.subscribe('presence-channel');

  expect(channel.members).toEqual({
    count: 1,
    members: { 'my-id': { role: 'moderator' } },
    me: {
      id: 'my-id',
      info: { role: 'moderator' },
    },
    myID: 'my-id',
  });
});
