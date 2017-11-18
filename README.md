# likelyRecommendations
A simple project to evaluate likely.js with data from Movielens datasets.

You can find likely.js [here](https://github.com/sbyrnes/likely.js) and the datasets used can be found [here](https://grouplens.org/datasets/movielens/100k/).

# Installation

You can installing with, or without github.

## 1.1 Using github

In this case, uncomment the lines from 22 to 28 in the Dockerfile, and comment the lines from 8 to 15.
Docker will clone the github repository, build the dependencies, and make a ```npm start```.

## 1.2 Without github

Comment the lines from 22 to 28, and uncomment the lines from 8 to 15.
Docker will copy the files from the project directory in the container.

## 2. Build it ;)

Now just type ```make build```

## 3. Start it

You only have to make ```make run```, and you will see the output in the stdout.

## 4. Clean it

You can use ```make clean``` to destroy the docker container, and ```make cleanImage``` to delete the docker image.