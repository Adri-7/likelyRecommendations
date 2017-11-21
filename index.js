// -----------------------------------------------------------------------------
//                                   Imports
// -----------------------------------------------------------------------------
const Recommender = require('likely');
const fs = require('fs');


// -----------------------------------------------------------------------------
//                                   Const
// -----------------------------------------------------------------------------
const USERS_COUNT = 943;
const ITEMS_COUNT = 1682;
//Choose your datasets here (don't forget to update dimensions if needed)
const DATASETS_NAMES = ['u1', 'u2', 'u3', 'u4', 'u5'];


// -----------------------------------------------------------------------------
//                                   main
// -----------------------------------------------------------------------------
launch(0);


// -----------------------------------------------------------------------------
//                             Helper functions
// -----------------------------------------------------------------------------
/**
 * launch - launch evaluations
 */
function launch(index){
  if(index >= DATASETS_NAMES.length){
    return;
  }

  processDataset(DATASETS_NAMES[index])
    .then(launch(index+1))
    .catch((err) => {
      console.error(err);
    });
}

/**
 * processDataset - run computations on datasets/'name'.base and compare with
 *  datasets/'name'.test to evaluate
 */
function processDataset(name){
  let baseFile = `datasets/${name}.base`;
  let testFile = `datasets/${name}.test`;
  let resultFile = `logs/${name}.result`;

  return new Promise((resolve, reject) => {
    //Opens base data file
    fs.readFile(baseFile, 'utf8', function (err,baseData) {
      if (err) {
        reject(err);
        return;
      }

      //Base file parsing
      console.log(`Parsing ${name}.base file...`);
      let inputMatrix = parseBaseDataset(USERS_COUNT, ITEMS_COUNT, baseData);
      console.log("  -> done\n");

      //Model building
      console.log(`Building model...`);
      let start = Date.now();
      let model = Recommender.buildModel(inputMatrix);
      let duration = Date.now() - start;
      console.log(`done in ${duration}ms\n`);

      //Formatting recommendations in a matrix
      console.log("Generating recommendations matrix from model...");
      let recommendationsMatrix = generateUsersRecommendationsMatrix(model);
      console.log("  -> done\n");

      //Opens test data file
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

        //test file parsing
        console.log(`Parsing ${name}.test file...`);
        let realRatings = parseTestDataset(testData);
        console.log("  -> done\n");

        //MSE computing (from a matrix of recommendations and an array of <itemId, rating> pairs for each user)
        console.log("Compute mean squared error between recommendations and real ratings...");
        for(let user = 0; user < USERS_COUNT; user++){
          let mse = 0;

          //Sum of squared errors
          for(let rating of realRatings[user]){
            let prediction = recommendationsMatrix[user][rating[0]];

            mse += Math.pow(prediction - rating[1], 2);
          }

          mse = mse / realRatings[user].length;

          //Append mean squared error for each user in the file
          fs.appendFile(resultFile, `${mse}\n`, (err) => {
            if (err){
              reject(err);
              return;
            }
          });
        }
        console.log("  -> done\n");
        console.log("Results can be found in log folder");

        //If we got here, then nothing wrong happened, we can resolve
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
 * parseBaseDataset - parses the dataset, and returns a rows*cols matrix
 */
function parseBaseDataset(rows, cols, data){
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

/**
 * parseTestDataset - parses the dataset, and returns a matrix composed of arrays
 * populated with <itemId, rating> pairs for each user
 */
function parseTestDataset(data){
  let resultMatrix = initMatrix(USERS_COUNT, 0, 0);
  let lines = data.split('\n');

  for(let line of lines){
    //we don't want to handle empty lines
    if(line){
      let [user, item, rating, timestamp] = line.split('\t');

      //-1 to correct ids
      resultMatrix[parseInt(user)-1].push([parseInt(item)-1, parseInt(rating)]);
    }
  }

  return resultMatrix;
}

/**
 * generateUsersRecommendationsMatrix - Generate a matrix with recommendations
 */
function generateUsersRecommendationsMatrix(model){
  //TODO check if we can test different parameters
  let recommendations = initMatrix(USERS_COUNT, ITEMS_COUNT, 0);

  for (let user = 0; user < USERS_COUNT; user++){
    var userRecommendations = model.recommendations(user);

    for (let recommendation of userRecommendations){
      let rating =recommendation[1];

      // let's say that 2 decimals are enough
      recommendations[user][recommendation[0]] = (Math.round(100 * rating) / 100);
    }
  }

  return recommendations;
}
