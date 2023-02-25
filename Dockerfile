FROM node:latest as build

WORKDIR /usr/src/app

COPY . .

RUN npm install

FROM node:slim

WORKDIR /usr/src/app
COPY --from=build /usr/src/app .


CMD ["npm", "test"]