const Recommender = require('likely');
const similarity = require( 'compute-cosine-similarity' );
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

  let inputMatrix = parseDatasetLines(usersCount, itemsCount, 0, baseData.split('\n'));

  //Run matrix computations
  let start = Date.now();
  var model = Recommender.buildModel(inputMatrix);
  let duration = Date.now() - start;

  console.log("Model built in " + duration + "ms");

  //formatting results of the model recommendations in one big matrix
  let bigDataMachineDeepLearningMatrixOfDoom = initMatrix(usersCount, itemsCount, 0);
  for (let user = 1; user < usersCount; user++){

    var recommendationOfDoom = model.recommendations(user);
    //console.log(recommendationOfDoom);

    for (let recommendation in recommendationOfDoom){

      let objectId = recommendationOfDoom[recommendation][0];

      // because of index shift
      if (objectId != 0){
        let rate = recommendationOfDoom[recommendation][1];
        // let's say that 2 decimals are enough
        bigDataMachineDeepLearningMatrixOfDoom[user][objectId] = Math.round(100 * rate) / 100;
      }

    }
  }

  // WARNING, assuming that tiny.test contains the "results", ie the best recommendations we can predict, may be wrong
  //recommendations evaluation
  fs.readFile('datasets/tiny.test', 'utf8', (err, testData) => {
    if (err) {
      return console.log(err);
    }

    //recommendations matrix parsing
    let perfectRecomMatrix = parseDatasetLines(usersCount, itemsCount, 0, testData.split('\n'));

    let cosineSimilarities = new Array(usersCount);
    for (let user = 1; user < usersCount; user++){
      cosineSimilarities[user] = similarity( bigDataMachineDeepLearningMatrixOfDoom[user], perfectRecomMatrix[user] )
    }

    console.log("perfects recommendations matrix");
    console.log(perfectRecomMatrix);
    console.log("\r\n recommendation");
    console.log(bigDataMachineDeepLearningMatrixOfDoom);
    console.log("\r\n cosine similarities (1 is the best, 0 is the worst");
    console.log("1st item is empty, because user 0 doesn't exist, it's a shift if the ids");
    console.log(cosineSimilarities);

    //TODO read users test data DONE

    //TODO generate users vectors recommendations
    // should we make that, or is this matrix full of "real opinions" ? (ie the most accurate recommendation)
    for (let user = 1; user < usersCount; user++ ){
      // TODO
    }

    //TODO use cosine similarity to compare test data and recommendations
  });

  /*
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

  //console.log(recommendations);
  //console.log(userVector);
  */

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

// parse the lines of the dataset, and return a rows*cols matrix
function parseDatasetLines(rows, cols, value, lines){
  let returnMatrix = initMatrix(rows, cols, value);

  for(let line of lines){
    //we don't want to handle empty lines
    if(line){
      let [u, i, r, t] = line.split('\t');

      returnMatrix[parseInt(u)][parseInt(i)] = parseInt(r);
    }
  }

  return returnMatrix;
}