const Recommender = require('likely');
const similarity = require( 'compute-cosine-similarity' );
const fs = require('fs');

// '+1' because ids begin with 1
const USERS_COUNT = 943+1;
const ITEMS_COUNT = 1682+1;
const DATASETS_NAMES = ['u1', 'u2', 'u3', 'u4', 'u5']; //Choose you dataset here

for(name of DATASETS_NAMES){
  processDataset(name);
}

// -----------------------------------------------------------------------------
//                             Helper functions
// -----------------------------------------------------------------------------

//Run evaluation for dataset 'name'
function processDataset(name){
  let BASE_FILE = `datasets/${name}.base`;
  let TEST_FILE = `datasets/${name}.test`;
  let RESULT_FILE = `logs/${name}.result`;

  return new Promise((resolve, reject) => {
    fs.readFile(BASE_FILE, 'utf8', function (err,baseData) {
      if (err) {
        reject(err);
      }

      console.log(`Parsing ${name} base file...`);
      let inputMatrix = parseDatasetLines(USERS_COUNT, ITEMS_COUNT, 0, baseData);

      //Run matrix computations
      console.log(`Running ${name} computations...`);
      let start = Date.now();
      let model = Recommender.buildModel(inputMatrix);
      let duration = Date.now() - start;

      console.log(`Model built in ${duration}ms`);

      //formatting results of the model recommendations in one big matrix
      let bigDataMachineDeepLearningMatrixOfDoom = initMatrix(USERS_COUNT, ITEMS_COUNT, 0);
      for (let user = 1; user < USERS_COUNT; user++){

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
      fs.readFile(TEST_FILE, 'utf8', (err, testData) => {
        if (err) {
          reject(err);
        }

        //Make sur that we won't append in a non empty file
        if(fs.existsSync(RESULT_FILE)){
          fs.unlink(RESULT_FILE, (err) => {
            if(err) reject(err);
          });
        }

        //recommendations matrix parsing
        let perfectRecomMatrix = parseDatasetLines(USERS_COUNT, ITEMS_COUNT, 0, testData);
        let cosineSimilarities = new Array(USERS_COUNT);

        for (let user = 1; user < USERS_COUNT; user++){
          //Cosine similarity between recommendations and real ratings
          cosineSimilarities[user] = similarity( bigDataMachineDeepLearningMatrixOfDoom[user], perfectRecomMatrix[user] );

          //We then write it to a file
          let line = cosineSimilarities[user] + '\n';

          fs.appendFile(RESULT_FILE, line, (err) => {
            if (err) reject(err);
          });
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

        resolve();
      });
    });
  });
}

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
