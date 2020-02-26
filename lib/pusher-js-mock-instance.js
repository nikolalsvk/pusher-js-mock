"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxyPresenceChannel_1 = require("./proxyPresenceChannel");
var pusher_channel_mock_1 = require("./pusher-channel-mock");
var pusher_js_mock_1 = require("./pusher-js-mock");
var pusher_presence_channel_mock_1 = require("./pusher-presence-channel-mock");
var PusherMockInstance = /** @class */ (function () {
    function PusherMockInstance() {
        this.channels = {};
    }
    /**
     * Get channel by its name.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    PusherMockInstance.prototype.channel = function (name, client) {
        if (client === void 0) { client = new pusher_js_mock_1.default(); }
        var presenceChannel = name.includes('presence-');
        if (!this.channels[name]) {
            this.channels[name] = presenceChannel
                ? new pusher_presence_channel_mock_1.default(name)
                : new pusher_channel_mock_1.default(name);
        }
        return presenceChannel
            ? proxyPresenceChannel_1.proxyPresenceChannel(this.channels[name], client)
            : this.channels[name];
    };
    return PusherMockInstance;
}());
exports.default = new PusherMockInstance();
