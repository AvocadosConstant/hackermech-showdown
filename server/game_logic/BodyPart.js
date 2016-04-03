var defaults = require('defaults.js');

/** A body part on the mech. */
class  BodyPart {
  /**
   * Creates body part of a given type on the mech.
   * @param {string} type - The type of body part.
   */
  constructor(type) {
    this.type = type;
    this.health = defaults[type];
  }
}

module.exports = BodyPart;
