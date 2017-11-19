# likelyRecommendations
A simple project to evaluate likely.js with data from Movielens datasets.

You can find likely.js [here](https://github.com/sbyrnes/likely.js) and the datasets used can be found [here](https://grouplens.org/datasets/movielens/100k/).

## Usage

You can run this project directly using node or use the docker image furnished.

### With Node

You can find node [here](https://nodejs.org/en/).
Type `npm i` to get dependencies. You then you just need to type `npm start` to run the project.

### With Docker

You can deploy it with, or without github.

#### 1.1 Using github

In this case, uncomment the lines from 22 to 28 in the Dockerfile, and comment the lines from 8 to 15.
Docker will clone the github repository, build the dependencies, and make a ```npm start```.

#### 1.2 Without github

Comment the lines from 22 to 28, and uncomment the lines from 8 to 15.
Docker will copy the files from the project directory in the container.

#### 2. Build it ;)

Now just type ```make build```

#### 3. Start it

You only have to make ```make run```, and you will see the output in the stdout.

#### 4. Clean it

You can use ```make clean``` to destroy the docker container, and ```make cleanImage``` to delete the docker image.
