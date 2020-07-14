<p align="center">
  <img src='https://raw.githubusercontent.com/nikolalsvk/pusher-js-mock/master/logo.jpg' alt="pusher-js-mock logo" />

  <h1 align="center">👋 Welcome to pusher-js-mock</h1>

  <p align="center">
    <a href="https://badge.fury.io/js/pusher-js-mock" target="_blank">
     <img src="https://badge.fury.io/js/pusher-js-mock.svg" alt="npm version" />
    </a>
    <a href="https://semaphoreci.com/nikolalsvk/pusher-js-mock" target="_blank">
     <img src="https://semaphoreci.com/api/v1/nikolalsvk/pusher-js-mock/branches/master/shields_badge.svg" alt="Build Status" />
    </a>
    <a href="https://codeclimate.com/github/nikolalsvk/pusher-js-mock" target="_blank">
     <img src="https://codeclimate.com/github/nikolalsvk/pusher-js-mock/badges/gpa.svg" alt="Code Climate" />
    </a>
    <a href="https://codeclimate.com/github/nikolalsvk/pusher-js-mock/coverage" target="_blank">
     <img src="https://codeclimate.com/github/nikolalsvk/pusher-js-mock/badges/coverage.svg" alt="Test Coverage" />
    </a>
    <a href="https://www.codetriage.com/nikolalsvk/pusher-js-mock" target="_blank">
     <img src="https://www.codetriage.com/nikolalsvk/pusher-js-mock/badges/users.svg" alt="Open Source Helpers" />
    </a>
  </p>
  <p align="center">
    Mock <a href="https://github.com/pusher/pusher-js">Pusher.js</a> in your JavaScript tests with ease.
  </p>
</p>

## Installing ⏬

Using yarn:

```
yarn add --dev pusher-js-mock
```

Or using npm:

```
npm install -D pusher-js-mock
```

## Usage 🛠

