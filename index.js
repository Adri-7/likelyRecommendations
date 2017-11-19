const Recommender = require('likely');
const similarity = require( 'compute-cosine-similarity' );
const fs = require('fs');

/*
// '+1' because ids begin with 1
const usersCount = 1682+1;
const itemsCount = 943+1;
*/

const usersCount = 5+1;
const itemsCount = 14+1;
const datasetName = "tiny";

fs.readFile(`datasets/${datasetName}.base`, 'utf8', function (err,baseData) {
  if (err) {
    return console.log(err);
  }

  let inputMatrix = parseDatasetLines(usersCount, itemsCount, 0, baseData);

  //Run matrix computations
  let start = Date.now();
  var model = Recommender.buildModel(inputMatrix);
  let duration = Date.now() - start;

  console.log(`Model built in ${duration}ms`);

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

  //recommendations evaluation
  fs.readFile(`datasets/${datasetName}.test`, 'utf8', (err, testData) => {
    if (err) {
      return console.log(err);
    }

    //recommendations matrix parsing
    let perfectRecomMatrix = parseDatasetLines(usersCount, itemsCount, 0, testData);

    let cosineSimilarities = new Array(usersCount);
    for (let user = 1; user < usersCount; user++){
      cosineSimilarities[user] = similarity( bigDataMachineDeepLearningMatrixOfDoom[user], perfectRecomMatrix[user] )
    }

    /*
    console.log("perfects recommendations matrix");
    console.log(perfectRecomMatrix);
    console.log("\r\n recommendation");
    console.log(bigDataMachineDeepLearningMatrixOfDoom);
    console.log("\r\n cosine similarities (1 is the best, 0 is the worst");
    console.log("1st item is empty, because user 0 doesn't exist, it's a shift if the ids");
    console.log(cosineSimilarities);
    */
  });
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
function parseDatasetLines(rows, cols, value, data){
  let returnMatrix = initMatrix(rows, cols, value);
  let lines = data.split('\n');

  for(let line of lines){
    //we don't want to handle empty lines
    if(line){
      let [u, i, r, t] = line.split('\t');

      returnMatrix[parseInt(u)][parseInt(i)] = parseInt(r);
    }
  }

  return returnMatrix;
}
