"use strict";

/** Default values. */
var defaults = {
  'torso': 250,
  'arm': 100,
  'leg': 100,
  'power': 100
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
  
  /** 
   * Equips item to body part.
   * Returns true if item gets equipped.
   *
   * @param {Item} item - The item to commit.
   * @return {boolean} - Success of equipping item.
   */
  equip(item) {
    var equipSuccess = true;
    if(item.inUse || item.limb != this.limbType) {
      equipSuccess = false;
    }
    else {
      this.item = item;
      item.inUse = true;
    }
    return equipSuccess;
  }

  use(target) {
  }
}

/** A user. */
class Player {
  /**
   * Creates a new mech.
   */
  constructor () {
    this.torso = new BodyPart('torso');
    this.leftArm = new BodyPart('arm');
    this.rightArm = new BodyPart('arm');
    this.leftLeg = new BodyPart('leg');
    this.rightLeg = new BodyPart('leg');
    this.power = defaults.power;
    this.equipped = 0;
    this.equipMax = 3;
  }

  equip(item, bodyPart) {
    var equipSuccess = true;
    if (this.equipped >= equipMax) {
      equipSuccess = false;
    }
    else {
      equipSuccess = bodyPart.equip(item);
    }
    return equipSuccess;
  }
}

module.exports = Player;