- [Emitting an event 📶](#emitting-an-event-📶)
- [Listening for an event 👂](#listening-for-an-event-👂)
- [Emitting an event from connection 📶](#emitting-an-event-from-connection-📶)
- [Listening for an event from connection 👂](#listening-for-an-event-from-connection-👂)
- [Stubbing Pusher when imported from pusher-js package 📦](#stubbing-pusher-when-imported-from-pusher-js-package-📦)
- [Stubbing Pusher when used as a global variable 🌍](#stubbing-pusher-when-used-as-a-global-variable-🌍)
- [Mocking presence channels](#mocking-presence-channels)
  - [Using custom authorizer](#using-custom-authorizer)
  - [Pusher events emitted by presence channels](#pusher-events-emitted-by-presence-channels)

For more detailed examples, check out [`examples` directory](https://github.com/nikolalsvk/pusher-js-mock/tree/master/examples)
inside the project!

Also, you can check out the
[Docs](https://nikolalsvk.github.io/pusher-js-mock/) for even more information.

### Emitting an event 📶

If you need to mock a Pusher object in your tests that can
subscribe to channel, it's best to use PusherMock.

```javascript
import { PusherMock } from "pusher-js-mock";

// initializing PusherMock
const pusher = new PusherMock();

// subscribing to a Pusher channel
const channel = pusher.subscribe("my-channel");

// emitting an event
channel.emit("event-name");
```

### Listening for an event 👂

If you want to check whether your callback is getting called properly, you can
bind a callback to your channel, and then emit an event.

```javascript
import { PusherMock } from "pusher-js-mock";

descibe("listening for an event", () => {
  // initializing PusherMock
  const pusher = new PusherMock();

  // subscribing to a Pusher channel
  const channel = pusher.subscribe("my-channel");

  // define and attach a listener
  const listener = jest.fn();
  channel.bind("event-name", listener);

  // emitting an event
  channel.emit("event-name");

  // Expect listener to have been called
  expect(listener).toHaveBeenCalled();
});
```

### Emitting an event from connection 📶

The connection within pusher is mocked and can be used much like a channel channel. There's no need to subscribe to subscription as it's subscribed by default on pusher.

```javascript
import { PusherMock } from "pusher-js-mock";

// initializing PusherMock
const pusher = new PusherMock();

// emitting connection event
pusher.connection.emit("event-name");
```

### Listening for an event from connection 👂

As with channels, you can also listen to connection for events.

```javascript
import { PusherMock } from "pusher-js-mock";

descibe("listening for an event", () => {
  // initializing PusherMock
  const pusher = new PusherMock();

  // define and attach a listener
  const listener = jest.fn();
  pusher.connection.bind("event-name", listener);

  // emitting an event
  pusher.connection.emit("event-name");

  // Expect listener to have been called
  expect(listener).toHaveBeenCalled();
});
```

### Stubbing Pusher when imported from pusher-js package 📦

If you're using Pusher in your code in this or similar manner:

```javascript
import Pusher from "pusher-js";
```

You will need to mock Pusher in a specific way.

I suggest you use [Jest](https://jestjs.io/) to test your code.
To do this in Jest, you'll need something like this:

```javascript
jest.mock("pusher-js", () => {
  const Pusher = require("pusher-js-mock").PusherMock;
  return Pusher;
});
```

If you have tips on how to mock this using other testing frameworks, please
submit an issue or a pull request.

### Stubbing Pusher when used as a global variable 🌍

This shows how to stub a pusher if you're attaching it to window object in your
project. If you're attaching a PusherFactory to a `window` object like this in
your code:

```javascript
window.PusherFactory = {
  pusherClient: function(pusherKey) {
    return new Pusher(pusherKey);
  }
};
```

It's best for you to use PusherFactoryMock.

```javascript
import { PusherFactoryMock } from "pusher-js-mock";

// initialize instance of PusherFactoryMock
const pusherFactoryMock = new PusherFactoryMock();
// replace it with the object that is attached to a window
window.PusherFactory = pusherFactoryMock;

// get the Pusher client reference
pusher = pusherFactoryMock.pusherClient();
```

This way you'll just replace your PusherFactory with PusherFactoryMock.

### Mocking presence channels

This package also supports using presence channels for multiple clients. The
mock will automatically detect when `presence-` is in the channel name and
return a presence channel with `channel.members` filled out as expected. You
can pass in IDs and info via a custom authorizer, just as you would with the
real package.

#### Using custom authorizer

If you want, you can pass in a custom authorizer when creating a Pusher client.

```js
// create-client.js
import Pusher from "pusher-js";
import { getAuthSomehow } from "./getAuthSomehow";

export const createClient = ({ id, info }) =>
  new Pusher("APP_KEY", {
    cluster: "APP_CLUSTER",
    // see https://github.com/pusher/pusher-js#authorizer-function
    authorizer: ({ name }) => ({
      authorize: (socketId, callback) => {
        const auth = getAuthSomehow(id, info);
        callback(false, auth);
      }
    })
  });

export default createClient;
```

```js
// create-client.spec.js
import createClient from "../create-client";

// mock the authorize function and pusher
jest.mock("pusher-js", () => require("pusher-js-mock"));
jest.mock("../getAuthSomehow", () => ({
  getAuthSomehow: (id, info) => ({ id, info })
}));

it("should create a presence channel", async () => {
  // arrange: create pusher client
  const pusher = createClient({ id: "my-id", info: { role: "moderator" } });

  // act: required to ensure pusher events are called, i.e. pusher:member_added
  const presenceChannel = await pusher.subscribe("presence-channel");

  // assert: presenceChannel has the properties we expect it to.
  expect(presenceChannel.members.myID).toBe("my-id");
  expect(presenceChannel.members.me).toEqual({
    id: "my-id",
    info: { role: "moderator" }
  });
  expect(presenceChannel.members.members).toEqual({
    "my-id": { role: "moderator" }
  });
});
```

[Check out a code example of using presence channels](https://github.com/nikolalsvk/pusher-js-mock/tree/master/examples/presence-channels)

#### Pusher events emitted by presence channels

The mocked Pusher instance will also emit pusher internal events
`pusher:subscription_succeeded`, `pusher:member_added` and
`pusher:member_removed` to the relevant clients:

```js
it("should emit presence-channel events", async () => {
  const client = createClient({ id: "my-id" });
  const channel = client.subscribe("presence-channel");
  const listener = jest.fn();

  /**
   * On bind, pusher:subscription_succeded will trigger
   * for the client subscribing. Other clients will be
   * notified via pusher:member_added as below.
   */
  await channel.bind("pusher:subscription_succeeded", listener);
  expect(listener).toHaveBeenCalledTimes(1);

  /**
   * Create and subscribe a new client that will trigger the
   * pusher:member_added event. This only gets triggered for
   * clients are not the client subscribing
   */
  channel.bind("pusher:member_added", listener);
  const otherClient = createClient({ id: "your-id" });
  await otherClient.subscribe("presence-channel");
  expect(listener).toHaveBeenCalledTimes(2);

  /**
   * Unsubscribe the otherClient to trigger pusher:member_removed.
   * This only gets triggered for clients that are not the client
   * unsubscribing.
   */
  channel.bind("pusher:member_removed", listener);
  await otherClient.unsubscribe("presence-channel");
  expect(listener).toHaveBeenCalledTimes(3);
});
```

### [Code of Conduct](CODE_OF_CODUCT.md)

### [Contributing](CONTRIBUTING.md)

### Credits

Photo by [Octavian Rosca on Unsplash](https://unsplash.com/@tavi004)
