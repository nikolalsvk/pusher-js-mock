"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var members_1 = require("./members");
var pusher_channel_mock_1 = require("./pusher-channel-mock");
/** Basic augmentation of the PusherChannel class. */
var PusherPresenceChannelMock = /** @class */ (function (_super) {
    __extends(PusherPresenceChannelMock, _super);
    /**
     * Initialise members object when created.
     * `pusher-js` provides all the functionality we need.
     */
    function PusherPresenceChannelMock(name) {
        if (name === void 0) { name = 'presence-channel'; }
        var _this = _super.call(this, name) || this;
        _this.members = new members_1.default();
        return _this;
    }
    return PusherPresenceChannelMock;
}(pusher_channel_mock_1.default));
exports.default = PusherPresenceChannelMock;
