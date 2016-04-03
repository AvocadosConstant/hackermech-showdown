'use strict';
var itemList = require('./itemList.js');
var debug = require('debug')('mech-fight-server:Player.js');

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
    if(item.inUse || item.limb !== this.limbType) {
      console.log("In use: " + item.inUse);
      console.log("Limb type: " + item.limb + " / " + this.limbType);
      return false;
    }
    else {
      this.item = item;
      item.inUse = true;
    }
    return true;
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
      'leftArm': 0,
      'rightArm': 0,
      'chest': 0,
      'leftLeg': 0,
      'rightLeg': 0
    };
  }

  resetTurnDamage() {
    this.power += 5;
    this.turnDamage.leftArm = 0;
    this.turnDamage.rightArm = 0;
    this.turnDamage.chest = 0;
    this.turnDamage.leftLeg = 0;
    this.turnDamage.rightLeg = 0;
  }

  isAlive() {
    return this.torso.health > 0;
  }

  equip(item, bodyPart) {
    var items = itemList();
    for (var i = 0; i < items.length; i++) {
      debug('Trying ' + items[i].itemId);
      if (items[i].itemId === item) {
        return this[bodyPart].equip(items[i]);
      }
    }
    debug('Item part not found');
    //if (this.equipped >= this.equipMax) {
      //equipSuccess = false;
    //}
    //else {
      //equipSuccess = bodyPart.equip(item);
    //}
    //return equipSuccess;
    return false;
  }
  attack(weapon,target){
    this.onAttack = true;
    var damage = {
      'leftArm': 0,
      'rightArm': 0,
      'chest': 0,
      'leftLeg': 0,
      'rightLeg': 0
    };
    if(this.rightArm.item && weapon===this.rightArm.item.itemId){
      if(this.power>this.rightArm.item.cost){
        this.power-=this.rightArm.item.cost;
        if(target!==null){
          damage = this.rightArm.item.action(target);
        }
        else{
          damage = this.rightArm.item.action();
        }
      }
    }
    else if(this.leftArm.item && weapon===this.leftArm.item.itemId){
      if(this.power>this.leftArm.item.cost){
        this.power-=this.leftArm.item.cost;
        if(target!==null){
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
