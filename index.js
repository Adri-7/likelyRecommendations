// -----------------------------------------------------------------------------
//                                   Imports
// -----------------------------------------------------------------------------
const Recommender = require('likely');
const similarity = require( 'compute-cosine-similarity' );
const fs = require('fs');


// -----------------------------------------------------------------------------
//                                   Const
// -----------------------------------------------------------------------------
const USERS_COUNT = 5//943;
const ITEMS_COUNT = 14//1682;
//Choose your datasets here (don't forget to update dimensions if needed)
const DATASETS_NAMES = ["tiny"]//['u1', 'u2', 'u3', 'u4', 'u5'];


// -----------------------------------------------------------------------------
//                                   main
// -----------------------------------------------------------------------------
for(name of DATASETS_NAMES){
  //TODO maybe we could handle promises
  processDataset(name)
    .catch((err) => {
      console.error(err);
    });
}


// -----------------------------------------------------------------------------
//                             Helper functions
// -----------------------------------------------------------------------------

/**
 * processDataset - run computations on datasets/'name'.base and compare with
 *  datasets/'name'.test to evaluate
 */
function processDataset(name){
  let baseFile = `datasets/${name}.base`;
  let testFile = `datasets/${name}.test`;
  let resultFile = `logs/${name}.result`;

  return new Promise((resolve, reject) => {
    fs.readFile(baseFile, 'utf8', function (err,baseData) {
      if (err) {
        reject(err);
        return;
      }

      console.log(`Parsing ${name}.base file...`);
      let inputMatrix = parseDatasetLines(USERS_COUNT, ITEMS_COUNT, baseData);
      console.log("done");

      console.log(`Running ${name} model computations...`);
      let start = Date.now();
      let model = Recommender.buildModel(inputMatrix);
      let duration = Date.now() - start;
      console.log(`done in ${duration}ms`);

      //TODO rewrite this part to keep only pertinent data
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
      fs.readFile(testFile, 'utf8', (err, testData) => {
        if (err) {
          reject(err);
          return;
        }

        //Make sur that we won't append in a non empty file
        if(fs.existsSync(resultFile)){
          fs.unlink(resultFile, (err) => {
            if(err){
              reject(err);
            }
          });
        }

        //recommendations matrix parsing
        let perfectRecomMatrix = parseDatasetLines(USERS_COUNT, ITEMS_COUNT, testData);
        let cosineSimilarities = new Array(USERS_COUNT);

        for (let user = 1; user < USERS_COUNT; user++){
          //Cosine similarity between recommendations and real ratings
          cosineSimilarities[user] = similarity( bigDataMachineDeepLearningMatrixOfDoom[user], perfectRecomMatrix[user] );

          //We then write it to the file
          let line = cosineSimilarities[user] + '\n';

          fs.appendFile(resultFile, line, (err) => {
            if (err) reject(err);
          });
        }

        //If we got here, then nothing wrong happened
        resolve();
      });
    });
  });
}


/**
 * initMatrix - init a matrix rows*cols with value
 */
function initMatrix(rows, cols, value){
  let matrix = [];

  for(let i = 0; i < rows; i++){
    matrix.push([]);

    for(let j = 0; j < cols; j++){
      matrix[i].push(0);
    }
  }

  return matrix;
}


/**
 * parseDatasetLines - parses the dataset, and return a rows*cols matrix
 */
function parseDatasetLines(rows, cols, data){
  let resultMatrix = initMatrix(rows, cols, 0);
  let lines = data.split('\n');

  for(let line of lines){
    //we don't want to handle empty lines
    if(line){
      let [user, item, rating, timestamp] = line.split('\t');
      let i = parseInt(user)-1;
      let j = parseInt(item)-1;

      resultMatrix[i][j] = parseInt(rating);
    }
  }

  return resultMatrix;
}
