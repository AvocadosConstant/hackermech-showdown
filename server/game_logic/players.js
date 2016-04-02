var defaults = {
  'torso': 250,
  'arm': 100,
  'leg': 100,
  'power': 100
};

/**
 * Initializes body part of a given type on the mech.
 * @constructor
 * @param {string} type - The type of body part.
 */
function BodyPart(type) {
  this.type = type;
  this.health = defaults[type];
}

/**
 * Initializes a new player.
 * @constructor
 * @param {string} playerId - A unique identifier.
 */
function Player(playerId) {
  this.playerId = playerId;
  this.power = defaults.power;
  this.torso = new BodyPart('torso');
  this.leftArm = new BodyPart('arm');
  this.rightArm = new BodyPart('arm');
  this.leftLeg = new BodyPart('leg');
  this.rightLeg = new BodyPart('leg');
}
