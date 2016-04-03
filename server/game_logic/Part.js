/**
 * Creates a part.
 * @constructor
 * @param {string} partId - Unique name of the part.
 * @param {number} cost - Power needed to use part.
 * @param {number} cooldown - How many turns before it can be used again.
 * @param {string} limb - Where the part can be equipped.
 * @param {function} action - What the part does.
 */
exports.Part = function(partId, cost, cooldown, limb, action) {
  this.partId = partId;
  this.cost = cost;
  this.cooldown = cooldown;
  this.limb = limb;
  this.cooling = 0;
  this.action = action;
};
