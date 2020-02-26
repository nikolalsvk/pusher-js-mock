"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
/* istanbul ignore file */
/** COPIED DIRECTLY FROM pusher-js PACKAGE */
function objectApply(object, f) {
    for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            f(object[key], key, object);
        }
    }
}
exports.objectApply = objectApply;
/** COPIED DIRECTLY FROM pusher-js PACKAGE */
/** Represents a collection of members of a presence channel. */
var Members = /** @class */ (function () {
    function Members() {
        this.reset();
    }
    /** Returns member's info for given id.
     *
     * Resulting object containts two fields - id and info.
     *
     * @param {Number} id
     * @return {Object} member's info or null
     */
    Members.prototype.get = function (id) {
        if (Object.prototype.hasOwnProperty.call(this.members, id)) {
            return {
                id: id,
                info: this.members[id],
            };
        }
        else {
            return null;
        }
    };
    /** Calls back for each member in unspecified order.
     *
     * @param  {Function} callback
     */
    Members.prototype.each = function (callback) {
        var _this = this;
        objectApply(this.members, function (member, id) {
            callback(_this.get(id));
        });
    };
    /** Adds a new member to the collection. For internal use only. */
    Members.prototype.addMember = function (memberData) {
        if (this.get(memberData.user_id) === null) {
            this.count++;
        }
        this.members[memberData.user_id] = memberData.user_info;
        return this.get(memberData.user_id);
    };
    /** Adds a member from the collection. For internal use only. */
    Members.prototype.removeMember = function (memberData) {
        var member = this.get(memberData.user_id);
        if (member) {
            delete this.members[memberData.user_id];
            this.count--;
        }
        return member;
    };
    /** Resets the collection to the initial state. For internal use only. */
    Members.prototype.reset = function () {
        this.members = {};
        this.count = 0;
        this.myID = null;
        this.me = null;
    };
    return Members;
}());
exports.default = Members;
