var item = require('./Item.js');

var scattergun = function(){
  var bullets = 0;
  for(var i=0;i<10;i++){
    if(Math.random()>.1){
      bullets++;
    }
  }
  var hit = {"Left-arm": 0,
  "Right-arm": 0,
  "Chest": 0,
  "Left-leg": 0,
  "Right-leg": 0
  };
  for(var i=0; i<bullets;i++){
    if(Math.round(Math.random())==1) hit["Left-arm"] += 5;
    if(Math.round(Math.random())==1) hit["Right-arm"] += 5;
    if(Math.round(Math.random())==1) hit["Chest"] += 5;
    if(Math.round(Math.random())==1) hit["Left-leg"] += 5;
    if(Math.round(Math.random())==1) hit["Right-leg"] += 5;
  }
  return hit;
}

function rocketfist(part){
  var damage = Math.floor(Math.random() * (80 - 40)) + 40;

  return {
    part: damage;
  }
}

var sword = function(){
  var hit = {"Left-arm": 0,
  "Right-arm": 0,
  "Left-leg": 0,
  "Right-leg": 0
  };
  if(Math.round(Math.random())==1) hit["Left-arm"] += 10;
  else hit["Left-arm"]+=5;
  if(Math.round(Math.random())==1) hit["Right-arm"] += 10;
  else hit["Right-arm"]+=5;
  if(Math.round(Math.random())==1) hit["Left-leg"] += 10;
  else hit["Left-leg"]+=5;
  if(Math.round(Math.random())==1) hit["Right-leg"] += 10;
  else hit["Right-leg"]+=5;
  return hit;
}

var flamethrower = function(){
  var hit = {"Left-arm": 10,
  "Right-arm": 10,
  "Chest": 20,
  "Left-leg": 10,
  "Right-leg": 10
  };
  for(var i =0;i<5;i++){
    hit[i] += 3 * Math.trunc((Math.floor(Math.random() * (100 - 60)) + 60)/20);
  }
  return hit;

}

var railgun = function(part){
  if(Math.random()>.1){
    var damage = 50;
  }
  else{
    var damage = 500;
  }
  if(part=="chest"){
    damage = 100;
  }
  return {
    part: damage
  };
}



function itemList(){
  var listItems = [];
  listItems.push(new item("Scattergun",30,1,"arm",scattergun));
  listItems.push(new item("Rocket Fist",50,2,"arm",rocketfist));
  listItems.push(new item("Sword",20,1,"arm",sword));
  listItems.push(new item("Flamethrower",45,1,"arm",flamethrower));
  listItems.push(new item("Railgun",80,2,"arm",railgun));
}

module.exports = itemList;
