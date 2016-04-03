/** Default values. */
var defaults = {
  'torso': 250,
  'arm': 100,
  'leg': 100,
  'power': 100
};

/**
 * Creates body part of a given type.
 * @param {string} limbType - The type of body part.
 */
function BodyPart(limbType) {
  this.limbType = limbType;
  this.health = defaults[limbType];
}

/**
 * Creates a new player.
 * @param {string} playerId - A unique identifier.
 */
module.exports = function (playerId) {
  this.playerId = playerId;
  this.power = defaults.power;
  this.torso = new BodyPart('torso');
  this.leftArm = new BodyPart('arm');
  this.rightArm = new BodyPart('arm');
  this.leftLeg = new BodyPart('leg');
  this.rightLeg = new BodyPart('leg');
};
