"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Class representing a fake Pusher channel. */
var PusherChannelMock = /** @class */ (function () {
    /** Initialize PusherChannelMock with callbacks object. */
    function PusherChannelMock(name) {
        if (name === void 0) { name = 'public-channel'; }
        this.subscribed = true;
        this.name = name;
        this.callbacks = {};
    }
    /**
     * Bind callback to an event name.
     * @param {String} name - name of the event.
     * @param {Function} callback - callback to be called on event.
     */
    PusherChannelMock.prototype.bind = function (name, callback) {
        this.callbacks[name] = this.callbacks[name] || [];
        this.callbacks[name].push(callback);
    };
    /**
     * Unbind callback from an event name.
     * @param {String} name - name of the event.
     * @param {Function} callback - callback to be called on event.
     */
    PusherChannelMock.prototype.unbind = function (name, callback) {
        this.callbacks[name] = (this.callbacks[name] || []).filter(function (cb) { return cb !== callback; });
    };
    /**
     * Emit event with data.
     * @param {String} name - name of the event.
     * @param {*} data - data you want to pass in to callback function that gets called.
     */
    PusherChannelMock.prototype.emit = function (name, data) {
        var callbacks = this.callbacks[name];
        if (callbacks) {
            callbacks.forEach(function (cb) { return cb(data); });
        }
    };
    return PusherChannelMock;
}());
exports.default = PusherChannelMock;
