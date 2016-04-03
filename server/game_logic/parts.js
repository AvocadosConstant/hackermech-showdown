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
function Part(pName,pDamage,pCost,pChest,pArm,pLeg,cooldown) {
  return {
    this.partID = pName;
    this.damage = pDamage;
    this.cost = pCost;
    this.chest = pChest;
    this.arm = pArm;
    this.leg = pLeg;
    this.cooldown = cooldown;
    this.cooling = 0;
  };
}

/**
* Returns our set of possible parts.
*/
function makeParts(){
  var parts = [];
  parts.push(new Part("rockets",20,15,true,true,true,8));
  parts.push(new Part("flamethrower",15,12,false,true,false,4));
  parts.push(new Part("machine gun",3,3,false,true,false,2));
  parts.push(new Part("sword",5,3,false,true,false,0));
  return parts;
}
