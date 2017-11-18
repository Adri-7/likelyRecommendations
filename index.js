const Recommender = require('likely');
const fs = require('fs');

fs.readFile('datasets/u1.base', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  //Matrix init
  let inputMatrix = Array();

  for(let i = 0; i <= 943; i++){
    inputMatrix.push(new Array());

    for(let j = 0; j <= 1682; j++){
      inputMatrix[i].push(0);
    }
  }

  //Read profiles data
  let lines = data.split('\n');

  for(let line of lines){
    if(line){
      let [u, i, r, t] = line.split('\t');

      inputMatrix[parseInt(u)][parseInt(i)] = parseInt(r);
    }
  }

  //Run matrix computations
  let start = Date.now();

  var model = Recommender.buildModel(inputMatrix);

  let duration = Date.now() - start;

  //Get recommendations for user 0 ? (never been tested with int index)
  var recommendations = model.recommendations(0);

  //console.log(recommendations);
});
