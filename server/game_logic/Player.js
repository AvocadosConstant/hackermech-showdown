'use strict';

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
    this.actionTaken = false;
    this.defense = false;
    this.onAttack = false;
    this.turnDamage = {
      'Left-arm': 0,
      'Right-arm': 0,
      'Chest': 0,
      'Left-leg': 0,
      'Right-leg': 0
    };
  }

  equip(item, bodyPart) {
    var equipSuccess = true;
    if (this.equipped >= this.equipMax) {
      equipSuccess = false;
    }
    else {
      equipSuccess = bodyPart.equip(item);
    }
    return equipSuccess;
  }
  attack(weapon,target){
    this.onAttack = true;
    var damage = {
      'Left-arm': 0,
      'Right-arm': 0,
      'Chest': 0,
      'Left-leg': 0,
      'Right-leg': 0
    };
    if(weapon==this.rightArm.item.itemID){
      if(this.power>this.rightArm.item.cost){
        this.power-=this.rightArm.item.cost;
        if(target!=null){
          damage = this.rightArm.item.action(target);
        }
        else{
          damage = this.rightArm.item.action();
        }
      }
    }
    else if(weapon==this.leftArm.item.itemID){
      if(this.power>this.leftArm.item.cost){
        this.power-=this.leftArm.item.cost;
        if(target!=null){
          damage = this.leftArm.item.action(target);
        }
        else{
          damage = this.leftArm.item.action();
        }
      }
    }
    for(var i in damage){
      this.turnDamage[i]+=damage[i];
    }
  }
  defense(){
    if(!this.actionTaken&&!this.onAttack){
      this.actionTaken = true;
      this.defense = true;
    }
  }
  restore(mode){
    if(!this.actionTaken&&!this.onAttack){
      if(mode=='power'){
        this.power+=15;
      }
      else if(mode=='repair' && this.power>5){
        this.power-=5;
        this.torso.health+=10;
        this.leftArm.health+=10;
        this.rightArm.health+=10;
        this.leftLeg+=10;
        this.rightLeg+=10;
      }
    }
    this.actionTaken = true;
  }
}

module.exports = Player;
