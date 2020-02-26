"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pusher_js_mock_instance_1 = require("./pusher-js-mock-instance");
/** Class representing fake Pusher Client. */
var PusherMock = /** @class */ (function () {
    /** Initialize PusherMock with empty channels object and generatedId if not provided. */
    function PusherMock(id, info) {
        if (id === void 0) { id = Math.random()
            .toString(36)
            .substr(2, 9); }
        if (info === void 0) { info = {}; }
        this.channels = pusher_js_mock_instance_1.default.channels;
        this.channel = pusher_js_mock_instance_1.default.channel;
        this.id = id;
        this.info = info;
    }
    /**
     * Mock subscribing to a channel.
     * @param {String} name - name of the channel.
     * @returns {PusherChannelMock} PusherChannelMock object that represents channel
     */
    PusherMock.prototype.subscribe = function (name) {
        return pusher_js_mock_instance_1.default.channel(name, this);
    };
    /**
     * Unsubscribe from a mocked channel.
     * @param {String} name - name of the channel.
     */
    PusherMock.prototype.unsubscribe = function (name) {
        if (name in pusher_js_mock_instance_1.default.channels) {
            pusher_js_mock_instance_1.default.channels[name].callbacks = {};
            delete pusher_js_mock_instance_1.default.channels[name];
        }
    };
    return PusherMock;
}());
exports.default = PusherMock;
