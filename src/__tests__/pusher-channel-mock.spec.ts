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
  });

  describe("#unbind", () => {
    describe("with callbacks defined for the event", () => {
      it("removes name: callback from callbacks object", () => {
        const callback = () => {};
        channelMock.bind("my-channel", callback);
        channelMock.unbind("my-channel", callback);

        expect(channelMock.callbacks).toEqual({
          "my-channel": [],
        });
      });
    });

    describe("without callbacks defined for the event", () => {
      it("removes name: callback from callbacks object", () => {
        const callback = () => {};
        channelMock.unbind("my-channel", callback);

        expect(channelMock.callbacks).toEqual({
          "my-channel": [],
        });
      });
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
  });
});
