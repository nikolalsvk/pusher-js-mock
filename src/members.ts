/* tslint:disable */
/* istanbul ignore file */
/** COPIED DIRECTLY FROM pusher-js PACKAGE */
export function objectApply(object: any, f: Function) {
  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      f(object[key], key, object);
    }
  }
}

/** COPIED DIRECTLY FROM pusher-js PACKAGE */
/** Represents a collection of members of a presence channel. */
export default class Members {
  members: any;
  // @ts-ignore - set in this.reset()
  count: number;
  myID: any;
  me: any;

  constructor(members?: any) {
    this.reset(members);
  }

  /** Returns member's info for given id.
   *
   * Resulting object containts two fields - id and info.
   *
   * @param {Number} id
   * @return {Object} member's info or null
   */
  get(id: string): any {
    if (Object.prototype.hasOwnProperty.call(this.members, id)) {
      return {
        id: id,
        info: this.members[id],
      };
    } else {
      return null;
    }
  }

  /** Calls back for each member in unspecified order.
   *
   * @param  {Function} callback
   */
  each(callback: Function) {
    objectApply(this.members, (member: any, id: string) => {
      callback(this.get(id));
    });
  }

  /** Adds a new member to the collection. For internal use only. */
  addMember(memberData: any) {
    if (this.get(memberData.user_id) === null) {
      this.count++;
    }
    this.members[memberData.user_id] = memberData.user_info;
    return this.get(memberData.user_id);
  }

  /** Adds a member from the collection. For internal use only. */
  removeMember(memberData: any) {
    var member = this.get(memberData.user_id);
    if (member) {
      delete this.members[memberData.user_id];
      this.count--;
    }
    return member;
  }

  /** Resets the collection to the initial state. For internal use only. */
  reset(members?: any) {
    this.members = members || {};
    this.count = 0;
    this.myID = null;
    this.me = null;
  }
}
