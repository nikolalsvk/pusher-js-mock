import { PusherChannelMock } from "../index";

describe("PusherChannelMock", () => {
  let channelMock: PusherChannelMock;

  beforeEach(() => {
    channelMock = new PusherChannelMock();
  });

  it("initializes callbacks object", () => {
    expect(channelMock.callbacks).toEqual({});
  });

  describe("#bind", () => {
    it("adds name: callback to callbacks object", () => {
      const callback = () => {};
      channelMock.bind("my-channel", callback);

      expect(channelMock.callbacks).toMatchObject({ "my-channel": [callback] });
      expect(channelMock.callbacks["my-channel"]).toEqual([callback]);
    });

    it("returns the channel mock instance", () => {
      expect(channelMock.bind("my-channel", jest.fn())).toEqual(channelMock);
    });
  });

  describe("#unbind_all", () => {
    it("clears events from all the callbacks", () => {
      const firstCallback = jest.fn();
      const secondCallback = jest.fn();
      channelMock.bind("first-channel", firstCallback);
      channelMock.bind("second-channel", secondCallback);

      channelMock.unbind_all();
      channelMock.emit("first-channel");
      channelMock.emit("second-channel");

      expect(firstCallback).not.toHaveBeenCalled();
      expect(secondCallback).not.toHaveBeenCalled();
      expect(channelMock.callbacks).toEqual({});
    });

    it("returns the channel mock instance", () => {
      expect(channelMock.unbind_all()).toEqual(channelMock);
    });
  });

  describe("#unbind", () => {
    describe("with callbacks defined for the event", () => {
      it("removes name: callback from callbacks object", () => {
        const callback = () => {};
        channelMock.bind("my-channel", callback);
        channelMock.unbind("my-channel", callback);

        expect(channelMock.callbacks).toEqual({
          "my-channel": []
        });
      });
    });

    describe("without callbacks defined for the event", () => {
      it("removes name: callback from callbacks object", () => {
        const callback = () => {};
        channelMock.unbind("my-channel", callback);

        expect(channelMock.callbacks).toEqual({
          "my-channel": []
        });
      });
    });

    it("returns the channel mock instance", () => {
      expect(channelMock.unbind("my-channel", jest.fn())).toEqual(channelMock);
    });
  });

  describe("#emit", () => {
    describe("callback is defined for given channel name", () => {
      let callback: () => void;

      beforeEach(() => {
        callback = jest.fn();
        channelMock.bind("my-channel", callback);
      });

      it("calls callback", () => {
        channelMock.emit("my-channel");

        expect(callback).toHaveBeenCalledTimes(1);
      });

      it("calls callback with data", () => {
        const data = "you used to call me on my cellphone";
        channelMock.emit("my-channel", data);

        expect(callback).toBeCalledWith("you used to call me on my cellphone");
      });
    });

    describe("callback is not defined for given channel name", () => {
      it("returns null", () => {
        const callback = jest.fn();
        channelMock.emit("my-channel");

        expect(callback).not.toHaveBeenCalled();
      });
    });

    it("returns the channel mock instance", () => {
      expect(channelMock.emit("my-channel")).toEqual(channelMock);
    });
  });

  describe("#trigger", () => {
    describe("callback is defined for given channel name", () => {
      let callback: () => void;

      beforeEach(() => {
        callback = jest.fn();
        channelMock.bind("my-channel", callback);
      });

      it("calls callback", () => {
        channelMock.trigger("my-channel");

        expect(callback).toHaveBeenCalledTimes(1);
      });

      it("calls callback with data", () => {
        const data = "you used to call me on my cellphone";
        channelMock.trigger("my-channel", data);

        expect(callback).toBeCalledWith("you used to call me on my cellphone");
      });
    });

    describe("callback is not defined for given channel name", () => {
      it("returns null", () => {
        const callback = jest.fn();
        channelMock.trigger("my-channel");

        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
});
