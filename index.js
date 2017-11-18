const Recommender = require('likely');
const fs = require('fs');

/*
// '+1' because ids begin with 1
const usersCount = 1682+1:
const itemsCount = 943+1;
*/

const usersCount = 5+1;
const itemsCount = 14+1;

fs.readFile('datasets/tiny.base', 'utf8', function (err,baseData) {
  if (err) {
    return console.log(err);
  }

  //Matrix init
  let inputMatrix = initMatrix(usersCount, itemsCount, 0);

  //Read profiles data
  let lines = baseData.split('\n');

  for(let line of lines){
    //we don't want to handle empty lines
    if(line){
      let [u, i, r, t] = line.split('\t');

      inputMatrix[parseInt(u)][parseInt(i)] = parseInt(r);
    }
  }

  //Run matrix computations
  let start = Date.now();
  var model = Recommender.buildModel(inputMatrix);
  let duration = Date.now() - start;

  console.log("Model built in " + duration + "ms");

  //recommendations evaluation
  fs.readFile('datasets/tiny.test', 'utf8', (err, testData) => {
    //TODO read users test data

    //TODO generate users vectors recommendations

    //TODO use cosine similarity to compare test data and recommandations
  });

  //Generation of user 1 vector (in order to calculate cosine similiraty) --> to be used above in second todo
  var recommendations = model.recommendations(1);

  recommendations.sort((a,b) => {
    return a[0] - b[0];
  });

  let userVector = Array();
  for(let r of recommendations){
    //we dont keep this one because it's just noise
    if(r[0] !== 0){
      userVector.push(r[1]);
    }
  }

  console.log(recommendations);
  console.log(userVector);
});

// -----------------------------------------------------------------------------
//                             Helper functions
// -----------------------------------------------------------------------------

// init a matrix rows*cols with value
function initMatrix(rows, cols, value){
  let matrix = Array();

  for(let i = 0; i < rows; i++){
    matrix.push(new Array());

    for(let j = 0; j < cols; j++){
      matrix[i].push(0);
    }
  }

  return matrix;
}
