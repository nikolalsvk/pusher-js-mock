import PusherClassExample from '../index';

jest.mock('pusher-js', () => {
  const Pusher = require('pusher-js-mock').PusherMock;

  return Pusher;
});

describe('PusherClassExample', () => {
  let chat;

  beforeEach(() => {
    chat = new PusherClassExample();
  });

  describe('listenForMessages', () => {
    it('should subscribe to MESSAGE_CHANNEL properly', () => {
      // Set up callback
      const onNewMessage = jest.fn();

      // Run method under test
      const messages = chat.listenForMessages();

      // Simulate event
      messages.bind('new-message', onNewMessage);
      messages.emit('new-message', 'Hello World!');

      // Test expected method call
      expect(onNewMessage).toHaveBeenCalledTimes(1);
      expect(onNewMessage).toHaveBeenCalledWith('Hello World!');

      // Unbind listener
      messages.unbind('new-message', onNewMessage);
    });
  });

  describe('stopListeneningForMessages', () => {
    it('should unsubscribe from MESSAGE_CHANNEL properly', () => {
      // Set up callback
      const onNewMessage = jest.fn();

      // Listen for messages first, to verify that stopListeneningForMessages
      // unsubscribes
      const messages = chat.listenForMessages();
      messages.bind('new-message', onNewMessage);

      // Run method under test
      chat.stopListeneningForMessages();

      // Simulate event
      messages.emit('new-message', 'Hello World!');

      // Should no longer call the callback
      expect(onNewMessage).not.toHaveBeenCalled();

      // Unbind listener
      messages.unbind('new-message', onNewMessage);
    });
  });
});
