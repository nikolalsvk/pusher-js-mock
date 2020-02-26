"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var proxyPresenceChannel_1 = require("./proxyPresenceChannel");
var pusher_channel_mock_1 = require("./pusher-channel-mock");
var pusher_presence_channel_mock_1 = require("./pusher-presence-channel-mock");
/** Class representing fake Pusher. */
var PusherMock = /** @class */ (function () {
    /** Initialize PusherMock with empty channels object and generatedId if not provided. */
    function PusherMock(id, info) {
        if (id === void 0) { id = Math.random()
            .toString(36)
            .substr(2, 9); }
        if (info === void 0) { info = {}; }
        this.channels = {};
        this.id = id;
        this.info = info;
    }
    /**
     * Get channel by its name.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    PusherMock.prototype.channel = function (name) {
        var presenceChannel = name.includes('presence-');
        if (!this.channels[name]) {
            this.channels[name] = presenceChannel
                ? new pusher_presence_channel_mock_1.default(name)
                : new pusher_channel_mock_1.default(name);
        }
        return presenceChannel ? proxyPresenceChannel_1.proxyPresenceChannel(this.channels[name], this) : this.channels[name];
    };
    /**
     * Mock subscribing to a channel.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    PusherMock.prototype.subscribe = function (name) {
        return this.channel(name);
    };
    /**
     * Unsubscribe from a mocked channel.
     * @param {String} name - name of the channel.
     */
    PusherMock.prototype.unsubscribe = function (name) {
        if (name in this.channels) {
            this.channels[name].callbacks = {};
            delete this.channels[name];
        }
    };
    return PusherMock;
}());
exports.default = PusherMock;
