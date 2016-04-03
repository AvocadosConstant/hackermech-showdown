var part = require('Item.js');

function scattergun(){
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
    if(Math.round(Math.random())) hit["Left-arm"] += 5;
    if(Math.round(Math.random())) hit["Right-arm"] += 5;
    if(Math.round(Math.random())) hit["Chest"] += 5;
    if(Math.round(Math.random())) hit["Left-leg"] += 5;
    if(Math.round(Math.random())) hit["Right-leg"] += 5;
  }
  return hit;
}


function itemList(){
  var listItems = [];
  listItems.push(new part("Scattergun",30,1,"arm",);
}
