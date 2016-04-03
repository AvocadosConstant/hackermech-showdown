/**
* Makes and returns a mech part.
* @param {string} pName - name of the part
* @param {number} pDamage - how much damage the part does
* @param {number} pCost - how much power the part costs to activate
* @param {boolean} pChest - if the tool can be equipped on the chest
* @param {boolean} pArm - if the tool can be equipped on the arm
* @param {boolean} pLeg - if the tool can be equipped on the leg
* @param {number} cooldown - Turns that must be waited before reuse
*/
class Part {
  constructor(partID,cost,chest,arm,leg,cooldown){
    this.partID = name;
    this.cost = cost;
    this.chest = chest;
    this.arm = arm;
    this.leg = leg;
    this.cooldown = cooldown;
    this.cooling = 0;
  }
}

class OffensivePart extends Part {
  constructor(partID,damage,cost,chest,arm,leg,cooldown,type){
    super(partID,cost,chest,arm,leg,cooldown);
    this.damage = damage;
  }
}

class DefensivePart extends Part {
  constructor(partID,cost,chest,arm,leg,cooldown,utility){
    super(partID,cost,chest,arm,leg,cooldown);
    this.utility = utility;
  }

}

/**
* Returns our set of possible parts.
*/
function makeParts(){
  var parts = [];
  parts.push(new OffensivePart("rockets",20,15,true,true,true,8,"kinetic"));
  parts.push(new OffensivePart("flamethrower",15,12,false,true,false,3,"thermal"));
  parts.push(new OffensivePart("machine gun",3,3,false,true,false,1,"kinetic"));
  parts.push(new OffensivePart("sword",5,3,false,true,false,0,"kinetic"));
  parts.push(new OffensivePart("laser",15,17,false,true,false,4,"em"));
  parts.push(new DefensivePart("shield",40,true,false,false,5,"block"));
  //what if we make repair always available and have a module that enhances its efficiency
  parts.push(new DefensivePart("repair",20,true,false,false,2,"heal 10 hp"));
  return parts;
}
