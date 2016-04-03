var BodyPart = require('BodyPart.js');
var defaults = require('defaults.js');

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

module.exports = Player;
