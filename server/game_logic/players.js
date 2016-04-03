var defaults = {
  'torso': 250,
  'arm': 100,
  'leg': 100,
  'power': 100
};

/** A body part on the mech. */
class  BodyPart {
  /**
   * Creates body part of a given type on the mech.
   * @constructor
   * @param {string} type - The type of body part.
   */
  constructor(type) {
    this.type = type;
    this.health = defaults[type];
  }
}

/** A player. */
class Player {
  /**
   * Creates a new player.
   * @param {string} playerId - A unique identifier.
   */
  constructor(playerId) {
    this.playerId = playerId;
    this.power = defaults.power;
    this.torso = new BodyPart('torso');
    this.leftArm = new BodyPart('arm');
    this.rightArm = new BodyPart('arm');
    this.leftLeg = new BodyPart('leg');
    this.rightLeg = new BodyPart('leg');
  }
}
