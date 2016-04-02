
/**
* Makes and returns a mech part.
* @param {string} pName - name of the part
* @param {number} pDamage - how much damage the part does
* @param {number} pCost - how much power the part costs to activate
* @param {boolean} pChest - if the tool can be equipped on the chest
* @param {boolean} pArm - if the tool can be equipped on the arm
* @param {boolean} pLeg - if the tool can be equipped on the leg
*/
function newPart(pName,pDamage,pCost,pChest,pArm,pLeg) {
  return {
    this.partID = pName;
    this.damage = pDamage;
    this.cost = pCost;
    this.chest = pChest;
    this.arm = pArm;
    this.leg = pLeg;
  };
}

/**
* Returns our set of possible parts.
*/
function makeParts(){
  var parts = [];
  parts.push(newPart("flamethrower",15,20,true,false,false));
  return parts;
}
