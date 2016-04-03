/** Default values. */
var defaults = {
  'torso': 250,
  'arm': 100,
  'leg': 100
};

/** A part of the mech. */
class BodyPart {
  /**
   * Creates body part of a given type.
   * @param {string} limbType - The type of body part.
   */
  constructor(limbType) {
    this.limbType = limbType;
    this.health = defaults[limbType];
    this.item = null;
  }

  equip(item) {
    this.item = item;
  }
}

/** A user. */
class Player {
  /**
   * Creates a new player.
   * @param {string} playerId - A unique identifier.
   */
  constructor (playerId) {
    this.playerId = playerId;
    this.torso = new BodyPart('torso');
    this.leftArm = new BodyPart('arm');
    this.rightArm = new BodyPart('arm');
    this.leftLeg = new BodyPart('leg');
    this.rightLeg = new BodyPart('leg');
  }
}

module.exports = Player;
