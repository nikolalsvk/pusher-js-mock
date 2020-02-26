"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pusher_js_mock_1 = require("./pusher-js-mock");
/**
 * Class represents fake PusherFactory.
 *
 * @example <caption>Example of mocking global Pusher instance</caption>
 *
 * import { PusherFactoryMock } from "pusher-js-mock";
 *
 * ...
 *
 * beforeEach(() => {
 *   const pusherFactoryMock = new PusherFactoryMock()
 *
 *   window.PusherFactory = pusherFactoryMock
 *
 *   pusher = pusherFactoryMock.pusherClient()
 * })
 */
var PusherFactoryMock = /** @class */ (function () {
    /**
     * Initialize PusherFactoryMock with pusherKey and sets a
     * pusherClientInstance
     * @param {String} pusherKey - Pusher app key
     */
    function PusherFactoryMock(pusherKey) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.pusherKey = pusherKey;
        this.pusherClientInstance = new (pusher_js_mock_1.default.bind.apply(pusher_js_mock_1.default, __spreadArrays([void 0], args)))();
    }
    /**
     * Getter for pusherClientInstance
     * @returns {PusherMock} PusherMock object that reprents pusherClient
     */
    PusherFactoryMock.prototype.pusherClient = function () {
        return this.pusherClientInstance;
    };
    return PusherFactoryMock;
}());
exports.default = PusherFactoryMock;
