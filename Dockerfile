FROM node:9.2.0-alpine

RUN apk update && apk add git


##### local version, easier for dev #######

WORKDIR /usr/src/likelyRecommendations

#only this now, for taking advantage of the docker layer's cache
COPY package*.json ./ 

RUN npm install

COPY . .

##### END OF LOCAL VERSION #####


##### Using github #####

#WORKDIR /usr/src/

#RUN git clone https://github.com/Adri-7/likelyRecommendations.git

#WORKDIR /usr/src/likelyRecommendations

#RUN npm install

##### End of using github #####


CMD [ "npm", "start" ]