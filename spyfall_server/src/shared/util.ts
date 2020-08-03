const { NAMES } = require('../constants');

function generateId(n){
  let chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let newId = "";
  for(let i = 0; i < n; i++){
    newId += chars[getRandom(0,chars.length)];
  }
  return newId;
}
function getRandom(min,max){
  return Math.floor(Math.random() * max) + min;
}
function getName(){
  return NAMES[getRandom(0,NAMES.length)];
}

module.exports = {
  generateId,
  getRandom,
  getName
};
